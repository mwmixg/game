class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  drawPlayer(player, shieldActive) {
    const ctx = this.ctx;
    const r = player.getRect();

    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;

    ctx.fillStyle = '#1a0a20';
    this._roundRect(r.x, r.y, r.w, r.h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    this._roundRect(r.x, r.y, r.w, r.h, 6);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const deckY = r.y + 4;
    const deckR = 5;
    ctx.fillStyle = '#2a1a3a';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(r.x + r.w * 0.3, deckY, deckR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r.x + r.w * 0.7, deckY, deckR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.font = 'bold 10px "Russo One", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STAGE', r.x + r.w / 2, r.y + r.h / 2 + 2);

    if (shieldActive) {
      ctx.strokeStyle = '#9b59b6';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#9b59b6';
      ctx.shadowBlur = 20;
      this._roundRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4, 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  _roundRect(x, y, w, h, radius) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  drawObject(obj) {
    switch (obj.type) {
      case 'star': this._drawDiamond(obj); break;
      case 'bonus': this._drawStack(obj); break;
      case 'meteor': this._drawBeef(obj); break;
      case 'shield': this._drawArmor(obj); break;
      case 'freeze': this._drawIce(obj); break;
      case 'double': this._drawHype(obj); break;
      case 'superstar': this._drawCrown(obj); break;
      case 'mystery': this._drawCrate(obj); break;
      case 'speedMeteor': this._drawTurbo(obj); break;
      case 'slowPill': this._drawChill(obj); break;
      case 'life': this._drawHeart(obj); break;
    }
  }

  _drawDiamond(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 12;
    const grd = ctx.createLinearGradient(-r, 0, r, 0);
    grd.addColorStop(0, '#00d4ff');
    grd.addColorStop(0.4, '#ffd700');
    grd.addColorStop(0.7, '#fff9b0');
    grd.addColorStop(1, '#ffd700');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.25, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawStack(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.fillStyle = '#27ae60';
    ctx.shadowColor = '#27ae60';
    ctx.shadowBlur = 8;
    ctx.fillRect(-r * 0.7, -r * 0.5, r * 1.4, r);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(-r * 0.6, -r * 0.65, r * 1.4, r);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + (r * 0.9) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, -r * 0.1);
    ctx.restore();
  }

  _drawBeef(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.7);
    ctx.lineTo(r * 0.7, r * 0.7);
    ctx.moveTo(r * 0.7, -r * 0.7);
    ctx.lineTo(-r * 0.7, r * 0.7);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawArmor(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.fillStyle = '#2980b9';
    ctx.shadowColor = '#3498db';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r, -r * 0.5, r, r * 0.2);
    ctx.lineTo(r * 0.4, r);
    ctx.lineTo(0, r * 0.7);
    ctx.lineTo(-r * 0.4, r);
    ctx.lineTo(-r, r * 0.2);
    ctx.quadraticCurveTo(-r, -r * 0.5, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + (r * 0.7) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2605', 0, 1);
    ctx.restore();
  }

  _drawIce(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 14;
    ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-r * 0.3, -r * 0.4, r * 0.2, r * 0.3);
    ctx.restore();
  }

  _drawHype(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grd.addColorStop(0, '#fff9b0');
    grd.addColorStop(0.3, '#ff6b35');
    grd.addColorStop(0.7, '#e74c3c');
    grd.addColorStop(1, '#8b0000');
    ctx.fillStyle = grd;
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + (r * 0.8) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('x2', 0, 1);
    ctx.restore();
  }

  _drawCrown(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(-r, r * 0.4);
    ctx.lineTo(-r * 0.7, -r);
    ctx.lineTo(-r * 0.35, -r * 0.2);
    ctx.lineTo(0, -r);
    ctx.lineTo(r * 0.35, -r * 0.2);
    ctx.lineTo(r * 0.7, -r);
    ctx.lineTo(r, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(-r * 0.7, r * 0.25, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, r * 0.3, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(r * 0.7, r * 0.25, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawCrate(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    const grd = ctx.createRadialGradient(-3, -3, 2, 0, 0, r);
    grd.addColorStop(0, '#d7a0f0');
    grd.addColorStop(0.5, '#9b59b6');
    grd.addColorStop(1, '#5b2c6f');
    ctx.fillStyle = grd;
    ctx.shadowColor = '#9b59b6';
    ctx.shadowBlur = 10;
    ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + (r * 0.9) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 1);
    ctx.restore();
  }

  _drawTurbo(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grd.addColorStop(0, '#ffdd44');
    grd.addColorStop(0.4, '#ff6b35');
    grd.addColorStop(1, '#c0392b');
    ctx.fillStyle = grd;
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + (r * 0.85) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u26A1', 0, 1);
    ctx.restore();
  }

  _drawChill(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.scale(0.6, 1);
    const grd = ctx.createRadialGradient(0, -r * 0.2, 2, 0, 0, r);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.5, '#ecf0f1');
    grd.addColorStop(1, '#bdc3c7');
    ctx.fillStyle = grd;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  _drawHeart(obj) {
    const ctx = this.ctx;
    const r = obj.radius;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.shadowColor = '#ff6b81';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ff6b81';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.4);
    ctx.bezierCurveTo(-r * 0.8, r * 0.2, -r * 0.8, -r * 0.4, -r * 0.3, -r * 0.6);
    ctx.bezierCurveTo(0, -r * 0.8, r * 0.3, -r * 0.6, r * 0.8, -r * 0.4);
    ctx.bezierCurveTo(r * 0.8, r * 0.2, 0, r * 0.4, 0, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.25, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPopups(popups) {
    const ctx = this.ctx;
    for (const p of popups) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color || '#fff';
      ctx.font = 'bold ' + (p.size || 20) + 'px "Russo One", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = p.color || '#fff';
      ctx.shadowBlur = 10;
      ctx.fillText(p.text, p.x, p.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  drawAnnouncement(text, timer, duration) {
    if (!text || timer <= 0) return;
    const ctx = this.ctx;
    const alpha = Math.min(1, timer / (duration * 0.3));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 40px "Bangers", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 25;
    ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 60);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawMusicIcon(isPlaying) {
    const ctx = this.ctx;
    ctx.font = '20px "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isPlaying ? '#ffd700' : 'rgba(255,255,255,0.3)';
    ctx.shadowColor = isPlaying ? '#ffd700' : 'transparent';
    ctx.shadowBlur = isPlaying ? 10 : 0;
    ctx.fillText('\u{1F3B5}', this.canvas.width - 8, 4);
    ctx.shadowBlur = 0;
  }

  drawHUD(score, lives, level, targetScore, effects, events) {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(10, 10, 20, 0.6)';
    ctx.fillRect(0, 0, this.canvas.width, 40);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
    ctx.fillRect(0, 38, this.canvas.width, 2);

    ctx.font = '16px "Russo One", sans-serif';

    let leftText = 'LV.' + level + '  SCORE: ' + score + ' / ' + targetScore;
    if (events.hype) {
      leftText = '\u{1F525} HYPE MODE  ' + leftText;
    }
    if (events.wind) {
      const arrow = events.windDir > 0 ? '>>' : '<<';
      leftText += '  WIND ' + arrow;
    }
    if (events.slowMo) {
      leftText += '  SLOW-MO';
    }

    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'left';
    ctx.fillText(leftText, 14, 26);

    let rightParts = [];
    if (effects.shield) rightParts.push('\u{1F6E1}');
    if (effects.freeze > 0) rightParts.push('\u2744' + Math.ceil(effects.freeze) + 's');
    if (effects.double > 0) rightParts.push('x2 ' + Math.ceil(effects.double) + 's');
    if (effects.speedUp > 0) rightParts.push('\u26A1');
    if (effects.slowPill > 0) rightParts.push('\u{1F48A}');
    if (effects.combo > 0) rightParts.push('\u2605 x' + effects.combo);
    rightParts.push('\u2764'.repeat(Math.max(0, lives)));

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(rightParts.join('  '), this.canvas.width - 14, 26);

    if (effects.combo > 0) {
      const pct = Math.min(1, effects.comboTimer / 2.0);
      const barW = 80, barH = 3;
      const barX = (this.canvas.width - barW) / 2;
      const barY = 46;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = pct < 0.4 ? '#ff6b81' : '#ffd700';
      ctx.fillRect(barX, barY, barW * pct, barH);
    }
  }

  drawBackground(time) {
    const ctx = this.ctx;
    const grd = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grd.addColorStop(0, '#0a0520');
    grd.addColorStop(0.4, '#150a30');
    grd.addColorStop(0.7, '#1a0a2e');
    grd.addColorStop(1, '#0f0520');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#0a0515';
    const buildings = [
      {x: 0, w: 60, h: 120}, {x: 70, w: 45, h: 200}, {x: 120, w: 70, h: 150},
      {x: 200, w: 50, h: 220}, {x: 260, w: 65, h: 170}, {x: 340, w: 40, h: 190},
      {x: 390, w: 80, h: 130}, {x: 480, w: 50, h: 210}, {x: 540, w: 70, h: 160},
      {x: 620, w: 45, h: 200}, {x: 675, w: 55, h: 140}, {x: 740, w: 60, h: 180}
    ];
    const baseY = this.canvas.height - 30;
    for (const b of buildings) {
      ctx.fillRect(b.x, baseY - b.h, b.w, b.h + 30);
    }

    if (time !== undefined) {
      const t = (time / 1000) % 4;
      for (const b of buildings) {
        for (let wy = baseY - b.h + 15; wy < baseY - 5; wy += 22) {
          for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 16) {
            const phase = (wx * 0.1 + wy * 0.07 + b.x * 0.03) % 1;
            const brightness = 0.04 + 0.04 * Math.sin(t * Math.PI * 2 + phase * Math.PI * 2);
            if (brightness > 0.06) {
              ctx.fillStyle = 'rgba(255, 215, 0, ' + brightness + ')';
              ctx.fillRect(wx, wy, 6, 10);
            }
          }
        }
      }

      const pulseX = (t / 4) * this.canvas.width;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.04)';
      ctx.fillRect(pulseX - 1, 0, 2, this.canvas.height);
    }
  }
}
