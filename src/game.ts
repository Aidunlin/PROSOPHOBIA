import { World } from "./world";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { Raycaster } from "./raycaster";

export class Game {
  aspectRatio = 4 / 3;
  height = 480;
  width = Math.floor(this.height * this.aspectRatio);
  displayHeight = `100vh`;
  displayWidth = `calc(${this.displayHeight} * ${this.aspectRatio})`;

  time = 0;
  oldTime = 0;
  frameTime = 0;

  textures: ImageData[];
  world: World;
  sprites: Sprite[];
  player: Player;
  raycaster: Raycaster;

  constructor(canvas: HTMLCanvasElement) {
    this.initCanvas(canvas);
    this.textures = this.getTextures();
    this.world = new World(2, 2);
    this.sprites = Sprite.getSprites(this.world, this.textures);
    this.player = new Player(this.world, 1.5, 1.5, Math.PI / 2);
    this.raycaster = new Raycaster(canvas, this.textures, this.world, this.sprites, this.player);
    requestAnimationFrame(this.update);
  }

  initCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.width = this.displayWidth;
    canvas.style.height = this.displayHeight;
    canvas.onmousedown = () => canvas.requestPointerLock();
    document.onpointerlockchange = () => this.handlePointerLock(canvas);
  }

  getTextures() {
    let tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1024;
    tempCanvas.height = 1024;
    let tempCtx = tempCanvas.getContext("2d");
    return [...document.getElementById("textures").children].map((texture: HTMLImageElement) => {
      tempCtx.drawImage(texture, 0, 0);
      return tempCtx.getImageData(0, 0, texture.width, texture.height);
    });
  }

  update: FrameRequestCallback = () => {
    this.updateTime();
    this.player.handleInputs(this.frameTime);
    this.raycaster.draw();
    requestAnimationFrame(this.update);
  };

  updateTime() {
    this.oldTime = this.time;
    this.time = performance.now();
    this.frameTime = (this.time - this.oldTime) / 1000;
  }

  handlePointerLock(canvas: HTMLCanvasElement) {
    if (document.pointerLockElement == canvas) {
      document.onmousemove = (e) => this.player.handleMouse(e.movementX, this.frameTime);
      document.onkeydown = (e) => this.player.handleKey(e, true);
      document.onkeyup = (e) => this.player.handleKey(e, false);
    } else {
      document.onmousemove = null;
      document.onkeydown = null;
      document.onkeyup = null;
    }
  }
}
