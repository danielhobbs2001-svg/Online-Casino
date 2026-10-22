import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { X, Trophy, Sparkles, CheckCircle2, Gift } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const { activeModal, closeModal, achievements, claimAchievementReward, currency } = useCasino();

  if (activeModal !== 'achievements') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold font-display text-white">Casino Achievements</h2>
              <p className="text-xs text-slate-400">Unlock trophies to claim instant Gold and Sweeps Coin drops</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                ach.completed
                  ? 'bg-slate-950/40 border-slate-800 opacity-80'
                  : 'bg-slate-950 border-amber-500/30 ring-1 ring-amber-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  ach.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono-numbers">
                    <span className="text-amber-400 font-semibold">+{ach.rewardGC.toLocaleString()} GC</span>
                    <span className="text-emerald-400 font-semibold">+{ach.rewardSC.toFixed(2)} SC</span>
                  </div>
                </div>
              </div>

              <div>
                {ach.completed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CLAIMED</span>
                  </span>
                ) : (
                  <button
                    onClick={() => claimAchievementReward(ach.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-bold hover:from-amber-400 active:scale-95 shadow-md shadow-amber-500/20"
                  >
                    CLAIM BONUS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
