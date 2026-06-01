const LEVELS = [
  {
    desc: 'Warm Up',
    targetScore: 30,
    speedMin: 140, speedMax: 200,
    spawnInterval: 1.2, minSpawnInterval: 0.8,
    spawnRateDec: 0.012,
    probs: { star: 0.95, bonus: 0.05 },
    playerWidth: 120,
    playerSpeed: 500,
    events: ['starRain']
  },
  {
    desc: 'First Beef',
    targetScore: 70,
    speedMin: 160, speedMax: 230,
    spawnInterval: 1.0, minSpawnInterval: 0.65,
    spawnRateDec: 0.015,
    probs: { star: 0.87, bonus: 0.08, meteor: 0.05 },
    playerWidth: 115,
    playerSpeed: 520,
    events: ['starRain', 'wind']
  },
  {
    desc: 'Mystery Crate',
    targetScore: 120,
    speedMin: 180, speedMax: 260,
    spawnInterval: 0.9, minSpawnInterval: 0.55,
    spawnRateDec: 0.017,
    probs: { star: 0.67, bonus: 0.10, meteor: 0.15, mystery: 0.03, slowPill: 0.03, life: 0.02 },
    playerWidth: 110,
    playerSpeed: 540,
    events: ['starRain', 'wind', 'slowMo']
  },
  {
    desc: 'Getting Serious',
    targetScore: 200,
    speedMin: 200, speedMax: 290,
    spawnInterval: 0.8, minSpawnInterval: 0.45,
    spawnRateDec: 0.02,
    probs: { star: 0.48, bonus: 0.12, meteor: 0.22, shield: 0.04, freeze: 0.03, mystery: 0.04, speedMeteor: 0.03, slowPill: 0.02, life: 0.02 },
    playerWidth: 100,
    playerSpeed: 560,
    events: ['starRain', 'wind', 'slowMo', 'hype']
  },
  {
    desc: 'On Fire',
    targetScore: 300,
    speedMin: 220, speedMax: 320,
    spawnInterval: 0.7, minSpawnInterval: 0.4,
    spawnRateDec: 0.022,
    probs: { star: 0.35, bonus: 0.12, meteor: 0.25, shield: 0.05, freeze: 0.04, double: 0.04, mystery: 0.05, superstar: 0.03, speedMeteor: 0.03, slowPill: 0.02, life: 0.02 },
    playerWidth: 90,
    playerSpeed: 580,
    events: ['starRain', 'wind', 'slowMo', 'hype']
  },
  {
    desc: 'Final Boss',
    targetScore: 400,
    speedMin: 240, speedMax: 350,
    spawnInterval: 0.6, minSpawnInterval: 0.35,
    spawnRateDec: 0.025,
    probs: { star: 0.24, bonus: 0.12, meteor: 0.28, shield: 0.06, freeze: 0.05, double: 0.05, mystery: 0.06, superstar: 0.05, speedMeteor: 0.04, slowPill: 0.03, life: 0.02 },
    playerWidth: 80,
    playerSpeed: 600,
    events: ['starRain', 'wind', 'slowMo', 'hype']
  }
];

