// 音效管理

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  // 初始化音訊上下文
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // 播放落子音效
  playPlaceSound() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 440; // A4 音符
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // 播放獲勝音效
  playWinSound() {
    if (!this.enabled || !this.audioContext) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    let startTime = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const noteStart = startTime + index * 0.15;
      const noteEnd = noteStart + 0.3;

      gainNode.gain.setValueAtTime(0.3, noteStart);
      gainNode.gain.exponentialRampToValueAtTime(0.01, noteEnd);

      oscillator.start(noteStart);
      oscillator.stop(noteEnd);
    });
  }

  // 播放錯誤音效
  playErrorSound() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // 切換音效開關
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 設置音效開關
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export default new SoundEffects();
