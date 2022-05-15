import { World } from "./world";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { Raycaster } from "./raycaster";

export class Game {
  static readonly ASPECT_RATIO = 4 / 3;
  static readonly HEIGHT = 480;
  static readonly WIDTH = Math.floor(this.HEIGHT * this.ASPECT_RATIO);

  playing = false;
  
  time = 0;
  oldTime = 0;
  frameTime = 0;
  
  textures: ImageData[] = [];
  world: World;
  sprites: Sprite[] = [];
  player: Player;
  raycaster: Raycaster;
  
  constructor(canvas: HTMLCanvasElement) {
    this.textures = this.getTextures();
    this.world = new World(2, 2);
    this.sprites = Sprite.getSprites(this.world, this.textures);
    this.player = new Player(this.world, 1.5, 1.5, Math.PI / 2);
    this.raycaster = new Raycaster(canvas, this.textures, this.world, this.sprites, this.player);
    this.playing = true;
    requestAnimationFrame(this.update);
  }
  
  update: FrameRequestCallback = () => {
    this.updateTime();
    this.player.handleInputs(this.frameTime);
    this.raycaster.draw();
    requestAnimationFrame(this.update);
  }
  
  updateTime() {
    this.oldTime = this.time;
    this.time = performance.now();
    this.frameTime = (this.time - this.oldTime) / 1000;
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

  handleMouseMove = (e: MouseEvent) => this.player.handleMouse(e.movementX, this.frameTime);
  handleKeyDown = (e: KeyboardEvent) => this.player.handleKey(e, true);
  handleKeyUp = (e: KeyboardEvent) => this.player.handleKey(e, false);
}