const FUN_PHRASES = ['YEEAH!', 'GET IT!', 'BOOM!', 'FRESH!', 'WUT?!', 'DOPE!', 'LIT!', 'GANG!', 'FIRE!', 'YO!'];

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.state = 'menu';
    this.currentLevel = 1;

    this.player = null;
    this.objects = [];
    this.score = 0;
    this.lives = 3;
    this.spawnTimer = 0;
    this.spawnInterval = 1.2;
    this.lastTime = 0;

    this.keys = { left: false, right: false };
    this.audioCtx = null;
    this.music = null;

    this.shieldActive = false;
    this.freezeTimer = 0;
    this.doubleTimer = 0;
    this.speedUpTimer = 0;
    this.slowPillTimer = 0;

    this.popups = [];
    this.shakeTimer = 0;
    this.shakeIntensity = 6;
    this.combo = 0;
    this.comboTimer = 0;
    this.announcement = null;
    this.events = {
      wind: { active: false, timer: 0, dir: 1 },
      slowMo: { active: false, timer: 0 },
      hype: { active: false, timer: 0 }
    };
    this.eventTimer = 0;

    this._bindKeys();
    this._bindButtons();
  }

  _levelCfg() {
    if (this.currentLevel <= 6) return LEVELS[this.currentLevel - 1];
    const base = LEVELS[5];
    const extra = this.currentLevel - 6;
    return {
      desc: 'Endless ' + extra,
      targetScore: 400 + extra * 100,
      speedMin: Math.min(base.speedMin + extra * 10, 400),
      speedMax: Math.min(base.speedMax + extra * 15, 550),
      spawnInterval: Math.max(base.spawnInterval - extra * 0.03, 0.25),
      minSpawnInterval: Math.max(base.minSpawnInterval - extra * 0.02, 0.15),
      spawnRateDec: base.spawnRateDec,
      probs: base.probs,
      playerWidth: Math.max(base.playerWidth - extra * 2, 60),
      playerSpeed: Math.min(base.playerSpeed + extra * 10, 800),
      events: base.events
    };
  }

  _levelTarget() {
    return this._levelCfg().targetScore;
  }

  _bindKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.keys.left = true;
        e.preventDefault();
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.keys.right = true;
        e.preventDefault();
      }
      if (e.key === ' ' && this.state === 'menu') {
        e.preventDefault();
        this.start();
      }
      if (e.key === 'm' || e.key === 'M') {
        if (this.music) this.music.toggle();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = false;
    });
  }

  _bindButtons() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('restartWinBtn').addEventListener('click', () => this.restart());
    document.getElementById('restartLoseBtn').addEventListener('click', () => this.restart());
    document.getElementById('levelContinueBtn').addEventListener('click', () => this._advanceLevel());
  }

  _toggleScreen(screenId, show) {
    const el = document.getElementById(screenId);
    if (el) el.classList.toggle('hidden', !show);
  }

  start() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {}
    this.currentLevel = 1;
    this.state = 'playing';
    this._resetAll();
    this._initLevel();
    this._toggleScreen('startScreen', false);
    this._toggleScreen('winScreen', false);
    this._toggleScreen('loseScreen', false);
    this._toggleScreen('levelScreen', false);
    this.lastTime = performance.now();
    // Start music
    if (this.music) {
      this.music.init();
      this.music.start();
    }
    this._loop(this.lastTime);
  }

  _resetAll() {
    this.shieldActive = false;
    this.freezeTimer = 0;
    this.doubleTimer = 0;
    this.speedUpTimer = 0;
    this.slowPillTimer = 0;
    this.popups = [];
    this.shakeTimer = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.announcement = null;
    this.events.wind.active = false;
    this.events.slowMo.active = false;
    this.events.hype.active = false;
    this.eventTimer = 5 + Math.random() * 5;
  }

  _initLevel() {
    const cfg = this._levelCfg();
    this.player = new Player(this.canvas.width, this.canvas.height, cfg.playerWidth, cfg.playerSpeed);
    this.objects = [];
    this.score = this.currentLevel === 1 ? 0 : this.score;
    this.lives = this.currentLevel === 1 ? 3 : this.lives;
    this.spawnTimer = 0;
    this.spawnInterval = cfg.spawnInterval;
    this.eventTimer = 5 + Math.random() * 5;
    this.announcement = null;
  }

  restart() {
    this.start();
  }

  _advanceLevel() {
    if (this.state !== 'levelTransition') return;
    this.currentLevel++;
    this._initLevel();
    this.state = 'playing';
    this._toggleScreen('levelScreen', false);
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  _playSound(type) {
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

      if (type === 'catch') {
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, this.audioCtx.currentTime + 0.1);
      } else if (type === 'bonus') {
        osc.frequency.setValueAtTime(1047, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1568, this.audioCtx.currentTime + 0.15);
      } else if (type === 'powerup') {
        osc.frequency.setValueAtTime(660, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(1100, this.audioCtx.currentTime + 0.16);
      } else if (type === 'mystery') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      } else if (type === 'miss') {
        osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.25);
      } else if (type === 'shieldBlock') {
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.12);
      } else if (type === 'combo') {
        osc.frequency.setValueAtTime(660, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.06);
        osc.frequency.setValueAtTime(1100, this.audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(523, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.12);
        osc.frequency.setValueAtTime(784, this.audioCtx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.4);
      } else if (type === 'levelup') {
        osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(554, this.audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);
      } else if (type === 'speedUp') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
      } else if (type === 'slowDown') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      } else if (type === 'hype') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(900, this.audioCtx.currentTime + 0.16);
        osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);
      }
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch (_) {}
  }

  _collides(playerRect, objRect) {
    return (
      playerRect.x < objRect.x + objRect.w &&
      playerRect.x + playerRect.w > objRect.x &&
      playerRect.y < objRect.y + objRect.h &&
      playerRect.y + playerRect.h > objRect.y
    );
  }

  _pickType(probs) {
    const entries = Object.entries(probs);
    const r = Math.random();
    let cumulative = 0;
    for (const [type, prob] of entries) {
      cumulative += prob;
      if (r < cumulative) return type;
    }
    return 'star';
  }

  _speedMul() {
    let mul = 1.0;
    if (this.freezeTimer > 0) mul *= 0.3;
    if (this.events.slowMo.active) mul *= 0.5;
    if (this.speedUpTimer > 0) mul *= 1.4;
    if (this.slowPillTimer > 0) mul *= 0.6;
    if (this.events.hype.active) mul *= 1.5;
    return mul;
  }

  _getEffects() {
    return {
      shield: this.shieldActive,
      freeze: this.freezeTimer,
      double: this.doubleTimer,
      speedUp: this.speedUpTimer,
      slowPill: this.slowPillTimer,
      combo: this.combo >= 3 ? this.combo : 0,
      comboTimer: this.comboTimer
    };
  }

  _getEvents() {
    return {
      wind: this.events.wind.active,
      windDir: this.events.wind.dir,
      slowMo: this.events.slowMo.active,
      hype: this.events.hype.active
    };
  }

  _addPopup(text, x, y, color, size) {
    this.popups.push({
      text, x, y,
      life: 0.8, maxLife: 0.8,
      color: color || '#fff',
      size: size || 20
    });
  }

  _setAnnouncement(text, duration) {
    this.announcement = { text, timer: duration, duration };
  }

  _updateInput(dt) {
    let dir = 0;
    if (this.keys.left) dir -= 1;
    if (this.keys.right) dir += 1;
    this.player.setDirection(dir);
  }

  _updateEffects(dt) {
    if (this.freezeTimer > 0) { this.freezeTimer -= dt; if (this.freezeTimer < 0) this.freezeTimer = 0; }
    if (this.doubleTimer > 0) { this.doubleTimer -= dt; if (this.doubleTimer < 0) this.doubleTimer = 0; }
    if (this.speedUpTimer > 0) { this.speedUpTimer -= dt; if (this.speedUpTimer < 0) this.speedUpTimer = 0; }
    if (this.slowPillTimer > 0) { this.slowPillTimer -= dt; if (this.slowPillTimer < 0) this.slowPillTimer = 0; }
    if (this.events.hype.active) {
      this.events.hype.timer -= dt;
      if (this.events.hype.timer <= 0) this.events.hype.active = false;
    }
  }

  _updateCombo(dt) {
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = Math.max(0, this.combo - 1);
        this.comboTimer = this.combo > 0 ? 0.5 : 0;
      }
    }
  }

  _updatePopups(dt) {
    for (const p of this.popups) { p.y -= 55 * dt; p.life -= dt; }
    this.popups = this.popups.filter(p => p.life > 0);
  }

  _updateShake(dt) {
    if (this.shakeTimer > 0) { this.shakeTimer -= dt; }
  }

  _updateEvents(dt) {
    if (this.events.wind.active) {
      this.events.wind.timer -= dt;
      if (this.events.wind.timer <= 0) this.events.wind.active = false;
    }
    if (this.events.slowMo.active) {
      this.events.slowMo.timer -= dt;
      if (this.events.slowMo.timer <= 0) this.events.slowMo.active = false;
    }
    if (this.announcement) {
      this.announcement.timer -= dt;
      if (this.announcement.timer <= 0) this.announcement = null;
    }
    this.eventTimer -= dt;
    if (this.eventTimer <= 0) {
      this._triggerEvent();
      this.eventTimer = 10 + Math.random() * 8;
    }
  }

  _triggerEvent() {
    const cfg = this._levelCfg();
    if (!cfg.events || cfg.events.length === 0) return;
    const type = cfg.events[Math.floor(Math.random() * cfg.events.length)];

    switch (type) {
      case 'wind':
        this.events.wind.active = true;
        this.events.wind.timer = 3 + Math.random() * 1.5;
        this.events.wind.dir = Math.random() > 0.5 ? 1 : -1;
        this._setAnnouncement('\u{1F4A8} WIND ' + (this.events.wind.dir > 0 ? '>>' : '<<'), 1.5);
        break;
      case 'starRain':
        this._setAnnouncement('\u2B50 STAR RAIN!', 1.2);
        const rc = this._levelCfg();
        for (let i = 0; i < 8; i++) {
          const obj = new FallingObject(this.canvas.width, rc.speedMin + 30, rc.speedMax + 40, 'star');
          obj.y = -obj.radius - i * 25 - Math.random() * 20;
          obj.x = obj.radius + Math.random() * (this.canvas.width - obj.radius * 2);
          this.objects.push(obj);
        }
        break;
      case 'slowMo':
        this.events.slowMo.active = true;
        this.events.slowMo.timer = 3 + Math.random();
        this._setAnnouncement('\u{1F9CA} SLOW-MO!', 1.5);
        break;
      case 'hype':
        this.events.hype.active = true;
        this.events.hype.timer = 5;
        this._setAnnouncement('\u{1F525} HYPE MODE! \u{1F525}', 2);
        this._playSound('hype');
        break;
    }
  }

  _updateObjects(dt) {
    const cfg = this._levelCfg();

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      const type = this._pickType(cfg.probs);
      this.objects.push(new FallingObject(this.canvas.width, cfg.speedMin, cfg.speedMax, type));
      if (this.spawnInterval > cfg.minSpawnInterval) {
        this.spawnInterval -= cfg.spawnRateDec;
      }
    }

    const playerRect = this.player.getRect();
    const speedMul = this._speedMul();
    const remaining = [];

    for (const obj of this.objects) {
      obj.update(dt, speedMul);

      if (this.events.wind.active) {
        obj.x += this.events.wind.dir * 60 * dt;
        obj.x = Math.max(obj.radius, Math.min(this.canvas.width - obj.radius, obj.x));
      }

      const objRect = obj.getRect();

      if (this._collides(playerRect, objRect)) {
        this._handleCatch(obj);
        continue;
      }

      if (obj.isOffScreen(this.canvas.height)) {
        this._handleMiss(obj);
        continue;
      }

      remaining.push(obj);
    }

    this.objects = remaining;

    if (this.score >= cfg.targetScore && this.state === 'playing') {
      this.state = 'levelTransition';
      this._playSound('levelup');
    }
  }

  _handleCatch(obj) {
    const cx = obj.x, cy = obj.y;
    const hypeMul = this.events.hype.active ? 1.5 : 1;

    switch (obj.type) {
      case 'meteor':
        this.shakeTimer = 0.25;
        if (this.shieldActive) {
          this.shieldActive = false;
          this._addPopup('\u{1F6E1} BLOCKED!', cx, cy, '#9b59b6', 22);
          this._playSound('shieldBlock');
        } else {
          this.lives--;
          this._addPopup('\u{1F5E1} BEEF!', cx, cy, '#e74c3c', 24);
          this._playSound('miss');
          this.combo = 0;
          if (this.lives <= 0) { this.state = 'lost'; this._playSound('lose'); if (this.music) this.music.stop(); }
        }
        break;

      case 'bonus':
        this.score += Math.round((this.doubleTimer > 0 ? 50 : 25) * hypeMul);
        this._addPopup('\u{1F4B0} +' + Math.round((this.doubleTimer > 0 ? 50 : 25) * hypeMul), cx, cy, '#2ecc71', 22);
        this._playSound('bonus');
        this._addCombo();
        break;

      case 'superstar':
        this.score += Math.round((this.doubleTimer > 0 ? 100 : 50) * hypeMul);
        this._addPopup('\u{1F451} +' + Math.round((this.doubleTimer > 0 ? 100 : 50) * hypeMul), cx, cy, '#ffd700', 26);
        this._playSound('bonus');
        this._addCombo();
        break;

      case 'shield':
        this.shieldActive = true;
        this._addPopup('\u{1F6E1} ARMOR!', cx, cy, '#3498db', 22);
        this._playSound('powerup');
        break;

      case 'freeze':
        this.freezeTimer = 3;
        this._addPopup('\u2744 ICE!', cx, cy, '#00d4ff', 22);
        this._playSound('powerup');
        break;

      case 'double':
        this.doubleTimer = 5;
        this._addPopup('\u{1F525} HYPE x2!', cx, cy, '#ff6b35', 22);
        this._playSound('powerup');
        break;

      case 'mystery': {
        const roll = Math.random();
        let label = '';
        if (roll < 0.35) {
          this.score += 30;
          label = '+30 \u{1F4B0}';
        } else if (roll < 0.55) {
          this.score += 15;
          label = '+15 \u{1F4B0}';
        } else if (roll < 0.70) {
          this.shieldActive = true;
          label = '\u{1F6E1} ARMOR!';
        } else if (roll < 0.82) {
          this.freezeTimer = 3;
          label = '\u2744 ICE!';
        } else if (roll < 0.93) {
          this.doubleTimer = 5;
          label = '\u{1F525} HYPE!';
        } else {
          this.lives = Math.min(this.lives + 1, 5);
          label = '\u2764 +1 LIFE!';
        }
        this._addPopup('\u{1F4E6} ? ' + label, cx, cy, '#d7a0f0', 22);
        this._playSound('mystery');
        break;
      }

      case 'speedMeteor':
        this.score += Math.round(15 * hypeMul);
        this.speedUpTimer = 4;
        this._addPopup('\u26A1 TURBO!', cx, cy, '#ff6b35', 22);
        this._playSound('speedUp');
        break;

      case 'slowPill':
        this.slowPillTimer = 4;
        this._addPopup('\u{1F48A} CHILL!', cx, cy, '#ecf0f1', 22);
        this._playSound('slowDown');
        break;

      case 'life':
        this.lives = Math.min(this.lives + 1, 5);
        this._addPopup('\u2764 +1 LIFE', cx, cy, '#ff6b81', 22);
        this._playSound('powerup');
        break;

      default:
        const pts = Math.round((this.doubleTimer > 0 ? 20 : 10) * hypeMul);
        this.score += pts;
        this._addPopup('\u{1F48E} +' + pts, cx, cy, '#ffd700', 18);
        this._playSound('catch');
        // Random fun phrase sometimes
        if (Math.random() < 0.15) {
          this._addPopup(FUN_PHRASES[Math.floor(Math.random() * FUN_PHRASES.length)], cx, cy + 22, '#ff6b81', 12);
        }
        this._addCombo();
        break;
    }
  }

  _addCombo() {
    this.combo = Math.min(this.combo + 1, 10);
    this.comboTimer = 2.0;
    this._checkCombo();
  }

  _handleMiss(obj) {
    if (obj.type === 'star') {
      this._addPopup('\u{1F494} OOPS!', obj.x, obj.y, '#ff6b81', 20);
      this.combo = Math.floor(this.combo * 0.6);
      this.comboTimer = 2.0;
      if (this.shieldActive) {
        this.shieldActive = false;
        this._addPopup('\u{1F6E1} ARMOR BROKEN!', obj.x, obj.y - 25, '#3498db', 14);
        this._playSound('shieldBlock');
      } else {
        this.lives--;
        this._playSound('miss');
        if (this.lives <= 0) { this.state = 'lost'; this._playSound('lose'); if (this.music) this.music.stop(); }
      }
    }
  }

  _checkCombo() {
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y - 30;
    if (this.combo === 3) {
      this.score += 5;
      this._addPopup('\u{1F525} NICE! x3 +5', px, py, '#f1c40f', 22);
      this._playSound('combo');
    } else if (this.combo === 5) {
      this.score += 10;
      this._addPopup('\u{1F525}\u{1F525} HOT STREAK! x5 +10', px, py, '#e67e22', 24);
      this._playSound('combo');
    } else if (this.combo === 7) {
      this.score += 15;
      this._addPopup('\u{1F525}\u{1F525}\u{1F525} ON FIRE! x7 +15', px, py, '#e74c3c', 26);
      this._playSound('combo');
    } else if (this.combo === 10) {
      this.score += 20;
      this._addPopup('\u{1F451} LEGENDARY! x10 +20', px, py, '#ffd700', 28);
      this._playSound('combo');
    }
  }

  _render() {
    const ctx = this.renderer.ctx;
    ctx.save();

    if (this.shakeTimer > 0) {
      const ox = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const oy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(ox, oy);
    }

    const isPlaying = this.music ? this.music.isPlaying : false;
    this.renderer.drawBackground(performance.now());
    this.renderer.drawPlayer(this.player, this.shieldActive);
    for (const obj of this.objects) this.renderer.drawObject(obj);
    this.renderer.drawMusicIcon(isPlaying);
    this.renderer.drawHUD(this.score, this.lives, this.currentLevel, this._levelTarget(), this._getEffects(), this._getEvents());
    this.renderer.drawPopups(this.popups);
    if (this.announcement) {
      this.renderer.drawAnnouncement(this.announcement.text, this.announcement.timer, this.announcement.duration);
    }

    ctx.restore();
  }

  _showResult() {
    if (this.state === 'won') {
      document.getElementById('winScore').textContent = this.score;
      this._toggleScreen('winScreen', true);
    }
    if (this.state === 'lost') {
      document.getElementById('loseScore').textContent = this.score;
      this._toggleScreen('loseScreen', true);
    }
    if (this.state === 'levelTransition') {
      const lvlName = this.currentLevel <= 6
        ? '\u{1F451} LEVEL ' + this.currentLevel + ' CLEAR!'
        : '\u{1F451} ENDLESS ' + (this.currentLevel - 6) + ' CLEAR!';
      document.getElementById('levelTitle').textContent = lvlName;
      document.getElementById('levelScore').textContent = this.score;
      this._toggleScreen('levelScreen', true);
    }
  }

  _loop(time) {
    if (this.state === 'menu') return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (this.state === 'playing') {
      this._updateInput(dt);
      this.player.update(dt);
      this._updateEffects(dt);
      this._updateCombo(dt);
      this._updatePopups(dt);
      this._updateShake(dt);
      this._updateEvents(dt);
      this._updateObjects(dt);
      this._render();
    }

    if (this.state === 'won' || this.state === 'lost' || this.state === 'levelTransition') {
      this._render();
      this._showResult();
      return;
    }

    requestAnimationFrame((t) => this._loop(t));
  }
}
