import React, { useEffect } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useCasino();

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => {
      dismissToast();
    }, 4000);
    return () => clearTimeout(t);
  }, [toastMessage, dismissToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
      <div className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center justify-between gap-3 ${
        toastMessage.type === 'jackpot'
          ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
          : toastMessage.type === 'success'
          ? 'bg-slate-900 border-emerald-500/50 text-white'
          : 'bg-slate-900 border-slate-700 text-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          {toastMessage.type === 'jackpot' ? (
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
          ) : toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-snug">{toastMessage.text}</span>
        </div>

        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
