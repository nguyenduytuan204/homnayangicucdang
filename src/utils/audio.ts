// Web Audio API Sound Synthesizer + Meme BGM + Precision CS:GO Unboxing Engine

const BASE_URL = import.meta.env.BASE_URL || '/';
const getSoundUrl = (path: string) => `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

class SoundEffects {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private memeAudio: HTMLAudioElement | null = null;

  // Cached audio buffers / elements
  private crateOpenAudio: HTMLAudioElement | null = null;
  private tickPool: HTMLAudioElement[] = [];
  private tickPoolIdx = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // Crate open click sound
        this.crateOpenAudio = new Audio(getSoundUrl('/sounds/csgo_ui_crate_open.wav'));
        this.crateOpenAudio.preload = 'auto';

        // Preload pool of 10 tick audio elements for rapid playback
        for (let i = 0; i < 10; i++) {
          const a = new Audio(getSoundUrl('/sounds/csgo_scroll.wav'));
          a.preload = 'auto';
          a.volume = 0.55;
          this.tickPool.push(a);
        }
      } catch {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Tiếng mở hòm ban đầu (khi nhấn MỞ HÒM)
  playCrateOpen(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      if (this.crateOpenAudio) {
        this.crateOpenAudio.currentTime = 0;
        this.crateOpenAudio.volume = 0.8;
        this.crateOpenAudio.play().catch(() => {});
      } else {
        const a = new Audio(getSoundUrl('/sounds/csgo_ui_crate_open.wav'));
        a.volume = 0.8;
        a.play().catch(() => {});
      }
    } catch {}
  }

  // 2. Tiếng lách cách cơ học khi mỗi món đồ lướt qua kim giữa (tương tác chính xác 1:1 với vị trí)
  playTick(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      if (this.tickPool.length > 0) {
        const audio = this.tickPool[this.tickPoolIdx];
        this.tickPoolIdx = (this.tickPoolIdx + 1) % this.tickPool.length;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        const a = new Audio(getSoundUrl('/sounds/csgo_scroll.wav'));
        a.volume = 0.55;
        a.play().catch(() => {});
      }
    } catch {}
  }

  // 3. Tiếng chúc mừng khi dừng trúng vật phẩm tương ứng với độ hiếm (Rare, Mythical, Legendary, Ancient/Gold)
  playWin(rarity: string = 'QUỐC DÂN', isMuted: boolean = false) {
    if (isMuted) return;
    try {
      let soundUrl = '/sounds/item_reveal3_rare.wav';

      if (rarity === 'TỐI MẬT' || rarity === 'ĐẶC BIỆT') {
        soundUrl = '/sounds/item_reveal6_ancient.wav';
      } else if (rarity === 'CỰC PHẨM') {
        soundUrl = '/sounds/item_reveal5_legendary.wav';
      } else if (rarity === 'HIẾM') {
        soundUrl = '/sounds/item_reveal4_mythical.wav';
      } else {
        soundUrl = '/sounds/item_reveal3_rare.wav';
      }

      const audio = new Audio(getSoundUrl(soundUrl));
      audio.volume = 0.85;
      audio.play().catch(() => {
        const fallback = new Audio(getSoundUrl('/sounds/csgo_item_reveal.mp3'));
        fallback.volume = 0.8;
        fallback.play().catch(() => {});
      });
    } catch {}
  }

  // BGM meme "Gòi gòi mày xong gòi"
  private getMemeAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.memeAudio) {
      this.memeAudio = new Audio(getSoundUrl('/sounds/goi_goi_may_xong_goi.mp3'));
      this.memeAudio.loop = true;
      this.memeAudio.volume = 0.45;
    }
    return this.memeAudio;
  }

  toggleBGM(isMuted: boolean): boolean {
    if (this.isBgmPlaying || !isMuted) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  startBGM() {
    try {
      this.isBgmPlaying = true;
      const meme = this.getMemeAudio();
      if (meme) {
        meme.currentTime = 0;
        meme.play().catch(() => {});
      }

      const ctx = this.getContext();
      if (!ctx) return;

      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.04, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      const chordFrequencies = [
        [130.81, 155.56, 196.00],
        [116.54, 155.56, 174.61],
      ];

      let chordIdx = 0;
      const playChordCycle = () => {
        if (!this.isBgmPlaying || !this.bgmGain || !this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = chordFrequencies[chordIdx];
        chordIdx = (chordIdx + 1) % chordFrequencies.length;

        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const oscGain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(350, now);

          oscGain.gain.setValueAtTime(0.001, now);
          oscGain.gain.linearRampToValueAtTime(0.08, now + 0.8);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.9);

          osc.connect(filter);
          filter.connect(oscGain);
          oscGain.connect(this.bgmGain!);

          osc.start(now);
          osc.stop(now + 4.0);
        });
      };

      playChordCycle();
      this.bgmInterval = window.setInterval(playChordCycle, 4000);
    } catch {}
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.memeAudio) {
      this.memeAudio.pause();
      this.memeAudio.currentTime = 0;
    }
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      } catch {}
      this.bgmGain = null;
    }
  }

  getIsBGMPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const soundEffects = new SoundEffects();
