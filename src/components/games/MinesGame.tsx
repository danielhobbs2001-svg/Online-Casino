import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playChipSound, playCrashExplosion, playWinChime } from '../../utils/audio';
import { Gem, Bomb, ShieldAlert, CheckCircle2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TileState {
  revealed: boolean;
  isMine: boolean;
}

export const MinesGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 100 : 0.50;

  const [bet, setBet] = useState<number>(minBet);
  const [mineCount, setMineCount] = useState<number>(3);
  const [grid, setGrid] = useState<TileState[]>(() =>
    Array(25).fill({ revealed: false, isMine: false })
  );
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'LOST' | 'CASHED_OUT'>('IDLE');
  const [gemsFound, setGemsFound] = useState<number>(0);

  useEffect(() => {
    setBet(currency === 'GC' ? 100 : 0.50);
  }, [currency]);

  // Dynamic multiplier calculation based on gems uncovered & total mines
  const calculateMultiplier = (revealedGems: number, mines: number): number => {
    if (revealedGems === 0) return 1.0;
    let mult = 0.98;
    for (let i = 0; i < revealedGems; i++) {
      mult *= (25 - i) / (25 - mines - i);
    }
    return Number(mult.toFixed(2));
  };

  const currentMultiplier = calculateMultiplier(gemsFound, mineCount);
  const nextMultiplier = calculateMultiplier(gemsFound + 1, mineCount);

  const startGame = () => {
    if (gameState === 'PLAYING') return;

    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();

    // Place mines randomly
    const mineIndices = new Set<number>();
    while (mineIndices.size < mineCount) {
      mineIndices.add(Math.floor(Math.random() * 25));
    }

    const newGrid: TileState[] = Array(25).fill(null).map((_, idx) => ({
      revealed: false,
      isMine: mineIndices.has(idx)
    }));

    setGrid(newGrid);
    setGemsFound(0);
    setGameState('PLAYING');
  };

  const revealTile = (idx: number) => {
    if (gameState !== 'PLAYING' || grid[idx].revealed) return;

    const tile = grid[idx];
    if (tile.isMine) {
      // Detonate!
      playCrashExplosion();
      setGrid(prev => prev.map(t => ({ ...t, revealed: true })));
      setGameState('LOST');
    } else {
      // Gem found!
      playChipSound();
      setGrid(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], revealed: true };
        return next;
      });
      setGemsFound(g => g + 1);
    }
  };

  const cashOut = () => {
    if (gameState !== 'PLAYING' || gemsFound === 0) return;
    const winAmt = Number((bet * currentMultiplier).toFixed(2));
    awardWin(winAmt, currentMultiplier, `Mines ${gemsFound} Diamonds`);
    setGrid(prev => prev.map(t => ({ ...t, revealed: true })));
    setGameState('CASHED_OUT');
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Minesweeper Diamond Hunt</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              98.00% RTP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Uncover gemstones on 5x5 grid · Avoid hidden landmines</p>
        </div>

        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-3 font-mono-numbers text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">CURRENT MULT</span>
              <span className="text-emerald-400 font-bold text-sm">{currentMultiplier}x</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">NEXT GEM</span>
              <span className="text-amber-400 font-bold text-sm">{nextMultiplier}x</span>
            </div>
          </div>
        )}
      </div>

      {/* 5x5 Minefield Grid */}
      <div className="my-4 flex justify-center">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 p-3 sm:p-4 bg-slate-950 rounded-2xl border border-emerald-900/40 shadow-inner max-w-sm w-full">
          {grid.map((tile, idx) => {
            const isClickable = gameState === 'PLAYING' && !tile.revealed;
            return (
              <button
                key={idx}
                onClick={() => revealTile(idx)}
                disabled={!isClickable}
                className={`h-14 sm:h-16 rounded-xl border flex items-center justify-center text-xl transition-all ${
                  tile.revealed
                    ? tile.isMine
                      ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-bounce'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : gameState === 'PLAYING'
                    ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 hover:border-emerald-500/50 active:scale-95 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {tile.revealed ? (
                  tile.isMine ? (
                    <Bomb className="w-6 h-6 fill-current animate-spin" />
                  ) : (
                    <Gem className="w-6 h-6 fill-current animate-pulse" />
                  )
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                )}
              </button>
            );
          })}
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
                disabled={gameState === 'PLAYING'}
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

        {/* Mines selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Mines:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[1, 3, 5, 8].map((m) => (
              <button
                key={m}
                onClick={() => setMineCount(m)}
                disabled={gameState === 'PLAYING'}
                className={`px-2.5 py-1 text-xs font-mono-numbers rounded transition-colors ${
                  mineCount === m
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {gameState === 'PLAYING' ? (
            <button
              onClick={cashOut}
              disabled={gemsFound === 0}
              className={`px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg transition-all ${
                gemsFound === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 active:scale-95 shadow-emerald-500/30 animate-pulse'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CASH OUT ({(bet * currentMultiplier).toFixed(2)} {currency})</span>
            </button>
          ) : (
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all shadow-emerald-600/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START ROUND</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
