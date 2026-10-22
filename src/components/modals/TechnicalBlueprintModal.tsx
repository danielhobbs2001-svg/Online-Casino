import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  X,
  FileCode2,
  Coins,
  Tv,
  Gamepad2,
  Trophy,
  Server,
  ShieldCheck,
  Copy,
  Check,
  Download
} from 'lucide-react';

export const TechnicalBlueprintModal: React.FC = () => {
  const { activeModal, closeModal } = useCasino();
  const [activeTab, setActiveTab] = useState<'economy' | 'ads' | 'games' | 'retention' | 'architecture' | 'compliance'>('economy');
  const [copied, setCopied] = useState<boolean>(false);

  if (activeModal !== 'blueprint') return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(FULL_BLUEPRINT_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <FileCode2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Technical Blueprint &amp; Product Architecture Plan</h2>
              <p className="text-xs text-slate-400">
                End-to-end specifications for Dual-Token Social Casino, 50+ Game Aggregation, Ad Mediation, and Sweepstakes Compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Blueprint' : 'Copy Plan Markdown'}</span>
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'economy', label: '1. In-Game Economy', icon: Coins },
            { id: 'ads', label: '2. Ad Monetization', icon: Tv },
            { id: 'games', label: '3. 50+ Game Catalog', icon: Gamepad2 },
            { id: 'retention', label: '4. Retention & Triggers', icon: Trophy },
            { id: 'architecture', label: '5. System Architecture', icon: Server },
            { id: 'compliance', label: '6. Compliance & Safety', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'economy' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">1. In-Game Economy &amp; Virtual Currency Architecture</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 mb-1">Dual-Token Currency Model (GC &amp; SC)</h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Operating legally under US and international social sweepstakes frameworks mandates a dual-currency system separating entertainment play from prize redemption.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong className="text-white">Gold Coins (GC):</strong> Pure social play tokens. Unlimited velocity. Purchased in bundles, earned through daily faucets, quest streaks, and level progression. Cannot be cashed out.</li>
                    <li><strong className="text-white">Sweeps Coins (SC):</strong> Promotional sweepstakes entries. Never sold directly. Awarded free with GC bundles, daily claims, mail-in requests (AMOE), and rewarded ad views. 1 SC = $1.00 USD redemption equivalent once played through 1x.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-emerald-400 mb-1">Currency Flow Dynamics</h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Equilibrium between sinks and faucets preserves engagement without hyper-inflating social leaderboards:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong className="text-white">Faucets (Inflow):</strong> 7-Day progressive streak calendar, 4-hour micro-refill faucet, level-up celebration drops, rewarded ad video grants (+15k GC / +1 SC).</li>
                    <li><strong className="text-white">Sinks (Outflow):</strong> High-multiplier slot wagers, crash game entries, tournament entry tickets, progressive mystery jackpot tax (0.5% of every bet routed to Grand/Major pools).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">In-Game Store Monetization Packages</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-numbers">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Price (USD)</th>
                        <th>Gold Coins</th>
                        <th>Free Bonus SC</th>
                        <th>Extra GC %</th>
                        <th>VIP XP Grant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr><td className="py-2 font-bold text-white">$4.99</td><td>50,000 GC</td><td className="text-emerald-400 font-bold">5.00 SC</td><td>+10%</td><td>5,000 XP</td></tr>
                      <tr><td className="py-2 font-bold text-white">$19.99</td><td>250,000 GC</td><td className="text-emerald-400 font-bold">21.00 SC</td><td>+25%</td><td>20,000 XP</td></tr>
                      <tr><td className="py-2 font-bold text-white">$49.99</td><td>750,000 GC</td><td className="text-emerald-400 font-bold">53.00 SC</td><td>+40%</td><td>50,000 XP</td></tr>
                      <tr><td className="py-2 font-bold text-white">$99.99</td><td>1,800,000 GC</td><td className="text-emerald-400 font-bold">108.00 SC</td><td>+60%</td><td>100,000 XP</td></tr>
                      <tr><td className="py-2 font-bold text-white">$299.99</td><td>6,000,000 GC</td><td className="text-emerald-400 font-bold">335.00 SC</td><td>+80%</td><td>300,000 XP</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">2. Ad Monetization Integration &amp; Mediation Waterfall</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 mb-1">Rewarded Videos (Core Engine)</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Highest eCPM format ($25 - $45 in Tier 1 US/UK gaming). 100% opt-in model.
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    <li><strong>2X Win Multiplier Boost:</strong> Player watches a 15-30s ad to double all slot/crash winnings for 10 minutes.</li>
                    <li><strong>Crash Game Revive:</strong> 1 free insurance revive on 1.00x - 1.20x sudden crash busts.</li>
                    <li><strong>Bankroll Faucet Refill:</strong> Instant +15,000 GC + 1.00 SC when user balance dips below min bet.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">Interstitials (Paced Transitions)</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Full-screen static or video ad triggered strictly during natural pause points ($8 - $16 eCPM).
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    <li>Triggered on exiting a game session back to the lobby (throttled to max 1 every 8 minutes).</li>
                    <li>Never interrupts active spins, flight in crash games, or dealt card hands.</li>
                    <li>Suppressed automatically for any player who made a Store purchase in last 14 days (VIP benefit).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-emerald-400 mb-1">Sticky Native Banners</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Adaptive 320x50 and 728x90 non-intrusive bottom units ($1.50 - $3.50 eCPM).
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    <li>Positioned below game canvas or in lobby footer, never overlapping interactive bet buttons.</li>
                    <li>Refreshed every 45-60 seconds on viewport visibility.</li>
                    <li>Mediation fallback to in-house promotional packages and VIP streak reminders.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Mediation Waterfall &amp; Header Bidding Architecture</h4>
                <p className="text-xs text-slate-400 mb-2">
                  Unified bidding across AppLovin MAX, Google AdMob, ironSource, and Unity Ads. Real-time client-side SDK integration ensures zero latency impact on game canvas frame rates (main thread isolation via Web Workers).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">3. 50+ Game Catalog Framework &amp; Modular Game Engines</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2">Catalog Category Breakdown (52 Games Total)</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li><strong className="text-amber-400">18 Slots:</strong> Vegas Neon 777, Gates of Valhalla, Sweet Sugar Bonanza, Buffalo Fury Megaways, Book of Anubis, Cyber Heist 2099, Dragon Dynasty 88, Fruit Deluxe 243, Gold Rush Mine, etc.</li>
                    <li><strong className="text-emerald-400">10 Table Games:</strong> VIP Blackjack 21, European Roulette Royal, Baccarat Punto Banco, Vegas Craps Pro, Texas Hold&apos;em Bonus, Jacks or Better Video Poker, Caribbean Stud, Sic Bo.</li>
                    <li><strong className="text-rose-400">8 Crash &amp; Arcades:</strong> Turbo Rocket Crash, Plinko Galaxy Drop, Minesweeper Diamond Hunt, Aviator Supersonic, Crypto Moon Runner, Hi-Lo Skyscraper, Space Dice.</li>
                    <li><strong className="text-purple-400">8 Instant Wins &amp; Scratch:</strong> Mega Fortune Wheel, Golden Clover Scratch, Diamond 100x Scratch, Mega Keno 80, Magic Vault Chest, Penalty Shootout Cup, Tower Climb.</li>
                    <li><strong className="text-cyan-400">8 Live &amp; Virtual Dealers:</strong> Speed Baccarat VIP Stream, Lightning Roulette, Infinite Blackjack, Crazy Wheel Show, Dragon Tiger, Football Studio, Mega Ball 100x.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2">Technical Implementation: Build vs. Aggregate</h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Hybrid strategy combining proprietary fast-loading modular game engines with standard iGaming aggregation protocols:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li><strong className="text-white">Proprietary Core (HTML5/Canvas + React):</strong> Lightweight (&lt;200KB bundle), zero loading time, instant native responsiveness on iOS/Android WebViews.</li>
                    <li><strong className="text-white">Seamless Aggregator API Integration:</strong> Standardized RGS (Remote Gaming Server) iFrame wrapper with bidirectional <code>postMessage</code> event bus handling wallet transactions (<code>BET</code>, <code>WIN</code>, <code>ROLLBACK</code>) to support Pragmatic, Hacksaw, and NetEnt catalogue feeds.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'retention' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">4. Player Engagement, Retention Loops &amp; Sensory Triggers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 mb-1">Near-Miss Sensory Triggers</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When 2 Scatter symbols land on Reels 1 and 3, Reel 5 slows down automatically with a rising frequency tension tone (synthesized via browser Web Audio API oscillator at 880Hz to 1320Hz). Studies verify this releases dopamine parity with actual wins, dramatically extending session dwell time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-emerald-400 mb-1">Weekly Loss-Back Cashback</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated 5% to 25% cashback calculated directly on net session losses based on VIP status. Softens negative variance streaks and eliminates player churn after cold runs. Zero wagering requirement on lossback claims.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-purple-400 mb-1">Dynamic Mystery Jackpots</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    4-tiered progressive pool (Mini, Minor, Major, Grand) funded by a micro 0.5% rake of every spin across the community. Can trigger unpredictably on any wager size, reinforcing the constant anticipation of life-changing payouts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">5. Tech Stack, Data Architecture &amp; Security Considerations</h3>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">Full-Stack Production Blueprint</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-400 block mb-1">Frontend Tier:</span>
                    <ul className="space-y-1 text-slate-400">
                      <li>• React 19 + TypeScript (strict mode)</li>
                      <li>• Tailwind CSS for zero runtime styling overhead</li>
                      <li>• Web Audio API for synthetic zero-latency audio engine</li>
                      <li>• HTML5 Canvas 2D + WebGL for 60fps game physics</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-cyan-400 block mb-1">Backend &amp; Ledger:</span>
                    <ul className="space-y-1 text-slate-400">
                      <li>• Node.js / Go microservices with WebSocket cluster</li>
                      <li>• Redis Cluster for in-memory wallet locks and live crash ticker</li>
                      <li>• PostgreSQL ACID database for immutable transactional ledgers</li>
                      <li>• Provably Fair HMAC-SHA256 outcome verification engine</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-numbers text-xs">
                <span className="text-emerald-400 font-bold block mb-1">Provably Fair Algorithm Verification Formula:</span>
                <pre className="text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 overflow-x-auto">
{`const hmac = crypto.createHmac('sha256', serverSeed);
hmac.update(\`\${clientSeed}:\${nonce}\`);
const hex = hmac.digest('hex');
const outcome = parseInt(hex.substring(0, 8), 16) / 0xffffffff;`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">6. Legal Compliance, Sweepstakes Model &amp; Responsible Gaming</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 mb-1">US Sweepstakes Regulatory Alignment</h4>
                  <p className="text-xs text-slate-300 mb-2">
                    To operate legally across 46+ US states without gambling licensing, the platform strictly adheres to promotional sweepstakes statutes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong className="text-white">No Purchase Necessary:</strong> Free Sweeps Coins are unconditionally provided via Alternate Method of Entry (handwritten postal envelope requests) and daily logins.</li>
                    <li><strong className="text-white">Segregated Balances:</strong> Gold Coins cannot be exchanged for cash or SC under any circumstances.</li>
                    <li><strong className="text-white">Excluded Jurisdictions:</strong> Automated geolocation blocking for restricted states (Washington, Idaho, Michigan, Nevada).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-emerald-400 mb-1">KYC &amp; Responsible Gaming Controls</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong className="text-white">3-Tier Verification:</strong> Mandatory age verification (18+/21+) + Biometric ID scan before any SC prize redemption is permitted.</li>
                    <li><strong className="text-white">Player Limits:</strong> Custom daily wager and deposit caps with mandatory 24h delay on limit increase requests.</li>
                    <li><strong className="text-white">Reality Check Prompts:</strong> Time-stamped alerts informing players of dwell time and net outcome metrics.</li>
                    <li><strong className="text-white">Self-Exclusion:</strong> Instant cool-off locks (24h, 7d, or permanent self-ban).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FULL_BLUEPRINT_MARKDOWN = `# Veloce Royale Social Casino: Technical Blueprint & Product Architecture Plan

## 1. In-Game Economy & Virtual Currency
- **Dual-Token Model:** Gold Coins (GC) for entertainment; Sweeps Coins (SC) for promotional prizes.
- **Earning Loops:** Daily 7-day streak calendar, 4-hour faucets, level-up milestones, rewarded video ads (+15,000 GC, +1.00 SC), and postal mail-in AMOE.
- **Spending & Sinks:** 50+ casino games, dynamic mystery jackpots (0.5% rake), tournament buy-ins, and VIP badge leveling.
- **Store Pricing:** $4.99 (50k GC + 5 SC), $19.99 (250k GC + 21 SC), $49.99 (750k GC + 53 SC), $99.99 (1.8M GC + 108 SC), $299.99 (6M GC + 335 SC).

## 2. Ad Monetization Integration
- **Rewarded Video Ads:** Core engine driving $25-$45 eCPM in US gaming. Rewards include 10-minute 2x win boosts, crash revival insurance, and faucet refills.
- **Interstitials:** Paced transitions between game sessions (capped at max 1 per 8 minutes, suppressed for paying VIPs).
- **Banner Placement:** Responsive non-intrusive 320x50 and 728x90 sticky footer units.
- **Mediation Waterfall:** Unified bidding via AppLovin MAX, Google AdMob, ironSource, and Unity Ads.

## 3. 50+ Game Catalog Framework
- **Category Taxonomy:** 18 Slots, 10 Table Games, 8 Crash & Arcades, 8 Instant Wins, 8 Live/Virtual Dealer streams (52 total games).
- **Engine Strategy:** Proprietary HTML5 Canvas 2D / Web Audio core for zero bundle bloat and instant load times, combined with standardized RGS iFrame connectors for third-party studio feeds.

## 4. Player Engagement & Retention System
- **Sensory Triggers:** Near-miss reel anticipation slows down on 2 scatters with rising heartbeat Web Audio tone.
- **Retention Loops:** 7-day progressive streak ladder, VIP tier progression (Bronze to Obsidian), and automated 5%-25% weekly loss-back cashback.
- **Mystery Jackpots:** 4 community pooled progressive jackpots (Mini, Minor, Major, Grand) ticking live.

## 5. Tech Stack & System Architecture
- **Frontend:** React 19, TypeScript, Tailwind CSS, Web Audio API, Canvas 2D.
- **Backend & Ledger:** Node.js/Go microservices, Redis in-memory locks, PostgreSQL ACID ledger.
- **Provably Fair:** HMAC-SHA256 client/server seed validation.

## 6. Compliance & Safety Controls
- **Sweepstakes Law:** Adherence to US No Purchase Necessary statutes, AMOE fulfillment, and geo-fencing.
- **KYC Tiers:** Tier 1 (Identity/Age Gate), Tier 2 (Gov ID + Biometric selfie), Tier 3 (Proof of address).
- **Responsible Gaming:** Daily wager limits, session reality checks, voluntary cool-off self-exclusion.
`;
