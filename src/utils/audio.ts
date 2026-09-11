// Web Audio API Sound Synthesizer + Meme BGM "Gòi Gòi Mày Xong Gòi"

class SoundEffects {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private memeAudio: HTMLAudioElement | null = null;

  // Preloaded audio elements for instant zero-latency playback
  private caseOpenAudio: HTMLAudioElement | null = null;
  private scrollTickAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.caseOpenAudio = new Audio('/sounds/csgo_ui_crate_open.wav');
      this.caseOpenAudio.preload = 'auto';
      this.scrollTickAudio = new Audio('/sounds/csgo_scroll.wav');
      this.scrollTickAudio.preload = 'auto';
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

  // Khởi tạo file âm thanh meme "Gòi gòi mày xong gòi"
  private getMemeAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.memeAudio) {
      this.memeAudio = new Audio('/sounds/goi_goi_may_xong_goi.mp3');
      this.memeAudio.loop = true;
      this.memeAudio.volume = 0.45;
    }
    return this.memeAudio;
  }

  // CS:GO Case Open Sound (khi bấm MỞ HÒM)
  playCSGOCaseOpen(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      const audio = new Audio('/sounds/csgo_ui_crate_open.wav');
      audio.volume = 0.8;
      audio.play().catch(() => {
        // Fallback synthetic case open swoosh
        this.playSyntheticCaseOpen();
      });
    } catch {
      this.playSyntheticCaseOpen();
    }
  }

  // Phát tiếng meme khi mở hòm / quay
  playMemeVoice(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      const audio = new Audio('/sounds/goi_goi_may_xong_goi.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  }

  // CS:GO Roulette Tick (crisp mechanical click sound as items pass)
  playTick(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      const audio = new Audio('/sounds/csgo_scroll.wav');
      audio.volume = 0.55;
      audio.play().catch(() => {
        this.playSyntheticTick();
      });
    } catch {
      this.playSyntheticTick();
    }
  }

  // Fallback synthetic mechanical tick
  private playSyntheticTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  private playSyntheticCaseOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // CS:GO Item Reveal / Win Sound based on Rarity (QUỐC DÂN, HIẾM, CỰC PHẨM, ĐẶC BIỆT, TỐI MẬT / GOLD KNIFE)
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

      const audio = new Audio(soundUrl);
      audio.volume = 0.85;
      audio.play().catch(() => {
        // Secondary fallback to itemreveal.mp3
        const fallback = new Audio('/sounds/csgo_item_reveal.mp3');
        fallback.volume = 0.8;
        fallback.play().catch(() => {});
      });
    } catch {}
  }

  // ----------------------------------------------------
  // Nhạc nền BGM: "Gòi Gòi Mày Xong Gòi" Meme + Ambient Synth
  // ----------------------------------------------------
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

      // 1. Phát nhạc meme "Gòi gòi mày xong gòi"
      const meme = this.getMemeAudio();
      if (meme) {
        meme.currentTime = 0;
        meme.play().catch(() => {});
      }

      // 2. Phát thêm nền synth ambient nhẹ
      const ctx = this.getContext();
      if (!ctx) return;

      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.04, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      const chordFrequencies = [
        [130.81, 155.56, 196.00], // C3, Eb3, G3
        [116.54, 155.56, 174.61], // Bb2, Eb3, F3
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

    // Dừng nhạc meme
    if (this.memeAudio) {
      this.memeAudio.pause();
      this.memeAudio.currentTime = 0;
    }

    // Dừng synth
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
