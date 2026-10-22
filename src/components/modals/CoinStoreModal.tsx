import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { STORE_PACKAGES } from '../../data/casinoConfig';
import { StorePackage } from '../../types/casino';
import { X, ShieldCheck, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export const CoinStoreModal: React.FC = () => {
  const { activeModal, closeModal, purchasePackage, currency } = useCasino();

  if (activeModal !== 'store') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Coin Store &amp; Sweeps Packages</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant Gold Coin top-ups with complimentary bonus Sweeps Coins
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Sweeps Notice */}
        <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-900/30 flex items-center gap-2 text-[11px] text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>NO PURCHASE NECESSARY.</strong> Gold Coins are for social entertainment only. Sweeps Coins are complimentary bonuses and redeemable for cash prizes under US Sweepstakes Law.
          </span>
        </div>

        {/* Packages List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {STORE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                pkg.popular
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Tag Badge */}
              {pkg.tag && (
                <span className="absolute -top-2.5 left-4 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono-numbers">
                  {pkg.tag}
                </span>
              )}

              {/* Package Details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono-numbers">
                      {pkg.goldCoins.toLocaleString()} GC
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-numbers border border-emerald-500/30">
                      + FREE {pkg.freeSweepsCoins.toFixed(2)} SC
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Includes +{pkg.bonusPercentage}% Extra Gold Coins &amp; VIP Tier XP
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => purchasePackage(pkg)}
                className={`px-5 py-2.5 rounded-xl font-bold font-display text-sm tracking-wide shrink-0 transition-all shadow-md active:scale-95 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                ${pkg.priceUSD.toFixed(2)} USD
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Sandbox Checkout</span>
          </div>
          <span>Instant Crediting</span>
        </div>
      </div>
    </div>
  );
};
