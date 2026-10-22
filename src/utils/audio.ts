// Web Audio API synthesizer for instant responsive casino sound effects
let audioCtx: AudioContext | null = null;
let soundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean) {
  soundMuted = muted;
}

export function isAudioMuted(): boolean {
  return soundMuted;
}

// Gentle chip click
export function playChipSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

// Reel tick during slot spinning
export function playReelTick() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

// Near-miss anticipation sound: Rising heartbeat tension when 2 scatters hit
export function playNearMissAnticipation() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // Low pulse
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(120, now);
  osc1.frequency.linearRampToValueAtTime(260, now + 1.2);
  gain1.gain.setValueAtTime(0.18, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.2);

  // High shimmer
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(880, now);
  osc2.frequency.exponentialRampToValueAtTime(1320, now + 1.2);
  gain2.gain.setValueAtTime(0.1, now);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 1.2);
}

// Win chime
export function playWinChime() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
}

// Grand Jackpot celebration siren & fanfare
export function playJackpotFanfare() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.09;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.5);
  });
}

// Plinko pin bounce sound
export function playPlinkoBounce(pitchMultiplier = 1) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500 * pitchMultiplier, ctx.currentTime);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

// Card deal flip
export function playCardFlip() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

// Rocket Crash explosion
export function playCrashExplosion() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}
