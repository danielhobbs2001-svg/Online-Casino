import React, { useState, useEffect, useRef } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playReelTick, playNearMissAnticipation, playWinChime, playJackpotFanfare } from '../../utils/audio';
import { Sparkles, Play, RotateCcw, Volume2, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const SYMBOLS = [
  { id: '777', label: '777', color: 'text-amber-400', bg: 'bg-amber-500/20', mult: 50, icon: '👑' },
  { id: 'crown', label: 'CROWN', color: 'text-yellow-300', bg: 'bg-yellow-500/20', mult: 25, icon: '💎' },
  { id: 'gem', label: 'GEM', color: 'text-cyan-400', bg: 'bg-cyan-500/20', mult: 15, icon: '💠' },
  { id: 'bell', label: 'BELL', color: 'text-rose-400', bg: 'bg-rose-500/20', mult: 10, icon: '🔔' },
  { id: 'bar', label: 'BAR', color: 'text-emerald-400', bg: 'bg-emerald-500/20', mult: 5, icon: '⚡' },
  { id: 'cherry', label: 'CHERRY', color: 'text-red-400', bg: 'bg-red-500/20', mult: 3, icon: '🍒' },
  { id: 'scatter', label: 'SCATTER', color: 'text-purple-400', bg: 'bg-purple-500/20', mult: 100, icon: '⭐' }
];

export const VegasNeonSlot: React.FC = () => {
  const { currency, goldCoins, sweepsCoins, placeBet, awardWin, adBoostMultiplier } = useCasino();
  
  const minBet = currency === 'GC' ? 100 : 0.20;
  const [bet, setBet] = useState<number>(minBet);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reels, setReels] = useState<string[][]>([
    ['777', 'bell', 'bar'],
    ['gem', 'crown', 'cherry'],
    ['bar', '777', 'gem'],
    ['cherry', 'bell', 'scatter'],
    ['bell', 'bar', 'crown']
  ]);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState<number>(0);
  const [isNearMiss, setIsNearMiss] = useState<boolean>(false);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(0);

  // Sync minBet when currency changes
  useEffect(() => {
    setBet(currency === 'GC' ? 100 : 0.20);
  }, [currency]);

  const spin = () => {
    if (isSpinning) return;

    if (freeSpinsLeft > 0) {
      setFreeSpinsLeft(f => f - 1);
    } else {
      const ok = placeBet(bet);
      if (!ok) {
        setAutoSpin(false);
        return;
      }
    }

    setIsSpinning(true);
    setWinningLines([]);
    setLastWin(0);
    setIsNearMiss(false);

    // Initial reel shuffle interval
    const spinTicks = setInterval(() => {
      playReelTick();
    }, 120);

    // Target final outcomes
    const finalReels: string[][] = [];
    let scatterCount = 0;

    for (let col = 0; col < 5; col++) {
      const colSymbols: string[] = [];
      for (let row = 0; row < 3; row++) {
        // Weighted random pick
        const rand = Math.random();
        let sym = SYMBOLS[5]; // cherry
        if (rand < 0.05) sym = SYMBOLS[0]; // 777
        else if (rand < 0.12) sym = SYMBOLS[1]; // crown
        else if (rand < 0.25) sym = SYMBOLS[2]; // gem
        else if (rand < 0.42) sym = SYMBOLS[3]; // bell
        else if (rand < 0.65) sym = SYMBOLS[4]; // bar
        else if (rand < 0.85) sym = SYMBOLS[5]; // cherry
        else sym = SYMBOLS[6]; // scatter

        if (sym.id === 'scatter') scatterCount++;
        colSymbols.push(sym.id);
      }
      finalReels.push(colSymbols);
    }

    // Psychological Near-Miss Trigger Check:
    // If reel 1 and reel 3 contain scatter, trigger slow-down anticipation sound!
    const scatterOnReel1 = finalReels[0].includes('scatter');
    const scatterOnReel2 = finalReels[1].includes('scatter');
    const hasAnticipation = scatterOnReel1 && scatterOnReel2;

    if (hasAnticipation) {
      setTimeout(() => {
        setIsNearMiss(true);
        playNearMissAnticipation();
      }, 700);
    }

    const totalSpinDuration = hasAnticipation ? 2200 : 1200;

    setTimeout(() => {
      clearInterval(spinTicks);
      setReels(finalReels);
      setIsSpinning(false);
      setIsNearMiss(false);

      // Evaluate 3 horizontal paylines
      let totalMultiplier = 0;
      const matchedRows: number[] = [];

      for (let row = 0; row < 3; row++) {
        const s0 = finalReels[0][row];
        const s1 = finalReels[1][row];
        const s2 = finalReels[2][row];
        const s3 = finalReels[3][row];
        const s4 = finalReels[4][row];

        if (s0 === s1 && s1 === s2) {
          // 3-of-a-kind
          matchedRows.push(row);
          const symObj = SYMBOLS.find(s => s.id === s0) || SYMBOLS[5];
          let mult = symObj.mult;
          if (s2 === s3) mult *= 2; // 4-of-a-kind
          if (s3 === s4) mult *= 3; // 5-of-a-kind
          totalMultiplier += mult;
        }
      }

      // Check scatter triggers for 10 free spins
      if (scatterCount >= 3) {
        setFreeSpinsLeft(f => f + 10);
        totalMultiplier += 15;
        playJackpotFanfare();
        confetti({ particleCount: 70, spread: 80 });
      }

      if (totalMultiplier > 0) {
        const winPayout = Number((bet * totalMultiplier).toFixed(2));
        setWinningLines(matchedRows);
        setLastWin(winPayout);
        awardWin(winPayout, totalMultiplier, `${totalMultiplier}x Slot Hit`);
      }

      // Handle autospin loop
      if (autoSpin) {
        setTimeout(() => {
          spin();
        }, 1000);
      }
    }, totalSpinDuration);
  };

  const getSymbolInfo = (id: string) => {
    return SYMBOLS.find(s => s.id === id) || SYMBOLS[0];
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Slot Header info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Neon 777 Rush Deluxe</h2>
            {freeSpinsLeft > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                {freeSpinsLeft} FREE SPINS LEFT
              </span>
            )}
            {adBoostMultiplier > 1 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2X AD BOOST ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">5-Reel High Volatility · RTP 96.65% · Max Win 10,000x</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-numbers">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Win</span>
            <span className="text-emerald-400 font-bold text-sm">
              {lastWin > 0 ? `+${lastWin.toLocaleString()} ${currency}` : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Near Miss Anticipation Banner */}
      {isNearMiss && (
        <div className="my-2 py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border border-purple-500/40 text-center animate-pulse">
          <span className="text-xs font-bold text-purple-200 tracking-wider">
            ⭐ SCATTER ANTICIPATION! WAITING FOR 3RD STAR...
          </span>
        </div>
      )}

      {/* Reels Screen */}
      <div className="relative my-4 p-3 sm:p-4 bg-slate-950 rounded-xl border border-amber-500/30 shadow-inner overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="grid grid-cols-5 gap-2 sm:gap-3 relative z-10">
          {reels.map((col, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-2 p-1.5 sm:p-2 bg-slate-900/90 rounded-lg border transition-all ${
                isNearMiss && colIdx === 4
                  ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.02]'
                  : 'border-slate-800'
              }`}
            >
              {col.map((symId, rowIdx) => {
                const sym = getSymbolInfo(symId);
                const isWinRow = winningLines.includes(rowIdx);
                return (
                  <div
                    key={rowIdx}
                    className={`h-16 sm:h-20 flex flex-col items-center justify-center rounded-lg border transition-all ${
                      sym.bg
                    } ${
                      isWinRow
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg shadow-amber-500/20 animate-pulse'
                        : 'border-slate-800/60'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl select-none">{sym.icon}</span>
                    <span className={`text-[10px] font-bold tracking-wider mt-1 ${sym.color}`}>
                      {sym.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Payline indicators */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-14 sm:gap-18 pointer-events-none">
          <span className="text-[10px] font-bold text-amber-500/70">L1</span>
          <span className="text-[10px] font-bold text-amber-500/70">L2</span>
          <span className="text-[10px] font-bold text-amber-500/70">L3</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Bet ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 25].map((amt) => (
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

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoSpin(!autoSpin)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              autoSpin
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {autoSpin ? 'Stop Auto' : 'Auto Spin'}
          </button>

          <button
            onClick={spin}
            disabled={isSpinning}
            className={`px-6 py-2.5 text-sm font-bold tracking-wide rounded-lg flex items-center gap-2 shadow-lg transition-all ${
              isSpinning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 shadow-amber-500/25'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'SPINNING...' : freeSpinsLeft > 0 ? 'FREE SPIN' : 'SPIN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
