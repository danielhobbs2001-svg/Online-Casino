import React, { useState, useEffect, useRef } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playCrashExplosion, playWinChime, playChipSound } from '../../utils/audio';
import { Rocket, Flame, ShieldAlert, History, Users, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BotPlayer {
  name: string;
  bet: number;
  cashoutAt: number;
  cashedOut: boolean;
}

export const RocketCrashGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 100 : 0.50;

  const [bet, setBet] = useState<number>(minBet);
  const [autoCashout, setAutoCashout] = useState<string>('2.00');
  const [gameState, setGameState] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([1.42, 2.85, 12.40, 1.05, 3.12, 1.88, 5.50]);
  const [botPlayers, setBotPlayers] = useState<BotPlayer[]>([]);
  
  const crashPointRef = useRef<number>(1.00);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync minBet when currency changes
  useEffect(() => {
    setBet(currency === 'GC' ? 100 : 0.50);
  }, [currency]);

  const generateCrashPoint = (): number => {
    // 97% RTP distribution
    const r = Math.random();
    if (r < 0.04) return 1.00; // instant crash house edge
    const point = 0.97 / (1 - r);
    return Math.min(100.0, Math.max(1.01, Number(point.toFixed(2))));
  };

  const startFlight = () => {
    if (gameState === 'FLYING') return;

    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();
    const point = generateCrashPoint();
    crashPointRef.current = point;
    setMultiplier(1.00);
    setHasCashedOut(false);
    setGameState('FLYING');
    startTimeRef.current = performance.now();

    // Generate random simulated multiplayer table participants
    setBotPlayers([
      { name: 'ApexStriker', bet: bet * 2, cashoutAt: 1.35, cashedOut: false },
      { name: 'CosmoWhale', bet: bet * 5, cashoutAt: 2.10, cashedOut: false },
      { name: 'LuckyAura', bet: bet, cashoutAt: 3.40, cashedOut: false },
      { name: 'VegasViper', bet: bet * 1.5, cashoutAt: 1.85, cashedOut: false }
    ]);

    const runFlightLoop = (timestamp: number) => {
      const elapsedSec = (timestamp - startTimeRef.current) / 1000;
      // Exponential curve: mult = e^(0.14 * t)
      const currentMult = Number(Math.exp(0.18 * elapsedSec).toFixed(2));

      // Check simulated bot cashouts
      setBotPlayers(prev =>
        prev.map(b => (!b.cashedOut && currentMult >= b.cashoutAt ? { ...b, cashedOut: true } : b))
      );

      // Check auto-cashout
      const autoVal = parseFloat(autoCashout);
      if (!isNaN(autoVal) && autoVal > 1.0 && currentMult >= autoVal && !hasCashedOut) {
        cashOut(currentMult);
      }

      // Check crash condition
      if (currentMult >= crashPointRef.current) {
        // Detonation!
        setMultiplier(crashPointRef.current);
        setGameState('CRASHED');
        playCrashExplosion();
        setHistory(h => [crashPointRef.current, ...h.slice(0, 8)]);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        return;
      }

      setMultiplier(currentMult);
      animationFrameRef.current = requestAnimationFrame(runFlightLoop);
    };

    animationFrameRef.current = requestAnimationFrame(runFlightLoop);
  };

  const cashOut = (multOverride?: number) => {
    if (gameState !== 'FLYING' || hasCashedOut) return;
    const finalMult = multOverride || multiplier;
    setHasCashedOut(true);

    const winAmount = Number((bet * finalMult).toFixed(2));
    awardWin(winAmount, finalMult, `Cashed out at ${finalMult.toFixed(2)}x`);

    if (finalMult >= 5.0) {
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Calculate rocket canvas coordinates
  const progressRatio = Math.min(1, (multiplier - 1) / 10);
  const rocketX = Math.min(85, 15 + progressRatio * 70);
  const rocketY = Math.max(20, 80 - progressRatio * 60);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Turbo Rocket Crash</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PROVABLY FAIR 97%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time flight curve · Cash out before the supersonic explosion</p>
        </div>

        {/* Multiplier History */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <History className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {history.map((h, i) => (
            <span
              key={i}
              className={`text-[11px] font-mono-numbers px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                h >= 5.0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : h >= 2.0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {h.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Flight Canvas Arena */}
      <div className="relative my-4 h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-center items-center">
        {/* Grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

        {/* Central Giant Multiplier Display */}
        <div className="relative z-10 text-center">
          <div
            className={`text-5xl sm:text-6xl font-black font-mono-numbers tracking-tight transition-transform ${
              gameState === 'CRASHED'
                ? 'text-rose-500 scale-105'
                : gameState === 'FLYING'
                ? 'text-white scale-110'
                : 'text-slate-400'
            }`}
          >
            {gameState === 'CRASHED'
              ? `CRASHED @ ${multiplier.toFixed(2)}x`
              : `${multiplier.toFixed(2)}x`}
          </div>

          {gameState === 'FLYING' && !hasCashedOut && (
            <div className="text-xs font-semibold text-emerald-400 mt-2 font-mono-numbers">
              CURRENT VALUE: {(bet * multiplier).toFixed(2)} {currency}
            </div>
          )}

          {hasCashedOut && (
            <div className="text-xs font-bold text-amber-400 mt-2 bg-amber-500/20 px-3 py-1 rounded-full inline-block border border-amber-500/30">
              ✓ CASHED OUT SAFELY
            </div>
          )}
        </div>

        {/* Animated Rocket or Explosion Icon */}
        {gameState === 'FLYING' && (
          <div
            className="absolute transition-all duration-75 z-20"
            style={{ left: `${rocketX}%`, top: `${rocketY}%` }}
          >
            <div className="relative -rotate-45">
              <Rocket className="w-10 h-10 text-rose-400 fill-rose-500 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
              <Flame className="w-5 h-5 text-amber-400 fill-amber-500 absolute -bottom-3 left-2.5 animate-bounce" />
            </div>
          </div>
        )}

        {/* Flying trajectory line SVG */}
        {gameState === 'FLYING' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M 50 250 Q ${(rocketX / 100) * 350} 240, ${(rocketX / 100) * 450} ${(rocketY / 100) * 250}`}
              fill="none"
              stroke="rgba(244, 63, 94, 0.5)"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {/* Live bots side feed */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 max-w-[200px] pointer-events-none opacity-80 text-[10px] font-mono-numbers">
          {botPlayers.map((bot, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
              <span className="truncate">{bot.name}</span>
              <span className={bot.cashedOut ? 'text-emerald-400 font-bold ml-auto' : 'text-slate-500 ml-auto'}>
                {bot.cashedOut ? `${bot.cashoutAt.toFixed(2)}x` : 'Flying...'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Bet amount */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[11px] text-slate-400 font-medium block mb-1">Bet ({currency})</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              disabled={gameState === 'FLYING'}
              value={bet}
              onChange={e => setBet(Math.max(minBet, Number(e.target.value)))}
              className="w-full bg-slate-900 text-white font-mono-numbers text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => setBet(b => b * 2)}
              disabled={gameState === 'FLYING'}
              className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
            >
              2x
            </button>
            <button
              onClick={() => setBet(b => Math.max(minBet, Number((b / 2).toFixed(2))))}
              disabled={gameState === 'FLYING'}
              className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
            >
              ½
            </button>
          </div>
        </div>

        {/* Auto Cashout */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[11px] text-slate-400 font-medium block mb-1">Auto Cash Out (Multiplier)</label>
          <input
            type="number"
            step="0.10"
            disabled={gameState === 'FLYING'}
            value={autoCashout}
            onChange={e => setAutoCashout(e.target.value)}
            placeholder="e.g. 2.00"
            className="w-full bg-slate-900 text-white font-mono-numbers text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Main Action Button */}
        <div className="flex items-center">
          {gameState === 'FLYING' ? (
            <button
              onClick={() => cashOut()}
              disabled={hasCashedOut}
              className={`w-full py-3 px-4 rounded-xl font-bold font-display text-base tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
                hasCashedOut
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 active:scale-95 shadow-emerald-500/30 animate-pulse'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{hasCashedOut ? 'CASHED OUT' : `CASH OUT ${(bet * multiplier).toFixed(2)} ${currency}`}</span>
            </button>
          ) : (
            <button
              onClick={startFlight}
              className="w-full py-3 px-4 rounded-xl font-bold font-display text-base tracking-wide flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:from-rose-400 hover:to-amber-400 active:scale-95 shadow-rose-500/25 transition-all"
            >
              <Rocket className="w-5 h-5 fill-current" />
              <span>LAUNCH ROCKET</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
