export class Vector {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  multiplyBy(by: number) {
    return new Vector(this.x * by, this.y * by);
  }

  rotateBy(by: number) {
    return new Vector(this.x * Math.cos(by) - this.y * Math.sin(by), this.x * Math.sin(by) + this.y * Math.cos(by));
  }
}
