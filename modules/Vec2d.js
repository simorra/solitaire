export class Vec2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  static add(a, b) {
    return new Vec2d(a.x + b.x, a.y + b.y);
  }

  subtract(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  static subtract(a, b) {
    return new Vec2d(a.x - b.x, a.y - b.y);
  }

  multiply(val) {
    this.x *= val;
    this.y *= val;
  }

  static multiply(a, val) {
    return new Vec2d(a.x * val, a.y * val);
  }

  divide(val) {
    this.x /= val;
    this.y /= val;
  }

  static divide(a, val) {
    return new Vec2d(a.x / val, a.y / val);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    this.divide(this.magnitude());
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  clone() {
    return new Vec2d(this.x, this.y);
  }
}