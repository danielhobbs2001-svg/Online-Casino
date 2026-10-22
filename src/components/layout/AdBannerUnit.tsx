import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { Tv, Zap, Gift, Play } from 'lucide-react';

export const AdBannerUnit: React.FC = () => {
  const { watchRewardedAd, adBoostSecondsRemaining, adBoostMultiplier } = useCasino();

  const isBoostActive = adBoostSecondsRemaining > 0;
  const minutes = Math.floor(adBoostSecondsRemaining / 60);
  const seconds = adBoostSecondsRemaining % 60;

  return (
    <div className="w-full my-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
          <Tv className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              REWARDED AD MONETIZATION UNIT
            </span>
            {isBoostActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-numbers animate-pulse">
                2X BOOST: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Watch a 15-second sponsor video to claim <strong className="text-amber-400">+15,000 GC</strong>, <strong className="text-emerald-400">+1.00 SC</strong> &amp; <strong className="text-rose-400">10-Minute 2X Multiplier Boost</strong>!
          </p>
        </div>
      </div>

      <button
        onClick={() => watchRewardedAd()}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold font-display text-xs tracking-wide shrink-0 hover:from-rose-400 hover:to-amber-400 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shadow-rose-500/20"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>WATCH 15S VIDEO CLIP</span>
      </button>
    </div>
  );
};
