import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { VIP_TIER_CONFIG, DAILY_STREAK_LADDER } from '../../data/casinoConfig';
import { X, Crown, Calendar, Sparkles, Shield, Gift, Check, ArrowRight } from 'lucide-react';

export const VipRewardsModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    vip,
    streakDay,
    canClaimStreak,
    claimDailyStreak,
    claimLossback,
    claimableLossbackGC,
    claimableLossbackSC,
    currency
  } = useCasino();

  if (activeModal !== 'vip') return null;

  const currentTierInfo = VIP_TIER_CONFIG[vip.tier];
  const xpPercent = Math.min(100, (vip.xp / vip.nextTierXp) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">VIP Lounge &amp; Retention Hub</h2>
              <p className="text-xs text-slate-400">
                Tier progression, daily streak rewards, and automated weekly lossback
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* VIP Tier Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">CURRENT VIP STATUS</span>
                <span className="text-2xl font-black font-display text-amber-400 tracking-wide">
                  {vip.tier} Tier Club
                </span>
              </div>
              <div className="text-right text-xs font-mono-numbers">
                <span className="text-slate-400 block text-[10px]">TOTAL CASINO XP</span>
                <span className="text-white font-bold text-base">
                  {vip.xp.toLocaleString()} / {vip.nextTierXp.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* XP Progress bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            {/* Perks list */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {currentTierInfo.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Progressive Streak Calendar */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-display">7-Day Daily Streak Calendar</h3>
              </div>
              <button
                onClick={claimDailyStreak}
                disabled={!canClaimStreak}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  canClaimStreak
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 active:scale-95 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canClaimStreak ? `CLAIM DAY ${streakDay} REWARD` : 'CLAIMED FOR TODAY'}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAILY_STREAK_LADDER.map((item) => {
                const isCurrent = item.day === streakDay;
                const isPast = item.day < streakDay;
                return (
                  <div
                    key={item.day}
                    className={`p-2 rounded-lg border text-center flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50 scale-105'
                        : isPast
                        ? 'bg-emerald-950/40 border-emerald-500/40 opacity-70'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-slate-400">Day {item.day}</span>
                    <div className="my-1">
                      <span className="text-[10px] font-mono-numbers font-bold text-white block">
                        +{item.gc >= 1000 ? `${item.gc / 1000}k` : item.gc} GC
                      </span>
                      <span className="text-[9px] font-mono-numbers text-emerald-400 font-semibold block">
                        +{item.sc} SC
                      </span>
                    </div>
                    {isPast && (
                      <span className="text-[9px] text-emerald-400 font-bold">✓ CLAIMED</span>
                    )}
                    {isCurrent && (
                      <span className="text-[9px] text-amber-400 font-bold animate-pulse">TODAY</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lossback Bonus Pool */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-display">Weekly Loss-Back Cashback Pool</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-numbers">
                    {(vip.lossbackRate * 100).toFixed(0)}% RATE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated cashback calculated on net casino session results. Zero rollover requirement.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono-numbers">
                  <span className="text-emerald-400 font-bold">
                    Claimable: {claimableLossbackGC.toLocaleString()} GC · {claimableLossbackSC.toFixed(2)} SC
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={claimLossback}
              disabled={claimableLossbackGC <= 0 && claimableLossbackSC <= 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all shadow-md ${
                claimableLossbackGC > 0 || claimableLossbackSC > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 active:scale-95 shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              CLAIM CASHBACK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
