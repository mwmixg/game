class Player {
  constructor(canvasWidth, canvasHeight, width, speed) {
    this.width = width || 100;
    this.height = 18;
    this.x = (canvasWidth - this.width) / 2;
    this.y = canvasHeight - this.height - 20;
    this.speed = speed || 500;
    this.canvasWidth = canvasWidth;
    this.direction = 0;
  }

  setDirection(dir) {
    this.direction = dir;
  }

  update(dt) {
    this.x += this.direction * this.speed * dt;
    this.x = Math.max(0, Math.min(this.canvasWidth - this.width, this.x));
  }

  getRect() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }
}
