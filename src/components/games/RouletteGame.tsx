import React, { useState, useRef } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playChipSound, playWinChime, playReelTick } from '../../utils/audio';
import { RotateCw, Sparkles, Check, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

interface BetPlacements {
  [key: string]: number; // key: 'red', 'black', 'even', 'odd', '1-18', '19-36', '1st12', 'num-7', etc.
}

export const RouletteGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const chipValues = currency === 'GC' ? [50, 100, 500, 1000] : [0.5, 1, 5, 10];
  const [selectedChip, setSelectedChip] = useState<number>(chipValues[1]);
  const [bets, setBets] = useState<BetPlacements>({});
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([14, 32, 0, 7, 21, 18]);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);

  const totalBetAmount = Object.values(bets).reduce((a, b) => a + b, 0);

  const placeChip = (betKey: string) => {
    if (isSpinning) return;
    playChipSound();
    setBets(prev => ({
      ...prev,
      [betKey]: Number(((prev[betKey] || 0) + selectedChip).toFixed(2))
    }));
  };

  const clearBets = () => {
    if (isSpinning) return;
    playChipSound();
    setBets({});
  };

  const spin = () => {
    if (isSpinning || totalBetAmount <= 0) return;

    const ok = placeBet(totalBetAmount);
    if (!ok) return;

    setIsSpinning(true);
    setWinningNumber(null);
    setLastWinAmount(0);

    // Pick 0 - 36
    const outcome = Math.floor(Math.random() * 37);

    // Dynamic rotation: 5 to 8 full revolutions + target offset
    const extraRotations = 1800 + Math.floor(Math.random() * 720);
    const targetAngle = wheelRotation + extraRotations;
    setWheelRotation(targetAngle);

    const spinInterval = setInterval(() => {
      playReelTick();
    }, 150);

    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      setWinningNumber(outcome);
      setHistory(h => [outcome, ...h.slice(0, 7)]);

      // Calculate payouts
      let totalPayout = 0;
      const isRed = RED_NUMBERS.includes(outcome);
      const isBlack = outcome !== 0 && !isRed;
      const isEven = outcome !== 0 && outcome % 2 === 0;
      const isOdd = outcome !== 0 && outcome % 2 !== 0;

      // Straight up: pays 35 to 1 (+ original bet = 36x)
      if (bets[`num-${outcome}`]) {
        totalPayout += bets[`num-${outcome}`] * 36;
      }
      // Red / Black (2x)
      if (isRed && bets['red']) totalPayout += bets['red'] * 2;
      if (isBlack && bets['black']) totalPayout += bets['black'] * 2;
      // Even / Odd (2x)
      if (isEven && bets['even']) totalPayout += bets['even'] * 2;
      if (isOdd && bets['odd']) totalPayout += bets['odd'] * 2;
      // Low / High (2x)
      if (outcome >= 1 && outcome <= 18 && bets['1-18']) totalPayout += bets['1-18'] * 2;
      if (outcome >= 19 && outcome <= 36 && bets['19-36']) totalPayout += bets['19-36'] * 2;
      // Dozens (3x)
      if (outcome >= 1 && outcome <= 12 && bets['1st12']) totalPayout += bets['1st12'] * 3;
      if (outcome >= 13 && outcome <= 24 && bets['2nd12']) totalPayout += bets['2nd12'] * 3;
      if (outcome >= 25 && outcome <= 36 && bets['3rd12']) totalPayout += bets['3rd12'] * 3;

      if (totalPayout > 0) {
        setLastWinAmount(totalPayout);
        awardWin(totalPayout, Number((totalPayout / totalBetAmount).toFixed(1)), `Roulette Hit on #${outcome}`);
        confetti({ particleCount: 50, spread: 60 });
      }
    }, 3000);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-emerald-600 text-white';
    return RED_NUMBERS.includes(num) ? 'bg-red-600 text-white' : 'bg-slate-900 text-white border border-slate-700';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">European Roulette Royal</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SINGLE ZERO 97.30% RTP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Classic single-zero felt table with outside & inside chip betting</p>
        </div>

        {/* History */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-slate-500 font-medium mr-1">History:</span>
          {history.map((num, i) => (
            <span
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono-numbers ${getNumberColor(num)}`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Wheel & Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 items-center">
        {/* Animated Roulette Wheel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* Outer Rim */}
            <div
              className="w-full h-full rounded-full border-8 border-amber-600/80 shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-transform duration-[3000ms] ease-out flex items-center justify-center relative overflow-hidden"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {/* Pocket dividers simulation */}
              <div className="absolute inset-0 bg-conic from-red-600 via-slate-900 to-red-600 opacity-70" />
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950 border-4 border-amber-500 flex items-center justify-center shadow-inner z-10">
                <span className="text-xs font-bold text-amber-400">VELOCE</span>
              </div>
            </div>

            {/* Ball Marker */}
            <div className={`absolute top-2 w-3.5 h-3.5 rounded-full bg-white shadow-lg transition-all ${isSpinning ? 'animate-ping' : ''}`} />

            {/* Outcome Center Display */}
            {winningNumber !== null && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-2xl animate-bounce ${getNumberColor(winningNumber)}`}>
                  {winningNumber}
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-3">
            <span className="text-xs text-slate-400">
              {isSpinning ? 'Wheel spinning...' : winningNumber !== null ? `Winning Pocket: #${winningNumber}` : 'Place bets to spin'}
            </span>
          </div>
        </div>

        {/* Betting Board Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2 bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-emerald-900/40">
          {/* Numbers Board (0 + 1-36 grid) */}
          <div className="flex gap-1.5">
            {/* Zero */}
            <button
              onClick={() => placeChip('num-0')}
              disabled={isSpinning}
              className="w-12 h-28 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm flex flex-col items-center justify-center relative border border-emerald-500/50"
            >
              <span>0</span>
              {bets['num-0'] && (
                <span className="absolute bottom-1 text-[10px] bg-amber-400 text-slate-950 px-1 rounded-full font-mono-numbers">
                  {bets['num-0']}
                </span>
              )}
            </button>

            {/* 1 to 36 Grid (3 rows x 12 cols) */}
            <div className="grid grid-cols-12 gap-1 flex-1">
              {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
                const betKey = `num-${num}`;
                const isRed = RED_NUMBERS.includes(num);
                return (
                  <button
                    key={num}
                    onClick={() => placeChip(betKey)}
                    disabled={isSpinning}
                    className={`h-9 rounded text-xs font-bold relative flex items-center justify-center transition-colors ${
                      isRed ? 'bg-red-700/80 hover:bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    } ${winningNumber === num ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                  >
                    <span>{num}</span>
                    {bets[betKey] && (
                      <span className="absolute -top-1 -right-1 text-[9px] bg-amber-400 text-slate-950 px-1 rounded-full font-mono-numbers font-bold">
                        {bets[betKey]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dozen Bets */}
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[
              { id: '1st12', label: '1st 12 (1-12)' },
              { id: '2nd12', label: '2nd 12 (13-24)' },
              { id: '3rd12', label: '3rd 12 (25-36)' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => placeChip(d.id)}
                disabled={isSpinning}
                className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-semibold border border-slate-800 relative"
              >
                <span>{d.label}</span>
                {bets[d.id] && (
                  <span className="ml-1.5 text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono-numbers font-bold">
                    {bets[d.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Outside Even Money Bets */}
          <div className="grid grid-cols-6 gap-1.5">
            {[
              { id: '1-18', label: '1 - 18' },
              { id: 'even', label: 'EVEN' },
              { id: 'red', label: 'RED', color: 'bg-red-700 text-white' },
              { id: 'black', label: 'BLACK', color: 'bg-slate-900 text-white border border-slate-700' },
              { id: 'odd', label: 'ODD' },
              { id: '19-36', label: '19 - 36' }
            ].map((out) => (
              <button
                key={out.id}
                onClick={() => placeChip(out.id)}
                disabled={isSpinning}
                className={`py-2 rounded text-xs font-bold relative transition-colors ${
                  out.color || 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                }`}
              >
                <span>{out.label}</span>
                {bets[out.id] && (
                  <span className="block text-[10px] text-amber-400 font-mono-numbers font-bold">
                    {bets[out.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chip Controls & Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Chips Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Chip:</span>
          <div className="flex items-center gap-2">
            {chipValues.map((val) => (
              <button
                key={val}
                onClick={() => {
                  playChipSound();
                  setSelectedChip(val);
                }}
                disabled={isSpinning}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono-numbers font-bold border-2 transition-all ${
                  selectedChip === val
                    ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-md scale-110'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                }`}
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>

          <button
            onClick={clearBets}
            disabled={isSpinning || totalBetAmount === 0}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 ml-2 px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Spin & Bet Summary */}
        <div className="flex items-center gap-4">
          <div className="text-right text-xs font-mono-numbers">
            <span className="text-slate-400 block text-[10px]">TOTAL BET</span>
            <span className="text-white font-bold text-sm">
              {totalBetAmount.toLocaleString()} {currency}
            </span>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || totalBetAmount <= 0}
            className={`px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg transition-all ${
              isSpinning || totalBetAmount <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 active:scale-95 shadow-red-600/30'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
