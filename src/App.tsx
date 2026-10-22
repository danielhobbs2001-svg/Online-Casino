import React, { useState, useMemo } from 'react';
import { CasinoProvider, useCasino } from './context/CasinoContext';
import { Header } from './components/layout/Header';
import { JackpotTicker } from './components/layout/JackpotTicker';
import { AdBannerUnit } from './components/layout/AdBannerUnit';
import { GameDialog } from './components/layout/GameDialog';
import { Toast } from './components/layout/Toast';
import { RewardedAdModal } from './components/modals/RewardedAdModal';
import { CoinStoreModal } from './components/modals/CoinStoreModal';
import { VipRewardsModal } from './components/modals/VipRewardsModal';
import { ComplianceModal } from './components/modals/ComplianceModal';
import { TechnicalBlueprintModal } from './components/modals/TechnicalBlueprintModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { GAMES_CATALOG } from './data/gamesCatalog';
import { GameCategory, Volatility, GameMetadata } from './types/casino';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Trophy,
  Play,
  FileCode2,
  ShieldCheck,
  Gift,
  Tv,
  Calendar,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

function CasinoApp() {
  const {
    currency,
    openGame,
    openModal,
    watchRewardedAd,
    streakDay,
    canClaimStreak,
    claimDailyStreak,
    adBoostSecondsRemaining,
    vip
  } = useCasino();

  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVolatility, setSelectedVolatility] = useState<string>('all');

  // Filtered games
  const filteredGames = useMemo(() => {
    return GAMES_CATALOG.filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVolatility =
        selectedVolatility === 'all' || game.volatility.toLowerCase() === selectedVolatility.toLowerCase();
      return matchesCategory && matchesSearch && matchesVolatility;
    });
  }, [selectedCategory, searchQuery, selectedVolatility]);

  // Featured games
  const featuredGames = useMemo(() => {
    return GAMES_CATALOG.filter(g => g.featured);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header onNavClick={scrollToSection} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          {/* Background Image Scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/casino_hero_lux_banner_1792663539111.jpg"
              alt="Luxury Casino Gaming Floor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                AURA SOCIAL GAMING ECOSYSTEM
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-medium">52+ Games Online</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white text-balance leading-tight">
              High-Velocity Social Casino with Instant Sweeps &amp; Rewarded Ads
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Play premier slots, real-time crash curves, and live card tables. Earn Gold Coins, unlock complimentary Sweeps Cash, and watch rewarded clips for 2x win boosts.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openGame(GAMES_CATALOG[0])}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold font-display text-sm tracking-wide flex items-center gap-2 shadow-lg hover:from-amber-400 hover:to-yellow-300 active:scale-95 transition-all shadow-amber-500/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY NEON 777 SLOTS</span>
              </button>

              <button
                onClick={claimDailyStreak}
                className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  canClaimStreak
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900 active:scale-95'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{canClaimStreak ? `Claim Day ${streakDay} Streak Bonus` : 'Day Streak Claimed'}</span>
              </button>

              <button
                onClick={() => openModal('blueprint')}
                className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-2"
              >
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                <span>View Architecture Blueprint</span>
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Mystery Progressive Jackpots */}
        <section id="jackpots">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                Dynamic Community Progressive Jackpots
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono-numbers">Seed: 0.5% Rake</span>
          </div>
          <JackpotTicker />
        </section>

        {/* Rewarded Ad Placement Banner */}
        <section>
          <AdBannerUnit />
        </section>

        {/* Featured Premier Games Spotlight */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-display text-white tracking-wide">Premier Headliners</h2>
              <p className="text-xs text-slate-400">High-roller mechanics, near-miss anticipation, and physics simulation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGames.slice(0, 4).map((game) => (
              <div
                key={game.id}
                onClick={() => openGame(game)}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Play Floating Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <span className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Provider Pill */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 border border-slate-800 font-mono-numbers">
                    {game.provider}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Unboxed Metadata with · separator */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-numbers mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-bold">{game.rtp}% RTP</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{game.volatility} Vol</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-amber-400">{game.maxWinMultiplier.toLocaleString()}x Max</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 50+ Games Catalog Framework & Filter Bar */}
        <section id="lobby" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold font-display text-white tracking-wide">
                50+ Game Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Browse our complete collection across 5 categories with modular HTML5 game engines
              </p>
            </div>

            {/* Search input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search games or providers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'All Games (52)' },
                { id: 'slots', label: 'Slots (18)' },
                { id: 'table', label: 'Table Games (10)' },
                { id: 'crash', label: 'Crash & Arcades (8)' },
                { id: 'instant', label: 'Instant Wins (8)' },
                { id: 'live', label: 'Live & Virtual (8)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as GameCategory)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Volatility Filter */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Volatility:</span>
              <select
                value={selectedVolatility}
                onChange={e => setSelectedVolatility(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Volatilities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => openGame(game)}
                className="group bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
              >
                {/* Visual Header */}
                <div
                  className="aspect-4/3 w-full relative flex items-center justify-center p-3 text-center overflow-hidden"
                  style={{
                    backgroundColor: '#0f172a',
                    backgroundImage: `radial-gradient(circle at center, ${game.themeColor}33, transparent 75%)`
                  }}
                >
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-2xl mb-1 select-none">
                        {game.category === 'slots' ? '🎰' : game.category === 'crash' ? '🚀' : game.category === 'table' ? '♠️' : '💎'}
                      </span>
                      <span className="text-[11px] font-bold text-white leading-tight font-display line-clamp-2">
                        {game.title}
                      </span>
                    </div>
                  )}

                  {/* Play hover scrim */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-2.5 bg-slate-900/60">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate group-hover:text-amber-400">
                      {game.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono-numbers">
                    <span className="text-emerald-400 font-semibold">{game.rtp}%</span>
                    <span>{game.volatility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Blueprint & Architecture Showcase Strip */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <FileCode2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">
                Technical Blueprint &amp; System Architecture Documentation
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore the full production specification covering Dual-Token Virtual Economics (GC/SC), Rewarded Video Ad Waterfall Mediation, 50+ Game Modular HTML5 Engine, Near-Miss Sensory Feedback loops, and US Sweepstakes Legal Compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openModal('blueprint')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <span>OPEN FULL BLUEPRINT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="font-bold text-white font-display text-sm">VELOCE ROYALE SOCIAL CASINO</span>
            <div className="flex items-center gap-2 text-slate-500">
              <span>18+ / 21+ Only</span>
              <span aria-hidden="true">·</span>
              <span>GLI-19 Certified RNG</span>
              <span aria-hidden="true">·</span>
              <span>US Sweepstakes Compliant</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openModal('compliance')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Responsible Gaming &amp; Limits
            </button>
            <button
              onClick={() => openModal('blueprint')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              System Blueprint
            </button>
            <button
              onClick={() => openModal('vip')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              VIP Lounge
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500">
          NO PURCHASE NECESSARY to enter or win. Void where prohibited by law. Gold Coins are for social play only. Sweeps Coins are complimentary promotional entries redeemable for cash prizes subject to identity verification.
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <GameDialog />
      <RewardedAdModal />
      <CoinStoreModal />
      <VipRewardsModal />
      <ComplianceModal />
      <TechnicalBlueprintModal />
      <AchievementsModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CasinoProvider>
      <CasinoApp />
    </CasinoProvider>
  );
}
