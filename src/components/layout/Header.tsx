import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Coins,
  Crown,
  Tv,
  FileCode2,
  ShieldCheck,
  Trophy,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';
import { isAudioMuted, setAudioMuted } from '../../utils/audio';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const {
    currency,
    setCurrency,
    goldCoins,
    sweepsCoins,
    vip,
    openModal,
    adBoostSecondsRemaining,
    watchRewardedAd
  } = useCasino();

  const [muted, setMutedState] = React.useState<boolean>(isAudioMuted());

  const toggleSound = () => {
    const next = !muted;
    setAudioMuted(next);
    setMutedState(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('lobby');
          }}
          className="text-lg sm:text-xl font-black font-display tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            VR
          </span>
          <span className="bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
            VELOCE ROYALE
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => onNavClick('lobby')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            All Games
          </button>
          <button
            onClick={() => onNavClick('jackpots')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Jackpots
          </button>
          <button
            onClick={() => openModal('vip')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Lounge</span>
          </button>
          <button
            onClick={() => watchRewardedAd()}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5 text-rose-400" />
            <span>Ad Rewards {adBoostSecondsRemaining > 0 ? '(2X Active)' : ''}</span>
          </button>
          <button
            onClick={() => openModal('blueprint')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-emerald-400/90"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Technical Blueprint</span>
          </button>
          <button
            onClick={() => openModal('compliance')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Compliance &amp; KYC
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Currency Switcher (GC / SC) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrency('GC')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                currency === 'GC'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>GC</span>
              <span className="font-mono-numbers text-[11px]">
                {goldCoins >= 1000000 ? `${(goldCoins / 1000000).toFixed(1)}M` : goldCoins.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setCurrency('SC')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                currency === 'SC'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>SC</span>
              <span className="font-mono-numbers text-[11px]">{sweepsCoins.toFixed(2)}</span>
            </button>
          </div>

          {/* Get Coins / Store CTA */}
          <button
            onClick={() => openModal('store')}
            className="px-3.5 py-1.5 text-xs font-bold font-display text-slate-950 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>GET COINS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
