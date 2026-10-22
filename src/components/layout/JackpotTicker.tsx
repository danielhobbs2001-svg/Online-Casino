import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { Trophy, Sparkles, Flame, Zap } from 'lucide-react';

export const JackpotTicker: React.FC = () => {
  const { jackpots, currency } = useCasino();

  const pools = [
    { name: 'GRAND', val: jackpots.grand, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: CrownIcon },
    { name: 'MAJOR', val: jackpots.major, color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10', icon: Flame },
    { name: 'MINOR', val: jackpots.minor, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10', icon: Sparkles },
    { name: 'MINI', val: jackpots.mini, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', icon: Zap }
  ];

  return (
    <div className="w-full my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {pools.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className={`p-3 rounded-xl border ${p.border} ${p.bg} backdrop-blur-sm relative overflow-hidden transition-all hover:scale-[1.02] shadow-lg`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {p.name} JACKPOT
                </span>
                <Icon className={`w-3.5 h-3.5 ${p.color}`} />
              </div>
              <div className={`text-base sm:text-lg font-black font-mono-numbers tracking-tight ${p.color}`}>
                ${p.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                Progressive Community Pool
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
      <path d="M5 21h14"/>
    </svg>
  );
}
