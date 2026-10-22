import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playChipSound, playWinChime, playJackpotFanfare } from '../../utils/audio';
import { Sparkles, Wand2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchTile {
  id: number;
  symbol: string;
  mult: number;
  revealed: boolean;
}

const SCRATCH_ICONS = [
  { sym: '🍀', mult: 50, label: 'GOLD CLOVER' },
  { sym: '💎', mult: 20, label: 'ROYAL GEM' },
  { sym: '👑', mult: 10, label: 'GOLD CROWN' },
  { sym: '⚡', mult: 5, label: 'THUNDER BOLT' },
  { sym: '🍒', mult: 2, label: 'DOUBLE CHERRY' },
  { sym: '🪙', mult: 1, label: 'SILVER COIN' }
];

export const InstantScratcher: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 50 : 0.50;

  const [bet, setBet] = useState<number>(minBet);
  const [tiles, setTiles] = useState<ScratchTile[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  useEffect(() => {
    setBet(currency === 'GC' ? 50 : 0.50);
  }, [currency]);

  const initCard = () => {
    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();
    setIsPlaying(true);
    setGameResult(null);

    // Decide if this card is a winner (38% win probability)
    const isWinner = Math.random() < 0.38;
    const generated: ScratchTile[] = [];

    if (isWinner) {
      // Pick winning symbol
      const winIcon = SCRATCH_ICONS[Math.floor(Math.random() * SCRATCH_ICONS.length)];
      // Add 3 matching
      for (let i = 0; i < 3; i++) {
        generated.push({ id: i, symbol: winIcon.sym, mult: winIcon.mult, revealed: false });
      }
      // Fill remaining 6 with random non-tripling symbols
      while (generated.length < 9) {
        const randIcon = SCRATCH_ICONS[Math.floor(Math.random() * SCRATCH_ICONS.length)];
        generated.push({ id: generated.length, symbol: randIcon.sym, mult: randIcon.mult, revealed: false });
      }
    } else {
      // Non winning mix (guarantee max 2 of any symbol)
      const counts: Record<string, number> = {};
      while (generated.length < 9) {
        const icon = SCRATCH_ICONS[Math.floor(Math.random() * SCRATCH_ICONS.length)];
        if ((counts[icon.sym] || 0) < 2) {
          counts[icon.sym] = (counts[icon.sym] || 0) + 1;
          generated.push({ id: generated.length, symbol: icon.sym, mult: icon.mult, revealed: false });
        }
      }
    }

    // Shuffle tiles
    const shuffled = generated.sort(() => Math.random() - 0.5).map((t, idx) => ({ ...t, id: idx }));
    setTiles(shuffled);
  };

  const revealTile = (idx: number) => {
    if (!isPlaying || tiles[idx]?.revealed) return;
    playChipSound();

    const updated = [...tiles];
    updated[idx].revealed = true;
    setTiles(updated);

    checkCardCompletion(updated);
  };

  const autoScratchAll = () => {
    if (!isPlaying) return;
    const updated = tiles.map(t => ({ ...t, revealed: true }));
    setTiles(updated);
    checkCardCompletion(updated);
  };

  const checkCardCompletion = (cardTiles: ScratchTile[]) => {
    const allRevealed = cardTiles.every(t => t.revealed);
    if (!allRevealed) return;

    setIsPlaying(false);

    // Count symbols
    const counts: Record<string, number> = {};
    let winningSym = '';
    let winMult = 0;

    for (const t of cardTiles) {
      counts[t.symbol] = (counts[t.symbol] || 0) + 1;
      if (counts[t.symbol] >= 3) {
        winningSym = t.symbol;
        winMult = t.mult;
      }
    }

    if (winMult > 0) {
      const winAmt = Number((bet * winMult).toFixed(2));
      setGameResult(`Matched 3x ${winningSym}! Won ${winAmt} ${currency} (${winMult}x)!`);
      awardWin(winAmt, winMult, `Scratch 3x ${winningSym}`);
      if (winMult >= 10) {
        playJackpotFanfare();
        confetti({ particleCount: 60, spread: 70 });
      } else {
        playWinChime();
      }
    } else {
      setGameResult('No match. Try again!');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Golden Clover Scratchcard</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TRIPLE MATCH 50X
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Scratch the gold clovers to uncover 3 matching winning symbols</p>
        </div>

        {gameResult && (
          <div className="text-sm font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            {gameResult}
          </div>
        )}
      </div>

      {/* Scratcher Card Surface */}
      <div className="my-6 flex justify-center">
        <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-950/80 to-slate-950 rounded-2xl border-2 border-amber-500/40 shadow-2xl max-w-sm w-full">
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              MATCH 3 TO WIN INSTANTLY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {tiles.length === 0 ? (
              Array(9).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner text-amber-950 font-black opacity-80"
                >
                  🍀
                </div>
              ))
            ) : (
              tiles.map((tile, idx) => (
                <button
                  key={tile.id}
                  onClick={() => revealTile(idx)}
                  disabled={tile.revealed || !isPlaying}
                  className={`h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    tile.revealed
                      ? 'bg-slate-900 border-amber-500/50 shadow-inner'
                      : 'bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 border-amber-400 hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                  }`}
                >
                  {tile.revealed ? (
                    <>
                      <span className="text-3xl select-none animate-in zoom-in-75 duration-200">{tile.symbol}</span>
                      <span className="text-[10px] text-amber-400 font-bold font-mono-numbers mt-0.5">
                        {tile.mult}x
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl text-amber-950 font-black">🍀</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Card Price ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10].map((amt) => (
              <button
                key={amt}
                onClick={() => setBet(Number(amt.toFixed(2)))}
                disabled={isPlaying}
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={autoScratchAll}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>SCRATCH ALL</span>
            </button>
          ) : (
            <button
              onClick={initCard}
              className="px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 active:scale-95 transition-all shadow-emerald-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>BUY NEW CARD ({bet} {currency})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
