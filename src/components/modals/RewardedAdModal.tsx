import React, { useState, useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { Play, X, Zap, Gift, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

export const RewardedAdModal: React.FC = () => {
  const { isWatchingAd, completeAdWatch, cancelAdWatch, currency } = useCasino();
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  useEffect(() => {
    if (!isWatchingAd) return;
    setSecondsLeft(15);
    setCanSkip(false);

    const timer = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (s <= 11) {
          setCanSkip(true);
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWatchingAd]);

  if (!isWatchingAd) return null;

  const progressPercent = ((15 - secondsLeft) / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Video Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              REWARDED SPONSOR
            </span>
            <span className="text-xs text-slate-400">Veloce Ad Network · High eCPM Partner</span>
          </div>

          <div className="flex items-center gap-2">
            {secondsLeft > 0 ? (
              <span className="text-xs font-mono-numbers text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                Reward in {secondsLeft}s
              </span>
            ) : (
              <span className="text-xs font-mono-numbers text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                ✓ REWARD READY
              </span>
            )}

            {canSkip && secondsLeft > 0 && (
              <button
                onClick={cancelAdWatch}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
              >
                Skip (No Reward)
              </button>
            )}

            {secondsLeft === 0 && (
              <button
                onClick={completeAdWatch}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-1 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Simulated Video Ad Creative Viewport */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-center min-h-[260px]">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
            <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-display text-white">
            CyberCard Titanium Zero-Fee Web3 Card
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
            Experience instant global liquidity with zero annual fees and up to 5% cash-back on every gaming merchant purchase.
          </p>

          <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
            Tap below when complete to credit bonuses directly to your casino vault.
          </div>
        </div>

        {/* Ad Reward Summary & Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">+15,000 GC · +1.00 SC</span>
              <span className="text-amber-400 text-[11px] font-semibold">Includes 10-Minute 2X Multiplier Boost!</span>
            </div>
          </div>

          <button
            onClick={completeAdWatch}
            disabled={secondsLeft > 0}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md ${
              secondsLeft > 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95 shadow-amber-500/25 animate-pulse'
            }`}
          >
            {secondsLeft > 0 ? `Watching (${secondsLeft}s)` : 'CLAIM REWARD NOW'}
          </button>
        </div>
      </div>
    </div>
  );
};
