import { StorePackage, VIPTier, Achievement } from '../types/casino';

export const STORE_PACKAGES: StorePackage[] = [
  {
    id: 'pack-starter',
    priceUSD: 4.99,
    goldCoins: 50000,
    freeSweepsCoins: 5.00,
    bonusPercentage: 10,
    tag: 'STARTER VALUE'
  },
  {
    id: 'pack-popular',
    priceUSD: 19.99,
    goldCoins: 250000,
    freeSweepsCoins: 21.00,
    bonusPercentage: 25,
    tag: 'MOST POPULAR',
    popular: true
  },
  {
    id: 'pack-pro',
    priceUSD: 49.99,
    goldCoins: 750000,
    freeSweepsCoins: 53.00,
    bonusPercentage: 40,
    tag: 'BEST VALUE'
  },
  {
    id: 'pack-highroller',
    priceUSD: 99.99,
    goldCoins: 1800000,
    freeSweepsCoins: 108.00,
    bonusPercentage: 60,
    tag: 'VIP WHALE'
  },
  {
    id: 'pack-elite',
    priceUSD: 299.99,
    goldCoins: 6000000,
    freeSweepsCoins: 335.00,
    bonusPercentage: 80,
    tag: 'OBSIDIAN CLUB'
  }
];

export interface VIPLevelInfo {
  tier: VIPTier;
  minXp: number;
  lossbackPercent: number; // e.g. 10
  dailyBonusMultiplier: number;
  badgeColor: string;
  perks: string[];
}

export const VIP_TIER_CONFIG: Record<VIPTier, VIPLevelInfo> = {
  Bronze: {
    tier: 'Bronze',
    minXp: 0,
    lossbackPercent: 5,
    dailyBonusMultiplier: 1.0,
    badgeColor: '#b45309',
    perks: ['5% Weekly Lossback', 'Standard Daily Streak Bonus', 'Community Chat Access']
  },
  Silver: {
    tier: 'Silver',
    minXp: 5000,
    lossbackPercent: 8,
    dailyBonusMultiplier: 1.25,
    badgeColor: '#94a3b8',
    perks: ['8% Weekly Lossback', '1.25x Daily Faucet Boost', 'Level-up Reward 25,000 GC']
  },
  Gold: {
    tier: 'Gold',
    minXp: 25000,
    lossbackPercent: 12,
    dailyBonusMultiplier: 1.5,
    badgeColor: '#eab308',
    perks: ['12% Weekly Lossback', 'Dedicated VIP Host Desk', 'Priority Sweeps Redemptions', 'Free Weekly Wheel Spin']
  },
  Platinum: {
    tier: 'Platinum',
    minXp: 100000,
    lossbackPercent: 16,
    dailyBonusMultiplier: 2.0,
    badgeColor: '#38bdf8',
    perks: ['16% Weekly Lossback', '2.0x Daily Faucet Boost', 'Custom Table Limits', 'Instant SC Transfers']
  },
  Diamond: {
    tier: 'Diamond',
    minXp: 500000,
    lossbackPercent: 20,
    dailyBonusMultiplier: 2.5,
    badgeColor: '#c084fc',
    perks: ['20% Weekly Lossback', 'Personal Account VIP Manager', 'Exclusive High-Roller Rooms', 'Birthday Luxury Gift Pack']
  },
  Obsidian: {
    tier: 'Obsidian',
    minXp: 2000000,
    lossbackPercent: 25,
    dailyBonusMultiplier: 3.0,
    badgeColor: '#10b981',
    perks: ['25% Weekly Lossback (Max Tier)', '3.0x Daily Multiplier', 'Zero Wagering on Promotions', 'Real-world Event Invitations']
  }
};

export const DAILY_STREAK_LADDER = [
  { day: 1, gc: 5000, sc: 0.50 },
  { day: 2, gc: 10000, sc: 0.75 },
  { day: 3, gc: 18000, sc: 1.00 },
  { day: 4, gc: 25000, sc: 1.50 },
  { day: 5, gc: 40000, sc: 2.00 },
  { day: 6, gc: 65000, sc: 3.00 },
  { day: 7, gc: 120000, sc: 5.00, special: 'Mega Spin Wheel' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-spin',
    title: 'First Spin of Fortune',
    description: 'Place your first bet on any slot or table game.',
    rewardGC: 5000,
    rewardSC: 0.50,
    completed: false,
    progress: 0,
    maxProgress: 1,
    iconName: 'Flame'
  },
  {
    id: 'high-roller',
    title: 'High Roller Stakes',
    description: 'Place a single wager of 1,000 GC or 5 SC.',
    rewardGC: 20000,
    rewardSC: 2.00,
    completed: false,
    progress: 0,
    maxProgress: 1,
    iconName: 'Crown'
  },
  {
    id: 'rocket-ace',
    title: 'Moonshot Astronaut',
    description: 'Successfully cash out at 5.00x or higher in Turbo Rocket Crash.',
    rewardGC: 15000,
    rewardSC: 1.50,
    completed: false,
    progress: 0,
    maxProgress: 1,
    iconName: 'Rocket'
  },
  {
    id: 'blackjack-ace',
    title: 'Card Counter 21',
    description: 'Hit a natural Blackjack against the house dealer.',
    rewardGC: 12000,
    rewardSC: 1.00,
    completed: false,
    progress: 0,
    maxProgress: 1,
    iconName: 'Sparkles'
  },
  {
    id: 'ad-patron',
    title: 'Sponsor Supporter',
    description: 'Watch 2 rewarded video ads to boost coin reserves.',
    rewardGC: 25000,
    rewardSC: 2.50,
    completed: false,
    progress: 0,
    maxProgress: 2,
    iconName: 'Tv'
  },
  {
    id: 'lucky-miner',
    title: 'Mine Sweeper Master',
    description: 'Uncover 5 consecutive diamonds in Minesweeper without detonating.',
    rewardGC: 18000,
    rewardSC: 1.50,
    completed: false,
    progress: 0,
    maxProgress: 5,
    iconName: 'Gem'
  }
];
