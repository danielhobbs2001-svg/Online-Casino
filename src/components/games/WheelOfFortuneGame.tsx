import React, { useState, useRef, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playChipSound, playWinChime, playJackpotFanfare } from '../../utils/audio';
import { RotateCw, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const WHEEL_SEGMENTS = [
  { label: '2X', mult: 2, color: '#3b82f6' },
  { label: '0.5X', mult: 0.5, color: '#64748b' },
  { label: '5X', mult: 5, color: '#8b5cf6' },
  { label: '1X', mult: 1, color: '#475569' },
  { label: '10X', mult: 10, color: '#ec4899' },
  { label: '0X', mult: 0, color: '#1e293b' },
  { label: '25X', mult: 25, color: '#f59e0b' },
  { label: '1.5X', mult: 1.5, color: '#0ea5e9' },
  { label: '50X', mult: 50, color: '#ef4444' },
  { label: '2X', mult: 2, color: '#3b82f6' },
  { label: '0.5X', mult: 0.5, color: '#64748b' },
  { label: '15X', mult: 15, color: '#10b981' },
  { label: '1X', mult: 1, color: '#475569' },
  { label: '100X', mult: 100, color: '#eab308' },
  { label: '3X', mult: 3, color: '#06b6d4' },
  { label: '5X', mult: 5, color: '#8b5cf6' }
];

export const WheelOfFortuneGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 100 : 1.00;

  const [bet, setBet] = useState<number>(minBet);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [wonSegment, setWonSegment] = useState<string | null>(null);

  useEffect(() => {
    setBet(currency === 'GC' ? 100 : 1.00);
  }, [currency]);

  const spinWheel = () => {
    if (isSpinning) return;
    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();
    setIsSpinning(true);
    setWonSegment(null);

    // Pick random segment
    const targetIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    
    // Top pointer is at 270 degrees in canvas
    const targetSegmentOffset = targetIndex * segmentAngle;
    const extraFullRotations = 360 * 6; // 6 full spins
    const targetTotalAngle = currentAngle + extraFullRotations + (360 - targetSegmentOffset);

    setCurrentAngle(targetTotalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_SEGMENTS[targetIndex];
      setWonSegment(chosen.label);

      if (chosen.mult > 0) {
        const winAmt = Number((bet * chosen.mult).toFixed(2));
        awardWin(winAmt, chosen.mult, `Mega Wheel ${chosen.label}`);
        if (chosen.mult >= 25) {
          playJackpotFanfare();
          confetti({ particleCount: 70, spread: 80 });
        }
      }
    }, 4000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Mega Fortune Spin Wheel</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              100X TOP MULTIPLIER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">High roller luxury wheel with instant multiplier cash drops</p>
        </div>

        {wonSegment && (
          <div className="text-sm font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            Landed on {wonSegment}!
          </div>
        )}
      </div>

      {/* Wheel Visual Container */}
      <div className="my-6 flex flex-col items-center justify-center relative">
        {/* Top Pointer */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 z-20 drop-shadow-lg mb-[-12px]" />

        {/* Outer Wheel Rim */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center overflow-hidden bg-slate-950">
          {/* Rotatable wheel segments */}
          <div
            className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.12, 0.8, 0.2, 1) relative"
            style={{ transform: `rotate(${currentAngle}deg)` }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const rotation = idx * (360 / WHEEL_SEGMENTS.length);
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex justify-center items-start pt-2 origin-center"
                  style={{
                    transform: `rotate(${rotation}deg)`
                  }}
                >
                  <span
                    className="text-[11px] font-bold font-mono-numbers px-1 rounded"
                    style={{ color: seg.color }}
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute w-20 h-20 rounded-full bg-slate-950 border-4 border-amber-500 flex items-center justify-center shadow-2xl z-10">
            <span className="text-xs font-black text-amber-400 tracking-wider">VELOCE</span>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Bet ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10].map((amt) => (
              <button
                key={amt}
                onClick={() => setBet(Number(amt.toFixed(2)))}
                disabled={isSpinning}
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

        {/* Spin Action */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg transition-all ${
            isSpinning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 shadow-amber-500/25'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'SPINNING...' : 'SPIN MEGA WHEEL'}</span>
        </button>
      </div>
    </div>
  );
};
