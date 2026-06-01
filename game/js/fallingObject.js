class FallingObject {
  static RADIUS = {
    star: 14, bonus: 11, meteor: 13,
    shield: 12, freeze: 12, double: 12, superstar: 16, mystery: 13,
    speedMeteor: 12, slowPill: 11, life: 12
  };

  constructor(canvasWidth, speedMin, speedMax, type) {
    this.type = type || 'star';
    this.radius = FallingObject.RADIUS[this.type] || 14;
    this.x = this.radius + Math.random() * (canvasWidth - this.radius * 2);
    this.y = -this.radius;
    this.speed = speedMin + Math.random() * (speedMax - speedMin);
  }

  update(dt, speedMul) {
    this.y += this.speed * dt * (speedMul || 1);
  }

  isOffScreen(canvasHeight) {
    return this.y - this.radius > canvasHeight;
  }

  getRect() {
    return { x: this.x - this.radius, y: this.y - this.radius, w: this.radius * 2, h: this.radius * 2 };
  }
}
