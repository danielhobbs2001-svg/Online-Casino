import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playCardFlip, playChipSound, playWinChime, playJackpotFanfare } from '../../utils/audio';
import { Play, RotateCcw, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PokerCard {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  val: number;
  isRed: boolean;
  held: boolean;
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const RANKS = [
  { r: '2', v: 2 }, { r: '3', v: 3 }, { r: '4', v: 4 }, { r: '5', v: 5 },
  { r: '6', v: 6 }, { r: '7', v: 7 }, { r: '8', v: 8 }, { r: '9', v: 9 },
  { r: '10', v: 10 }, { r: 'J', v: 11 }, { r: 'Q', v: 12 }, { r: 'K', v: 13 },
  { r: 'A', v: 14 }
];

const PAYTABLE = [
  { hand: 'Royal Flush', mult: 800 },
  { hand: 'Straight Flush', mult: 50 },
  { hand: 'Four of a Kind', mult: 25 },
  { hand: 'Full House', mult: 9 },
  { hand: 'Flush', mult: 6 },
  { hand: 'Straight', mult: 4 },
  { hand: 'Three of a Kind', mult: 3 },
  { hand: 'Two Pair', mult: 2 },
  { hand: 'Jacks or Better', mult: 1 }
];

export const VideoPoker: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 50 : 0.50;

  const [bet, setBet] = useState<number>(minBet);
  const [cards, setCards] = useState<PokerCard[]>([]);
  const [stage, setStage] = useState<'BETTING' | 'DRAW' | 'RESOLVED'>('BETTING');
  const [handResult, setHandResult] = useState<string>('');

  useEffect(() => {
    setBet(currency === 'GC' ? 50 : 0.50);
  }, [currency]);

  const drawCard = (excludeList: PokerCard[] = []): PokerCard => {
    while (true) {
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const rankObj = RANKS[Math.floor(Math.random() * RANKS.length)];
      const exists = excludeList.some(c => c.suit === suit && c.rank === rankObj.r);
      if (!exists) {
        return {
          suit,
          rank: rankObj.r,
          val: rankObj.v,
          isRed: suit === '♥' || suit === '♦',
          held: false
        };
      }
    }
  };

  const dealHand = () => {
    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();
    playCardFlip();
    setHandResult('');

    const newCards: PokerCard[] = [];
    for (let i = 0; i < 5; i++) {
      newCards.push(drawCard(newCards));
    }
    setCards(newCards);
    setStage('DRAW');
  };

  const toggleHold = (idx: number) => {
    if (stage !== 'DRAW') return;
    playChipSound();
    setCards(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], held: !next[idx].held };
      return next;
    });
  };

  const evaluateHand = (hand: PokerCard[]): { name: string; mult: number } => {
    const vals = hand.map(c => c.val).sort((a, b) => a - b);
    const suits = hand.map(c => c.suit);
    const isFlush = suits.every(s => s === suits[0]);

    // Check straight
    let isStraight = false;
    if (vals[4] - vals[0] === 4 && new Set(vals).size === 5) {
      isStraight = true;
    } else if (vals[0] === 2 && vals[1] === 3 && vals[2] === 4 && vals[3] === 5 && vals[4] === 14) {
      // Ace-low straight (A-2-3-4-5)
      isStraight = true;
    }

    const counts: Record<number, number> = {};
    vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const countsArr = Object.values(counts).sort((a, b) => b - a);

    // Royal Flush
    if (isFlush && isStraight && vals[4] === 14 && vals[0] === 10) {
      return { name: 'Royal Flush', mult: 800 };
    }
    // Straight Flush
    if (isFlush && isStraight) {
      return { name: 'Straight Flush', mult: 50 };
    }
    // Four of a Kind
    if (countsArr[0] === 4) {
      return { name: 'Four of a Kind', mult: 25 };
    }
    // Full House
    if (countsArr[0] === 3 && countsArr[1] === 2) {
      return { name: 'Full House', mult: 9 };
    }
    // Flush
    if (isFlush) {
      return { name: 'Flush', mult: 6 };
    }
    // Straight
    if (isStraight) {
      return { name: 'Straight', mult: 4 };
    }
    // Three of a Kind
    if (countsArr[0] === 3) {
      return { name: 'Three of a Kind', mult: 3 };
    }
    // Two Pair
    if (countsArr[0] === 2 && countsArr[1] === 2) {
      return { name: 'Two Pair', mult: 2 };
    }
    // Jacks or Better
    if (countsArr[0] === 2) {
      const pairVal = Object.keys(counts).find(v => counts[Number(v)] === 2);
      if (pairVal && Number(pairVal) >= 11) {
        return { name: 'Jacks or Better', mult: 1 };
      }
    }

    return { name: 'High Card', mult: 0 };
  };

  const drawPhase = () => {
    if (stage !== 'DRAW') return;
    playCardFlip();

    const currentHeld = cards.filter(c => c.held);
    const finalCards: PokerCard[] = cards.map(c => {
      if (c.held) return c;
      return drawCard([...currentHeld, ...cards]);
    });

    setCards(finalCards);
    setStage('RESOLVED');

    const evalResult = evaluateHand(finalCards);
    if (evalResult.mult > 0) {
      const winAmt = Number((bet * evalResult.mult).toFixed(2));
      setHandResult(`${evalResult.name}! Won ${winAmt} ${currency} (${evalResult.mult}x)`);
      awardWin(winAmt, evalResult.mult, `Poker ${evalResult.name}`);
      if (evalResult.mult >= 25) {
        playJackpotFanfare();
        confetti({ particleCount: 70, spread: 80 });
      } else {
        playWinChime();
      }
    } else {
      setHandResult('No winning hand. Better luck next deal!');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Jacks or Better Video Poker</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              9/6 FULL PAY 99.54%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Classic draw poker · Royal Flush pays 800:1</p>
        </div>

        {handResult && (
          <div className="text-sm font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            {handResult}
          </div>
        )}
      </div>

      {/* Paytable Horizontal Strip */}
      <div className="my-3 overflow-x-auto bg-slate-950 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 min-w-max text-[11px] font-mono-numbers">
          {PAYTABLE.map((p, i) => (
            <div key={i} className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-center">
              <span className="text-slate-400 block text-[9px]">{p.hand}</span>
              <span className="text-amber-400 font-bold">{p.mult}x</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Cards Deal Area */}
      <div className="my-6 flex justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {cards.length === 0 ? (
            Array(5).fill(null).map((_, i) => (
              <div
                key={i}
                className="w-16 h-24 sm:w-20 sm:h-32 bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-700 font-bold"
              >
                🂠
              </div>
            ))
          ) : (
            cards.map((c, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => toggleHold(idx)}
                  disabled={stage !== 'DRAW'}
                  className={`w-16 h-24 sm:w-20 sm:h-32 rounded-xl border-2 shadow-xl flex flex-col justify-between p-2 transition-all ${
                    c.held
                      ? 'border-amber-400 ring-2 ring-amber-400/50 -translate-y-2'
                      : 'border-slate-300'
                  } bg-white ${c.isRed ? 'text-red-600' : 'text-slate-900'} cursor-pointer hover:shadow-2xl`}
                >
                  <div className="text-sm font-bold leading-none">{c.rank}</div>
                  <div className="text-2xl sm:text-3xl text-center">{c.suit}</div>
                  <div className="text-sm font-bold leading-none text-right">{c.rank}</div>
                </button>
                {c.held && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-wider font-mono-numbers">
                    HELD
                  </span>
                )}
              </div>
            ))
          )}
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
                disabled={stage === 'DRAW'}
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

        {/* Action Button */}
        <div>
          {stage === 'DRAW' ? (
            <button
              onClick={drawPhase}
              className="px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 shadow-amber-500/25 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>DRAW REPLACEMENTS</span>
            </button>
          ) : (
            <button
              onClick={dealHand}
              className="px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-blue-600/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>DEAL 5 CARDS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
