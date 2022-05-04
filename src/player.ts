import { Vector } from "./vector";
import { getCell, EMPTY, World } from "./world";

export class Player {
  world: World;
  position: Vector;
  direction: Vector;
  inputs = {
    w: false,
    s: false,
    a: false,
    d: false,
    arrowleft: false,
    arrowright: false,
  };

  get plane() {
    return new Vector(-this.direction.y, this.direction.x);
  }

  constructor(world: World, x: number, y: number, angle: number) {
    this.world = world;
    this.position = new Vector(x, y);
    this.direction = new Vector(Math.cos(angle), Math.sign(angle));
  }

  move(by: Vector) {
    if (getCell(this.world, this.position.x + by.x, this.position.y) <= EMPTY) this.position.x += by.x;
    if (getCell(this.world, this.position.x, this.position.y + by.y) <= EMPTY) this.position.y += by.y;
  }

  look(by: number) {
    this.direction = this.direction.rotateBy(by);
  }

  handleMouse(movement: number, frameTime: number) {
    this.look((movement * frameTime) / 4);
  }

  handleKey(e: KeyboardEvent, isDown: boolean) {
    let key = e.key.toLowerCase();
    if (key in this.inputs) {
      e.preventDefault();
      this.inputs[key] = isDown;
    }
  }

  handleInputs(frameTime: number) {
    let moveSpeed = frameTime * 4;
    let rotateSpeed = frameTime * 2;
    if (this.inputs.w) this.move(this.direction.multiplyBy(moveSpeed));
    if (this.inputs.s) this.move(this.direction.multiplyBy(-moveSpeed));
    if (this.inputs.a) this.move(new Vector(this.direction.y, -this.direction.x).multiplyBy(moveSpeed));
    if (this.inputs.d) this.move(new Vector(-this.direction.y, this.direction.x).multiplyBy(moveSpeed));
    if (this.inputs.arrowleft) this.look(-rotateSpeed);
    if (this.inputs.arrowright) this.look(rotateSpeed);
  }
}
