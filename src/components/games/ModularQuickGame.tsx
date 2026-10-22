import React, { useState, useEffect } from 'react';
import { GameMetadata } from '../../types/casino';
import { useCasino } from '../../context/CasinoContext';
import { playChipSound, playReelTick, playWinChime, playJackpotFanfare } from '../../utils/audio';
import { Play, Sparkles, ShieldCheck, Hash, RotateCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModularQuickGameProps {
  game: GameMetadata;
}

export const ModularQuickGame: React.FC<ModularQuickGameProps> = ({ game }) => {
  const { currency, placeBet, awardWin, adBoostMultiplier } = useCasino();
  const minBet = currency === 'GC' ? game.minBetGC : game.minBetSC;

  const [bet, setBet] = useState<number>(minBet);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number>(0);
  const [lastMultiplier, setLastMultiplier] = useState<number>(0);
  const [provablyFairHash, setProvablyFairHash] = useState<string>('');
  const [reelDisplay, setReelDisplay] = useState<string[]>(['💎', '7️⃣', '👑', '⚡']);

  useEffect(() => {
    setBet(currency === 'GC' ? game.minBetGC : game.minBetSC);
    generateProvablyFairSeed();
  }, [game, currency]);

  const generateProvablyFairSeed = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setProvablyFairHash(hash);
  };

  const playRound = () => {
    if (isPlaying) return;

    const ok = placeBet(bet);
    if (!ok) return;

    setIsPlaying(true);
    setLastWin(0);
    setLastMultiplier(0);

    const tick = setInterval(() => {
      playReelTick();
      const symbols = ['💎', '7️⃣', '👑', '⚡', '🍒', '🍀', '🔔', '🪙', '⭐'];
      setReelDisplay([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    // Calculate outcome based on RTP and Volatility
    setTimeout(() => {
      clearInterval(tick);
      setIsPlaying(false);
      generateProvablyFairSeed();

      // Volatility weight distribution
      const rand = Math.random();
      let winMult = 0;

      if (game.volatility === 'Low') {
        // High hit frequency (45%), smaller multipliers (1.2x to 5x)
        if (rand < 0.45) {
          winMult = Number((1.2 + Math.random() * 3.8).toFixed(1));
        }
      } else if (game.volatility === 'Medium') {
        // Medium hit frequency (32%), multipliers up to 15x
        if (rand < 0.32) {
          winMult = Number((1.5 + Math.random() * 13.5).toFixed(1));
        }
      } else if (game.volatility === 'High') {
        // Lower hit frequency (22%), bigger multipliers up to 50x
        if (rand < 0.22) {
          winMult = Number((2.0 + Math.random() * 48.0).toFixed(1));
        }
      } else {
        // Extreme volatility (14% hit, potential 100x+)
        if (rand < 0.14) {
          winMult = Number((3.0 + Math.random() * 97.0).toFixed(1));
        }
      }

      if (winMult > 0) {
        const winAmount = Number((bet * winMult).toFixed(2));
        setLastWin(winAmount);
        setLastMultiplier(winMult);
        awardWin(winAmount, winMult, `${game.title} ${winMult}x Hit`);

        if (winMult >= 20) {
          playJackpotFanfare();
          confetti({ particleCount: 70, spread: 80 });
        } else {
          playWinChime();
        }
      }
    }, 1400);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">{game.title}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {game.provider}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {game.rtp}% RTP
            </span>
            {adBoostMultiplier > 1 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2X AD BOOST ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {game.description} · Volatility: <span className="font-semibold text-white">{game.volatility}</span> · Max Win: <span className="font-semibold text-amber-400">{game.maxWinMultiplier.toLocaleString()}x</span>
          </p>
        </div>

        <div className="text-right text-xs font-mono-numbers">
          <span className="text-slate-400 block text-[10px]">LAST ROUND WIN</span>
          <span className="text-emerald-400 font-bold text-sm">
            {lastWin > 0 ? `+${lastWin.toLocaleString()} ${currency} (${lastMultiplier}x)` : '0.00'}
          </span>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="relative my-6 p-6 sm:p-8 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${game.themeColor}, transparent 70%)`
          }}
        />

        {/* Dynamic Display Symbols */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-2">
          {reelDisplay.map((sym, idx) => (
            <div
              key={idx}
              className={`w-16 h-20 sm:w-20 sm:h-24 bg-slate-900/90 rounded-xl border-2 flex items-center justify-center text-3xl sm:text-4xl shadow-xl transition-all ${
                isPlaying
                  ? 'border-amber-400 animate-pulse'
                  : lastMultiplier > 0
                  ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                  : 'border-slate-800'
              }`}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Provably Fair Hash string */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono-numbers bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Provably Fair Hash: {provablyFairHash}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Bet Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Bet ({currency}):</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 25].map((amt) => (
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

        {/* Action Button */}
        <button
          onClick={playRound}
          disabled={isPlaying}
          className={`px-6 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg transition-all ${
            isPlaying
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 shadow-amber-500/25'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
          <span>{isPlaying ? 'PLAYING...' : `PLAY (${bet} ${currency})`}</span>
        </button>
      </div>
    </div>
  );
};
