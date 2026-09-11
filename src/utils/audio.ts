// Web Audio API Sound Synthesizer + Meme BGM + CS:GO Unboxing Audio

// Base URL helper for GitHub Pages compatibility
const BASE_URL = import.meta.env.BASE_URL || '/';
const getSoundUrl = (path: string) => `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

class SoundEffects {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private memeAudio: HTMLAudioElement | null = null;
  private currentSpinAudio: HTMLAudioElement | null = null;

  constructor() {
    // Preload audio on client
    if (typeof window !== 'undefined') {
      try {
        const preloadAudio = new Audio(getSoundUrl('/sounds/csgo_case_open_full.mp3'));
        preloadAudio.preload = 'auto';
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

  // Khởi tạo file âm thanh meme "Gòi gòi mày xong gòi"
  private getMemeAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.memeAudio) {
      this.memeAudio = new Audio(getSoundUrl('/sounds/goi_goi_may_xong_goi.mp3'));
      this.memeAudio.loop = true;
      this.memeAudio.volume = 0.45;
    }
    return this.memeAudio;
  }

  // Âm thanh quay hòm CS:GO chuẩn từ MyInstants (bao gồm tiếng mở hòm + lướt + dừng lại mở ra đồ)
  playSpinAudio(isMuted: boolean = false): HTMLAudioElement | null {
    if (isMuted) return null;
    try {
      this.stopSpinAudio();

      const audio = new Audio(getSoundUrl('/sounds/csgo_case_open_full.mp3'));
      audio.volume = 0.85;
      this.currentSpinAudio = audio;
      audio.play().catch(() => {
        // Nếu trình duyệt block autoplay thì fallback nhẹ
      });
      return audio;
    } catch {
      return null;
    }
  }

  stopSpinAudio() {
    if (this.currentSpinAudio) {
      try {
        this.currentSpinAudio.pause();
        this.currentSpinAudio.currentTime = 0;
      } catch {}
      this.currentSpinAudio = null;
    }
  }

  // Giữ lại để tương thích nếu component nào gọi lẻ
  playTick(_isMuted: boolean = false) {
    // Không cần phát tick rời để tránh bị trùng âm thanh với file âm thanh quay gốc
  }

  playCSGOCaseOpen(isMuted: boolean = false) {
    this.playSpinAudio(isMuted);
  }

  playWin(_rarity: string = 'QUỐC DÂN', _isMuted: boolean = false) {
    // Không cần phát âm thanh win đè lên vì file âm thanh MyInstants đã có đoạn reveal kết thúc trọn vẹn
  }

  // Phát tiếng meme khi mở hòm / quay
  playMemeVoice(isMuted: boolean = false) {
    if (isMuted) return;
    try {
      const audio = new Audio(getSoundUrl('/sounds/goi_goi_may_xong_goi.mp3'));
      audio.volume = 0.6;
      audio.play().catch(() => {});
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
