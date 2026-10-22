import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CurrencyType,
  GameMetadata,
  JackpotPools,
  VIPTier,
  VIPProfile,
  Achievement,
  ResponsibleGamingSettings,
  KYCTierStatus,
  StorePackage
} from '../types/casino';
import {
  VIP_TIER_CONFIG,
  DAILY_STREAK_LADDER,
  INITIAL_ACHIEVEMENTS
} from '../data/casinoConfig';
import { playWinChime, playJackpotFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CasinoContextType {
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  goldCoins: number;
  sweepsCoins: number;
  vip: VIPProfile;
  jackpots: JackpotPools;
  streakDay: number;
  canClaimStreak: boolean;
  claimDailyStreak: () => void;
  claimLossback: () => void;
  claimableLossbackGC: number;
  claimableLossbackSC: number;
  achievements: Achievement[];
  claimAchievementReward: (id: string) => void;
  responsibleGaming: ResponsibleGamingSettings;
  updateResponsibleGaming: (settings: Partial<ResponsibleGamingSettings>) => void;
  kyc: KYCTierStatus;
  submitKYCTier: (tier: 1 | 2 | 3) => void;
  
  // Game launcher
  activeGame: GameMetadata | null;
  openGame: (game: GameMetadata) => void;
  closeGame: () => void;

  // Active Modals
  activeModal: 'store' | 'vip' | 'blueprint' | 'ad' | 'compliance' | 'achievements' | 'age-gate' | null;
  openModal: (modal: 'store' | 'vip' | 'blueprint' | 'ad' | 'compliance' | 'achievements') => void;
  closeModal: () => void;

  // Wagering & Economics
  placeBet: (amount: number) => boolean;
  awardWin: (payout: number, multiplier?: number, description?: string) => void;

  // Ad Monetization
  adBoostMultiplier: number;
  adBoostSecondsRemaining: number;
  adsWatchedTotal: number;
  isWatchingAd: boolean;
  watchRewardedAd: (reason?: string) => void;
  completeAdWatch: () => void;
  cancelAdWatch: () => void;

  // Store
  purchasePackage: (pkg: StorePackage) => void;

  // Toast / Notifications
  toastMessage: { text: string; type: 'success' | 'info' | 'jackpot' } | null;
  dismissToast: () => void;
}

const CasinoContext = createContext<CasinoContextType | null>(null);

const STORAGE_KEY_GC = 'veloce_gc_v1';
const STORAGE_KEY_SC = 'veloce_sc_v1';
const STORAGE_KEY_XP = 'veloce_xp_v1';
const STORAGE_KEY_STREAK = 'veloce_streak_v1';
const STORAGE_KEY_STREAK_TIME = 'veloce_streak_time_v1';

export const CasinoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>('GC');

  // Balances
  const [goldCoins, setGoldCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GC);
    return saved ? Number(saved) : 150000;
  });

  const [sweepsCoins, setSweepsCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SC);
    return saved ? Number(saved) : 25.00;
  });

  // XP & VIP
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_XP);
    return saved ? Number(saved) : 3200;
  });

  // Daily Streak
  const [streakDay, setStreakDay] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STREAK);
    return saved ? Math.min(Number(saved), 7) : 1;
  });
  const [lastStreakTime, setLastStreakTime] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STREAK_TIME);
    return saved ? Number(saved) : 0;
  });

  // Lossback tracking
  const [netLossesGC, setNetLossesGC] = useState<number>(180000);
  const [netLossesSC, setNetLossesSC] = useState<number>(12.50);

  // Progressive Jackpots
  const [jackpots, setJackpots] = useState<JackpotPools>({
    mini: 450.25,
    minor: 3250.80,
    major: 28940.15,
    grand: 184520.40
  });

  // Ad Monetization Boost
  const [adBoostSecondsRemaining, setAdBoostSecondsRemaining] = useState<number>(0);
  const [adsWatchedTotal, setAdsWatchedTotal] = useState<number>(1);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Active game modal
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<'store' | 'vip' | 'blueprint' | 'ad' | 'compliance' | 'achievements' | 'age-gate' | null>(null);

  // Responsible gaming
  const [responsibleGaming, setResponsibleGaming] = useState<ResponsibleGamingSettings>({
    ageVerified: true,
    dailyDepositLimit: 500,
    dailyWagerLimit: 500000,
    sessionDurationMinutes: 120,
    realityCheckInterval: 30,
    selfExcludedUntil: null
  });

  // KYC
  const [kyc, setKyc] = useState<KYCTierStatus>({
    tier1Basic: 'verified',
    tier2IDDocument: 'pending',
    tier3ProofOfAddress: 'unverified'
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'jackpot' } | null>(null);

  // Determine VIP Tier from XP
  const calculateVIPTier = (currXp: number): VIPProfile => {
    let tier: VIPTier = 'Bronze';
    let nextTierXp = 5000;

    if (currXp >= 2000000) {
      tier = 'Obsidian';
      nextTierXp = 5000000;
    } else if (currXp >= 500000) {
      tier = 'Diamond';
      nextTierXp = 2000000;
    } else if (currXp >= 100000) {
      tier = 'Platinum';
      nextTierXp = 500000;
    } else if (currXp >= 25000) {
      tier = 'Gold';
      nextTierXp = 100000;
    } else if (currXp >= 5000) {
      tier = 'Silver';
      nextTierXp = 25000;
    }

    const config = VIP_TIER_CONFIG[tier];
    return {
      tier,
      xp: currXp,
      nextTierXp,
      lossbackRate: config.lossbackPercent / 100,
      dailyBonusMultiplier: config.dailyBonusMultiplier
    };
  };

  const vip = calculateVIPTier(xp);

  // Sync balances to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GC, goldCoins.toString());
  }, [goldCoins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SC, sweepsCoins.toFixed(2));
  }, [sweepsCoins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_XP, xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STREAK, streakDay.toString());
    localStorage.setItem(STORAGE_KEY_STREAK_TIME, lastStreakTime.toString());
  }, [streakDay, lastStreakTime]);

  // Tick jackpots gradually to simulate live community pooled contributions
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpots(prev => ({
        mini: Number((prev.mini + 0.05 + Math.random() * 0.1).toFixed(2)),
        minor: Number((prev.minor + 0.15 + Math.random() * 0.25).toFixed(2)),
        major: Number((prev.major + 0.45 + Math.random() * 0.75).toFixed(2)),
        grand: Number((prev.grand + 1.25 + Math.random() * 2.1).toFixed(2))
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Ad Boost countdown timer
  useEffect(() => {
    if (adBoostSecondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setAdBoostSecondsRemaining(sec => Math.max(0, sec - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [adBoostSecondsRemaining]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'jackpot' = 'info') => {
    setToastMessage({ text, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Daily Streak check
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const canClaimStreak = now - lastStreakTime >= 12 * 60 * 60 * 1000 || lastStreakTime === 0;

  const claimDailyStreak = useCallback(() => {
    if (!canClaimStreak) {
      showToast('Daily reward already claimed! Check back tomorrow.', 'info');
      return;
    }

    const currentLadder = DAILY_STREAK_LADDER[Math.min(streakDay - 1, 6)];
    const bonusGC = Math.round(currentLadder.gc * vip.dailyBonusMultiplier);
    const bonusSC = Number((currentLadder.sc * (1 + (vip.dailyBonusMultiplier - 1) * 0.5)).toFixed(2));

    setGoldCoins(g => g + bonusGC);
    setSweepsCoins(s => Number((s + bonusSC).toFixed(2)));
    setLastStreakTime(Date.now());
    setStreakDay(d => (d >= 7 ? 1 : d + 1));
    setXp(x => x + 500);

    playWinChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`Claimed Day ${streakDay} Streak: +${bonusGC.toLocaleString()} GC & +${bonusSC.toFixed(2)} SC!`, 'success');
  }, [canClaimStreak, streakDay, vip.dailyBonusMultiplier, showToast]);

  // Lossback claim
  const claimableLossbackGC = Math.round(netLossesGC * vip.lossbackRate);
  const claimableLossbackSC = Number((netLossesSC * vip.lossbackRate).toFixed(2));

  const claimLossback = useCallback(() => {
    if (claimableLossbackGC <= 0 && claimableLossbackSC <= 0) {
      showToast('No lossback bonus available right now.', 'info');
      return;
    }
    setGoldCoins(g => g + claimableLossbackGC);
    setSweepsCoins(s => Number((s + claimableLossbackSC).toFixed(2)));
    setNetLossesGC(0);
    setNetLossesSC(0);
    playWinChime();
    showToast(`Claimed VIP Lossback: +${claimableLossbackGC.toLocaleString()} GC & +${claimableLossbackSC.toFixed(2)} SC!`, 'success');
  }, [claimableLossbackGC, claimableLossbackSC, showToast]);

  // Wagering
  const placeBet = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;

    // Check self-exclusion
    if (responsibleGaming.selfExcludedUntil && Date.now() < responsibleGaming.selfExcludedUntil) {
      showToast('Account is currently in self-exclusion cool-off period.', 'info');
      return false;
    }

    if (currency === 'GC') {
      if (goldCoins < amount) {
        showToast('Insufficient Gold Coins! Watch an ad or get more in the store.', 'info');
        return false;
      }
      setGoldCoins(g => g - amount);
      setNetLossesGC(l => l + amount * 0.1); // add to potential lossback calculation
      setXp(x => x + Math.max(10, Math.floor(amount / 50)));
    } else {
      if (sweepsCoins < amount) {
        showToast('Insufficient Sweeps Coins! Claim your daily bonus or store offers.', 'info');
        return false;
      }
      setSweepsCoins(s => Number((s - amount).toFixed(2)));
      setNetLossesSC(l => Number((l + amount * 0.1).toFixed(2)));
      setXp(x => x + Math.max(50, Math.floor(amount * 100)));
    }
    return true;
  }, [currency, goldCoins, sweepsCoins, responsibleGaming.selfExcludedUntil, showToast]);

  // Award win with optional ad boost
  const awardWin = useCallback((payout: number, multiplier = 1, description = '') => {
    if (payout <= 0) return;

    let finalPayout = payout;
    const isBoostActive = adBoostSecondsRemaining > 0;
    if (isBoostActive) {
      finalPayout = payout * 2;
    }

    if (currency === 'GC') {
      setGoldCoins(g => g + finalPayout);
      setNetLossesGC(l => Math.max(0, l - finalPayout * 0.1));
    } else {
      setSweepsCoins(s => Number((s + finalPayout).toFixed(2)));
      setNetLossesSC(l => Number(Math.max(0, l - finalPayout * 0.1).toFixed(2)));
    }

    if (multiplier >= 50) {
      playJackpotFanfare();
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      showToast(`🔥 MEGA WIN! Won ${finalPayout.toLocaleString()} ${currency} (${multiplier.toFixed(1)}x)!`, 'jackpot');
    } else {
      playWinChime();
      showToast(`Won ${finalPayout.toLocaleString()} ${currency} ${description ? `· ${description}` : ''}${isBoostActive ? ' (2x Ad Boost Applied!)' : ''}`, 'success');
    }
  }, [adBoostSecondsRemaining, currency, showToast]);

  // Ad Monetization
  const watchRewardedAd = useCallback(() => {
    setIsWatchingAd(true);
    setActiveModal('ad');
  }, []);

  const completeAdWatch = useCallback(() => {
    setIsWatchingAd(false);
    setActiveModal(null);
    setAdsWatchedTotal(a => a + 1);

    // Grant 10,000 GC + 1.00 SC + 10-minute 2x win boost!
    const rewardGC = 15000;
    const rewardSC = 1.00;
    setGoldCoins(g => g + rewardGC);
    setSweepsCoins(s => Number((s + rewardSC).toFixed(2)));
    setAdBoostSecondsRemaining(10 * 60); // 10 minutes 2x boost!
    setXp(x => x + 250);

    playWinChime();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    showToast(`Ad reward received: +${rewardGC.toLocaleString()} GC, +${rewardSC.toFixed(2)} SC & 10-Min 2X Multiplier Boost!`, 'success');
  }, [showToast]);

  const cancelAdWatch = useCallback(() => {
    setIsWatchingAd(false);
    setActiveModal(null);
  }, []);

  // Store purchases
  const purchasePackage = useCallback((pkg: StorePackage) => {
    setGoldCoins(g => g + pkg.goldCoins);
    setSweepsCoins(s => Number((s + pkg.freeSweepsCoins).toFixed(2)));
    setXp(x => x + Math.round(pkg.priceUSD * 1000));
    playJackpotFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    showToast(`Purchase Complete! Added ${pkg.goldCoins.toLocaleString()} GC + ${pkg.freeSweepsCoins.toFixed(2)} Free SC!`, 'success');
    setActiveModal(null);
  }, [showToast]);

  // Claim achievement
  const claimAchievementReward = useCallback((id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.completed) {
        setGoldCoins(g => g + a.rewardGC);
        setSweepsCoins(s => Number((s + a.rewardSC).toFixed(2)));
        playWinChime();
        showToast(`Achievement Unlocked! +${a.rewardGC.toLocaleString()} GC & +${a.rewardSC.toFixed(2)} SC`, 'success');
        return { ...a, completed: true, progress: a.maxProgress };
      }
      return a;
    }));
  }, [showToast]);

  const updateResponsibleGaming = useCallback((settings: Partial<ResponsibleGamingSettings>) => {
    setResponsibleGaming(prev => ({ ...prev, ...settings }));
    showToast('Responsible gaming preferences saved.', 'info');
  }, [showToast]);

  const submitKYCTier = useCallback((tier: 1 | 2 | 3) => {
    setKyc(prev => {
      if (tier === 1) return { ...prev, tier1Basic: 'verified' };
      if (tier === 2) return { ...prev, tier2IDDocument: 'verified' };
      if (tier === 3) return { ...prev, tier3ProofOfAddress: 'verified' };
      return prev;
    });
    playWinChime();
    showToast(`KYC Tier ${tier} document submitted and successfully approved!`, 'success');
  }, [showToast]);

  const openGame = useCallback((game: GameMetadata) => {
    setActiveGame(game);
  }, []);

  const closeGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  const openModal = useCallback((modal: 'store' | 'vip' | 'blueprint' | 'ad' | 'compliance' | 'achievements') => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <CasinoContext.Provider
      value={{
        currency,
        setCurrency,
        goldCoins,
        sweepsCoins,
        vip,
        jackpots,
        streakDay,
        canClaimStreak,
        claimDailyStreak,
        claimLossback,
        claimableLossbackGC,
        claimableLossbackSC,
        achievements,
        claimAchievementReward,
        responsibleGaming,
        updateResponsibleGaming,
        kyc,
        submitKYCTier,
        activeGame,
        openGame,
        closeGame,
        activeModal,
        openModal,
        closeModal,
        placeBet,
        awardWin,
        adBoostMultiplier: adBoostSecondsRemaining > 0 ? 2 : 1,
        adBoostSecondsRemaining,
        adsWatchedTotal,
        isWatchingAd,
        watchRewardedAd,
        completeAdWatch,
        cancelAdWatch,
        purchasePackage,
        toastMessage,
        dismissToast
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = () => {
  const ctx = useContext(CasinoContext);
  if (!ctx) throw new Error('useCasino must be used within CasinoProvider');
  return ctx;
};
