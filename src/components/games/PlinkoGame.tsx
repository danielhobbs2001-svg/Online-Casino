import React, { useState, useRef, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playPlinkoBounce, playWinChime } from '../../utils/audio';
import { Play, Sparkles, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiplierBucket {
  label: string;
  value: number;
  color: string;
}

const MULTIPLIERS_HIGH: Record<number, number[]> = {
  8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  10: [76, 10, 3, 0.9, 0.2, 0.2, 0.9, 3, 10, 76],
  12: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.7, 2, 8.1, 24, 170]
};

export const PlinkoGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 50 : 0.20;

  const [bet, setBet] = useState<number>(minBet);
  const [rows, setRows] = useState<number>(10);
  const [activeBalls, setActiveBalls] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; row: number; active: boolean }>>([]);

  useEffect(() => {
    setBet(currency === 'GC' ? 50 : 0.20);
  }, [currency]);

  const multipliers = MULTIPLIERS_HIGH[rows] || MULTIPLIERS_HIGH[10];

  const dropBall = () => {
    const ok = placeBet(bet);
    if (!ok) return;

    setActiveBalls(b => b + 1);

    // Initial peg coordinate
    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = canvas.width / 2;
    const startY = 30;

    ballsRef.current.push({
      x: startX + (Math.random() - 0.5) * 6,
      y: startY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.8,
      row: 0,
      active: true
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rowSpacing = (canvas.height - 70) / (rows + 1);
      const pegRadius = 3;

      // Draw Pegs Matrix
      for (let r = 0; r < rows; r++) {
        const pegsInRow = r + 3;
        const startX = canvas.width / 2 - ((pegsInRow - 1) * 24) / 2;
        const y = 45 + r * rowSpacing;

        for (let p = 0; p < pegsInRow; p++) {
          const x = startX + p * 24;
          ctx.beginPath();
          ctx.arc(x, y, pegRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#94a3b8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 4;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // Update & Draw Balls
      ballsRef.current.forEach((ball, idx) => {
        if (!ball.active) return;

        ball.vy += 0.18; // gravity
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Collision check with pegs
        const r = Math.floor((ball.y - 45) / rowSpacing);
        if (r >= 0 && r < rows && r !== ball.row) {
          ball.row = r;
          ball.vx += (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4);
          ball.vx *= 0.85;
          playPlinkoBounce(1 + (r / rows) * 0.5);
        }

        // Draw glowing ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Landed in bottom bucket
        if (ball.y >= canvas.height - 35) {
          ball.active = false;
          setActiveBalls(b => Math.max(0, b - 1));

          // Determine landing bucket
          const bucketWidth = canvas.width / multipliers.length;
          const bucketIndex = Math.min(
            multipliers.length - 1,
            Math.max(0, Math.floor(ball.x / bucketWidth))
          );
          const mult = multipliers[bucketIndex] || 1;
          const win = Number((bet * mult).toFixed(2));
          setLastWin(win);
          awardWin(win, mult, `Plinko ${mult}x Bucket`);

          if (mult >= 10) {
            confetti({ particleCount: 50, spread: 60 });
          }
        }
      });

      // Filter out inactive balls
      ballsRef.current = ballsRef.current.filter(b => b.active);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [rows, multipliers, bet, awardWin]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Plinko Galaxy Drop</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              98.00% RTP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Customizable peg rows · High-variance dynamic multiplier buckets</p>
        </div>

        <div className="text-right text-xs font-mono-numbers">
          <span className="text-slate-400 block text-[10px]">LAST BUCKET WIN</span>
          <span className="text-emerald-400 font-bold text-sm">
            {lastWin > 0 ? `+${lastWin.toLocaleString()} ${currency}` : '0.00'}
          </span>
        </div>
      </div>

      {/* Canvas Peg Matrix */}
      <div className="relative my-4 flex flex-col items-center bg-slate-950 p-2 sm:p-4 rounded-xl border border-cyan-900/40 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={420}
          height={340}
          className="max-w-full h-auto block"
        />

        {/* Multiplier Bucket Labels at the bottom */}
        <div className="grid w-full max-w-[420px] gap-1 mt-1" style={{ gridTemplateColumns: `repeat(${multipliers.length}, minmax(0, 1fr))` }}>
          {multipliers.map((m, idx) => (
            <div
              key={idx}
              className={`py-1 text-center rounded text-[10px] font-bold font-mono-numbers ${
                m >= 20
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : m >= 3
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : m >= 1
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {m}x
            </div>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Bet ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 20].map((amt) => (
              <button
                key={amt}
                onClick={() => setBet(Number(amt.toFixed(2)))}
                className={`px-2.5 py-1 text-xs font-mono-numbers rounded transition-colors ${
                  bet === Number(amt.toFixed(2))
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* Rows setting */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Rows:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[8, 10, 12].map((r) => (
              <button
                key={r}
                onClick={() => setRows(r)}
                className={`px-2.5 py-1 text-xs font-mono-numbers rounded transition-colors ${
                  rows === r
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Drop Ball Action */}
        <button
          onClick={dropBall}
          className="px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 hover:to-blue-400 active:scale-95 shadow-cyan-500/25 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>DROP BALL ({activeBalls})</span>
        </button>
      </div>
    </div>
  );
};
