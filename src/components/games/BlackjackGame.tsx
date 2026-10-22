import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { playCardFlip, playChipSound, playWinChime } from '../../utils/audio';
import { Play, Plus, Hand, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  value: number;
  isRed: boolean;
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const RANKS = [
  { r: '2', v: 2 },
  { r: '3', v: 3 },
  { r: '4', v: 4 },
  { r: '5', v: 5 },
  { r: '6', v: 6 },
  { r: '7', v: 7 },
  { r: '8', v: 8 },
  { r: '9', v: 9 },
  { r: '10', v: 10 },
  { r: 'J', v: 10 },
  { r: 'Q', v: 10 },
  { r: 'K', v: 10 },
  { r: 'A', v: 11 }
];

export const BlackjackGame: React.FC = () => {
  const { currency, placeBet, awardWin } = useCasino();
  const minBet = currency === 'GC' ? 100 : 1.00;

  const [bet, setBet] = useState<number>(minBet);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerHoleCardHidden, setDealerHoleCardHidden] = useState<boolean>(true);
  const [gameStage, setGameStage] = useState<'BETTING' | 'PLAYER_TURN' | 'RESOLVED'>('BETTING');
  const [resultMessage, setResultMessage] = useState<string>('');

  useEffect(() => {
    setBet(currency === 'GC' ? 100 : 1.00);
  }, [currency]);

  const drawCard = (): Card => {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const rankObj = RANKS[Math.floor(Math.random() * RANKS.length)];
    return {
      suit,
      rank: rankObj.r,
      value: rankObj.v,
      isRed: suit === '♥' || suit === '♦'
    };
  };

  const calculateScore = (hand: Card[]): number => {
    let sum = 0;
    let aces = 0;
    for (const c of hand) {
      sum += c.value;
      if (c.rank === 'A') aces++;
    }
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const startHand = () => {
    if (gameStage === 'PLAYER_TURN') return;

    const ok = placeBet(bet);
    if (!ok) return;

    playChipSound();
    playCardFlip();

    const p1 = drawCard();
    const d1 = drawCard();
    const p2 = drawCard();
    const d2 = drawCard();

    const newPlayerHand = [p1, p2];
    const newDealerHand = [d1, d2];

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDealerHoleCardHidden(true);
    setResultMessage('');

    // Check immediate Natural Blackjack
    const pScore = calculateScore(newPlayerHand);
    if (pScore === 21) {
      // Natural 21!
      setDealerHoleCardHidden(false);
      const dScore = calculateScore(newDealerHand);
      if (dScore === 21) {
        setResultMessage('Push! Both hold Blackjack.');
        awardWin(bet, 1, 'Blackjack Push');
      } else {
        const winAmt = bet * 2.5; // 3:2 payout + stake back
        setResultMessage('BLACKJACK 3:2! Natural 21!');
        awardWin(winAmt, 2.5, 'Natural Blackjack');
        confetti({ particleCount: 60, spread: 70 });
      }
      setGameStage('RESOLVED');
    } else {
      setGameStage('PLAYER_TURN');
    }
  };

  const hit = () => {
    if (gameStage !== 'PLAYER_TURN') return;
    playCardFlip();

    const nextCard = drawCard();
    const updated = [...playerHand, nextCard];
    setPlayerHand(updated);

    const score = calculateScore(updated);
    if (score > 21) {
      // Bust
      setDealerHoleCardHidden(false);
      setGameStage('RESOLVED');
      setResultMessage('Bust! Over 21.');
    }
  };

  const stand = () => {
    if (gameStage !== 'PLAYER_TURN') return;
    setDealerHoleCardHidden(false);

    // Dealer AI draws until at least 17
    let currentDealerHand = [...dealerHand];
    let dScore = calculateScore(currentDealerHand);

    while (dScore < 17) {
      currentDealerHand.push(drawCard());
      dScore = calculateScore(currentDealerHand);
    }

    setDealerHand(currentDealerHand);
    setGameStage('RESOLVED');

    const pScore = calculateScore(playerHand);

    if (dScore > 21) {
      // Dealer busts
      const winAmt = bet * 2;
      setResultMessage('Dealer Busts! You Win!');
      awardWin(winAmt, 2, 'Dealer Bust');
      confetti({ particleCount: 40, spread: 60 });
    } else if (pScore > dScore) {
      const winAmt = bet * 2;
      setResultMessage(`You Win (${pScore} vs ${dScore})!`);
      awardWin(winAmt, 2, 'Player Higher Score');
      confetti({ particleCount: 40, spread: 60 });
    } else if (pScore === dScore) {
      setResultMessage(`Push (${pScore} = ${dScore}) - Stake Returned.`);
      awardWin(bet, 1, 'Blackjack Push');
    } else {
      setResultMessage(`Dealer Wins (${dScore} vs ${pScore}).`);
    }
  };

  const doubleDown = () => {
    if (gameStage !== 'PLAYER_TURN' || playerHand.length !== 2) return;
    const ok = placeBet(bet);
    if (!ok) return;

    // Double stake
    setBet(b => b * 2);
    playCardFlip();
    const nextCard = drawCard();
    const updated = [...playerHand, nextCard];
    setPlayerHand(updated);

    // Auto-stand after 1 card
    setTimeout(() => {
      setDealerHoleCardHidden(false);
      let currentDealer = [...dealerHand];
      let dScore = calculateScore(currentDealer);
      while (dScore < 17) {
        currentDealer.push(drawCard());
        dScore = calculateScore(currentDealer);
      }
      setDealerHand(currentDealer);
      setGameStage('RESOLVED');

      const pScore = calculateScore(updated);
      const totalDoubleBet = bet * 2;

      if (pScore > 21) {
        setResultMessage('Bust on Double Down!');
      } else if (dScore > 21 || pScore > dScore) {
        const winAmt = totalDoubleBet * 2;
        setResultMessage(`Double Down Win (${pScore} vs ${dScore})!`);
        awardWin(winAmt, 2, 'Double Down Win');
        confetti({ particleCount: 60, spread: 70 });
      } else if (pScore === dScore) {
        setResultMessage('Push on Double Down.');
        awardWin(totalDoubleBet, 1, 'Push');
      } else {
        setResultMessage(`Dealer Wins (${dScore} vs ${pScore}).`);
      }
    }, 600);
  };

  const playerScore = calculateScore(playerHand);
  const dealerScore = dealerHoleCardHidden
    ? dealerHand[0]?.value || 0
    : calculateScore(dealerHand);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">Classic VIP Blackjack 21</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              BLACKJACK PAYS 3:2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Dealer stands on soft 17 · Single Deck · Double Down Available</p>
        </div>

        {resultMessage && (
          <div className="text-sm font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            {resultMessage}
          </div>
        )}
      </div>

      {/* Velvet Felt Felt Table Surface */}
      <div className="relative my-4 p-6 sm:p-8 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 rounded-2xl border-2 border-emerald-700/40 shadow-inner flex flex-col justify-between min-h-[300px]">
        {/* Table Felt Arch Watermark */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-2 border-dashed border-emerald-500/20 rounded-[100px] h-32 pointer-events-none flex items-center justify-center">
          <span className="text-emerald-400/20 text-xs font-bold tracking-widest uppercase">
            INSURANCE PAYS 2 TO 1 · DEALER MUST DRAW TO 16 AND STAND ON 17
          </span>
        </div>

        {/* Dealer Zone */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs font-bold text-emerald-300 mb-2">
            DEALER {dealerHand.length > 0 && `(${dealerScore})`}
          </span>
          <div className="flex items-center gap-2">
            {dealerHand.map((card, idx) => {
              if (idx === 1 && dealerHoleCardHidden) {
                return (
                  <div
                    key={idx}
                    className="w-14 h-20 sm:w-16 sm:h-24 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-lg border-2 border-amber-500/40 shadow-md flex items-center justify-center"
                  >
                    <span className="text-lg">♠</span>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`w-14 h-20 sm:w-16 sm:h-24 bg-white rounded-lg border shadow-lg flex flex-col justify-between p-1.5 transition-all animate-in fade-in zoom-in-95 ${
                    card.isRed ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold leading-none">{card.rank}</div>
                  <div className="text-xl text-center">{card.suit}</div>
                  <div className="text-xs font-bold leading-none text-right">{card.rank}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Zone */}
        <div className="relative z-10 flex flex-col items-center mt-6">
          <div className="flex items-center gap-2">
            {playerHand.map((card, idx) => (
              <div
                key={idx}
                className={`w-14 h-20 sm:w-16 sm:h-24 bg-white rounded-lg border shadow-lg flex flex-col justify-between p-1.5 transition-all ${
                  card.isRed ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                <div className="text-xs font-bold leading-none">{card.rank}</div>
                <div className="text-xl text-center">{card.suit}</div>
                <div className="text-xs font-bold leading-none text-right">{card.rank}</div>
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-emerald-300 mt-2">
            PLAYER {playerHand.length > 0 && `(${playerScore})`}
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Bet ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 25].map((amt) => (
              <button
                key={amt}
                onClick={() => setBet(Number(amt.toFixed(2)))}
                disabled={gameStage === 'PLAYER_TURN'}
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

        {/* Hand Actions */}
        <div className="flex items-center gap-2">
          {gameStage === 'PLAYER_TURN' ? (
            <>
              <button
                onClick={hit}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>HIT</span>
              </button>
              <button
                onClick={stand}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>STAND</span>
              </button>
              {playerHand.length === 2 && (
                <button
                  onClick={doubleDown}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>DOUBLE</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={startHand}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg hover:from-emerald-400 hover:to-teal-300 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>DEAL HAND</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
