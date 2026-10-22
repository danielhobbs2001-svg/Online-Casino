import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Lock, Clock, UserCheck } from 'lucide-react';

export const ComplianceModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    responsibleGaming,
    updateResponsibleGaming,
    kyc,
    submitKYCTier
  } = useCasino();

  const [activeTab, setActiveTab] = useState<'limits' | 'kyc' | 'exclusion'>('limits');
  const [dailyLimitInput, setDailyLimitInput] = useState<string>(responsibleGaming.dailyWagerLimit.toString());
  const [realityInterval, setRealityInterval] = useState<number>(responsibleGaming.realityCheckInterval);

  if (activeModal !== 'compliance') return null;

  const handleSaveLimits = () => {
    updateResponsibleGaming({
      dailyWagerLimit: Number(dailyLimitInput) || 500000,
      realityCheckInterval: realityInterval
    });
  };

  const handleSelfExclude = (hours: number) => {
    const until = Date.now() + hours * 60 * 60 * 1000;
    updateResponsibleGaming({ selfExcludedUntil: until });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold font-display text-white">Responsible Gaming &amp; KYC Suite</h2>
              <p className="text-xs text-slate-400">
                Player safety controls, wager limits, and 3-tier regulatory verification
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

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActiveTab('limits')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'limits'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Wager Limits &amp; Reality Checks
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'kyc'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            KYC Verification Tiers
          </button>
          <button
            onClick={() => setActiveTab('exclusion')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'exclusion'
                ? 'border-rose-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Self-Exclusion &amp; Cool-Off
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'limits' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">
                  Daily Wager Limit (GC)
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Once reached in a 24-hour period, additional bets will be automatically locked until the reset window.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dailyLimitInput}
                    onChange={e => setDailyLimitInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm text-white font-mono-numbers focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveLimits}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shrink-0"
                  >
                    Save Limit
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">
                  Reality Check Notification Interval
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Receive an unobtrusive in-game popup displaying time elapsed and net win/loss statistics.
                </p>
                <div className="flex items-center gap-2">
                  {[15, 30, 60, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setRealityInterval(mins)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        realityInterval === mins
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      Every {mins} Mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-3">
              {/* Tier 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Tier 1: Basic Identity &amp; Age Gate (18+/21+)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {kyc.tier1Basic.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Legal full name, date of birth, US/CAN state verification, AML blacklist check.
                    </span>
                  </div>
                </div>
                {kyc.tier1Basic !== 'verified' && (
                  <button
                    onClick={() => submitKYCTier(1)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shrink-0"
                  >
                    Verify
                  </button>
                )}
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Tier 2: Government ID &amp; Biometric Liveness</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        kyc.tier2IDDocument === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {kyc.tier2IDDocument.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Passport or Driver&apos;s License with 3D facial selfie match for Sweeps Coin redemptions &gt; $100.
                    </span>
                  </div>
                </div>
                {kyc.tier2IDDocument !== 'verified' && (
                  <button
                    onClick={() => submitKYCTier(2)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shrink-0"
                  >
                    Submit ID
                  </button>
                )}
              </div>

              {/* Tier 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Tier 3: Proof of Residential Address</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        kyc.tier3ProofOfAddress === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {kyc.tier3ProofOfAddress.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Utility bill or bank statement within 90 days for high-roller withdrawals &gt; $5,000.
                    </span>
                  </div>
                </div>
                {kyc.tier3ProofOfAddress !== 'verified' && (
                  <button
                    onClick={() => submitKYCTier(3)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shrink-0"
                  >
                    Submit Address
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'exclusion' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-300 mb-1">Voluntary Self-Exclusion &amp; Cool-Off Policy</strong>
                  When initiated, all gameplay and purchases are immediately disabled for the chosen duration. This action cannot be revoked until the expiration period lapses.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSelfExclude(24)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-center transition-all"
                >
                  <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">24-Hour Cool Off</span>
                  <span className="text-[10px] text-slate-400">Temporary break</span>
                </button>

                <button
                  onClick={() => handleSelfExclude(168)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-center transition-all"
                >
                  <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">7-Day Suspension</span>
                  <span className="text-[10px] text-slate-400">One week cooldown</span>
                </button>

                <button
                  onClick={() => handleSelfExclude(8760)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-center transition-all"
                >
                  <Lock className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-rose-300 block">Permanent Exclusion</span>
                  <span className="text-[10px] text-slate-400">Full self-lock</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
