export type CurrencyType = 'GC' | 'SC';

export interface CurrencyBalance {
  goldCoins: number;   // GC: Social currency
  sweepsCoins: number; // SC: Sweepstakes currency (redeemable)
}

export type GameCategory = 'all' | 'slots' | 'table' | 'crash' | 'instant' | 'live';
export type Volatility = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface GameMetadata {
  id: string;
  title: string;
  category: 'slots' | 'table' | 'crash' | 'instant' | 'live';
  provider: string;
  rtp: number; // e.g. 96.5%
  volatility: Volatility;
  maxWinMultiplier: number;
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  minBetGC: number;
  minBetSC: number;
  imageUrl?: string;
  themeColor: string;
  description: string;
  interactiveEngineId?: 'slots' | 'crash' | 'roulette' | 'blackjack' | 'plinko' | 'mines' | 'wheel' | 'scratch' | 'poker' | 'modular';
}

export interface JackpotPools {
  mini: number;
  minor: number;
  major: number;
  grand: number;
}

export type VIPTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Obsidian';

export interface VIPProfile {
  tier: VIPTier;
  xp: number;
  nextTierXp: number;
  lossbackRate: number; // percentage e.g. 0.10 for 10%
  dailyBonusMultiplier: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardGC: number;
  rewardSC: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  iconName: string;
}

export interface ResponsibleGamingSettings {
  ageVerified: boolean;
  dailyDepositLimit: number;
  dailyWagerLimit: number;
  sessionDurationMinutes: number;
  realityCheckInterval: number; // minutes: 15, 30, 60
  selfExcludedUntil: number | null; // timestamp
}

export interface KYCTierStatus {
  tier1Basic: 'unverified' | 'pending' | 'verified';
  tier2IDDocument: 'unverified' | 'pending' | 'verified';
  tier3ProofOfAddress: 'unverified' | 'pending' | 'verified';
}

export interface StorePackage {
  id: string;
  priceUSD: number;
  goldCoins: number;
  freeSweepsCoins: number;
  bonusPercentage: number;
  tag?: string;
  popular?: boolean;
}
