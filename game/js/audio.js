class MusicGenerator {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.nextBeatTime = 0;
    this.beatIndex = 0;
    this.timerID = null;
    this.bpm = 92;
    this.volume = 0.15;
    this.gainNode = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.volume;
    this.gainNode.connect(this.ctx.destination);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.beatIndex = 0;
    this.nextBeatTime = this.ctx.currentTime + 0.05;
    this._schedule();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.start();
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.gainNode) this.gainNode.gain.value = this.volume;
  }

  _schedule() {
    if (!this.isPlaying) return;
    const lookAhead = 0.5;
    const secPer16th = 60.0 / this.bpm / 4;

    while (this.nextBeatTime < this.ctx.currentTime + lookAhead) {
      this._playStep(this.beatIndex, this.nextBeatTime);
      this.nextBeatTime += secPer16th;
      this.beatIndex++;
    }

    this.timerID = setTimeout(() => this._schedule(), 25);
  }

  _playStep(step, time) {
    const barPos = step % 16;

    // Kick pattern (boom-bap)
    if (barPos === 0 || barPos === 4 || barPos === 11 || barPos === 12) {
      this._kick(time);
    }
    // Snare / clap
    if (barPos === 3 || barPos === 7 || barPos === 11 || barPos === 15) {
      this._snare(time);
    }
    // Hi-hat 8th notes
    if (barPos % 2 === 0) {
      this._hihat(time, barPos === 0 || barPos === 8 ? 0.6 : 0.3);
    }
    // Open hat accents
    if (barPos === 6 || barPos === 14) {
      this._openHat(time);
    }
    // Bass
    if (barPos === 0 || barPos === 4 || barPos === 8 || barPos === 12) {
      this._bass(time, barPos);
    }
  }

  _kick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.12);
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.start(time);
    osc.stop(time + 0.2);
    // Click attack
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.connect(clickGain);
    clickGain.connect(this.gainNode);
    click.type = 'sine';
    click.frequency.setValueAtTime(800, time);
    click.frequency.exponentialRampToValueAtTime(100, time + 0.03);
    clickGain.gain.setValueAtTime(0.1, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    click.start(time);
    click.stop(time + 0.04);
  }

  _snare(time) {
    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(this.gainNode);
    noiseGain.gain.setValueAtTime(0.18, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    noise.start(time);
    noise.stop(time + 0.12);
    // Tone body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, time);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  _hihat(time, vel) {
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    gain.gain.setValueAtTime(vel * 0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.start(time);
    noise.stop(time + 0.04);
  }

  _openHat(time) {
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4000;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    noise.start(time);
    noise.stop(time + 0.15);
  }

  _bass(time, barPos) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.type = 'sawtooth';
    const root = 55;
    const notes = [root, root, root * 1.5, root * 1.25];
    const noteIndex = Math.floor(barPos / 4) % notes.length;
    osc.frequency.setValueAtTime(notes[noteIndex], time);
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.setValueAtTime(0.08, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.start(time);
    osc.stop(time + 0.2);
    // Filter for warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    osc.connect(filter);
    filter.connect(gain);
  }
}
