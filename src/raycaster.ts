import { Vector } from "./vector";
import { EMPTY, World } from "./world";
import type { Sprite } from "./sprite";
import type { Player } from "./player";

export class Raycaster {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private depthBuffer: number[];
  private shadows: { x: number; drawStart: number; drawSize: number }[];
  private textures: HTMLImageElement[];
  private world: World;
  private sprites: Sprite[];
  private player: Player;

  constructor(
    canvas: HTMLCanvasElement,
    textures: HTMLImageElement[],
    world: World,
    sprites: Sprite[],
    player: Player
  ) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.depthBuffer = new Array<number>(this.width).fill(0);
    this.shadows = [];
    this.textures = textures;
    this.world = world;
    this.sprites = sprites;
    this.player = player;
  }

  draw() {
    this.drawBackground();
    this.drawWalls();
    this.drawShadows();
    this.drawSprites();
  }

  private drawBackground() {
    this.ctx.fillStyle = "#a09948";
    this.ctx.fillRect(0, 0, this.width, this.height / 2);
    this.ctx.fillStyle = "#847d41";
    this.ctx.fillRect(0, this.height / 2, this.width, this.height);
  }

  private drawWalls() {
    for (let x = 0; x < this.width; x++) this.drawWall(x);
  }

  private drawShadows() {
    this.ctx.strokeStyle = "rgba(0,0,0,0.3)";
    this.ctx.beginPath();
    this.shadows.forEach((line) => {
      this.ctx.moveTo(line.x + 0.5, line.drawStart);
      this.ctx.lineTo(line.x + 0.5, line.drawStart + line.drawSize);
    });
    this.ctx.stroke();
    this.shadows = [];
  }

  private drawSprites() {
    this.sprites
      .map((sprite) => ({
        ...sprite,
        distance: (this.player.position.x - sprite.x) ** 2 + (this.player.position.y - sprite.y) ** 2,
      }))
      .sort((a, b) => b.distance - a.distance)
      .forEach((sprite) => this.drawSprite(sprite));
  }

  private drawWall(x: number) {
    let cameraX = (2 * x) / this.width - 1;
    let rayDirection = new Vector(
      this.player.direction.x + this.player.plane.x * cameraX,
      this.player.direction.y + this.player.plane.y * cameraX
    );
    let deltaStep = new Vector(Math.abs(1 / rayDirection.x), Math.abs(1 / rayDirection.y));

    let mapCell = new Vector(Math.floor(this.player.position.x), Math.floor(this.player.position.y));
    let sideDistance = new Vector(
      (rayDirection.x < 0 ? this.player.position.x - mapCell.x : mapCell.x + 1 - this.player.position.x) * deltaStep.x,
      (rayDirection.y < 0 ? this.player.position.y - mapCell.y : mapCell.y + 1 - this.player.position.y) * deltaStep.y
    );

    let closestSideIsY = false;
    while (this.world.at(mapCell.x, mapCell.y) <= EMPTY) {
      closestSideIsY = sideDistance.y < sideDistance.x;
      if (closestSideIsY) {
        sideDistance.y += deltaStep.y;
        mapCell.y += Math.sign(rayDirection.y);
      } else {
        sideDistance.x += deltaStep.x;
        mapCell.x += Math.sign(rayDirection.x);
      }
    }
    this.depthBuffer[x] = closestSideIsY ? sideDistance.y - deltaStep.y : sideDistance.x - deltaStep.x;

    let wallX = 0;
    if (closestSideIsY) wallX = this.player.position.x + this.depthBuffer[x] * rayDirection.x;
    else wallX = this.player.position.y + this.depthBuffer[x] * rayDirection.y;
    wallX -= Math.floor(wallX);

    let texture = this.textures[this.world.at(mapCell.x, mapCell.y) - 1];
    let textureX = Math.floor(wallX * texture.height);
    let drawSize = this.height / this.depthBuffer[x];
    let drawStart = (this.height - drawSize) / 2;

    this.drawImageColumn(texture, textureX, x, drawStart, drawSize);
    if (!closestSideIsY) this.shadows.push({ x, drawStart, drawSize });
  }

  private drawSprite(sprite: Sprite & { distance: number }) {
    let position = new Vector(sprite.x - this.player.position.x, sprite.y - this.player.position.y);

    let transform = new Vector(
      this.player.direction.y * position.x - this.player.direction.x * position.y,
      this.player.plane.x * position.y - this.player.plane.y * position.x
    ).multiplyBy(1 / (this.player.plane.x * this.player.direction.y - this.player.direction.x * this.player.plane.y));

    let drawSize = Math.floor(Math.abs(this.height / transform.y));
    if (drawSize >= this.width * 2 || drawSize >= this.height * 2) return;

    let drawCenterX = Math.floor((this.width / 2) * (1 + transform.x / transform.y));
    let drawStart = new Vector(drawCenterX - drawSize / 2, (this.height - drawSize) / 2);
    if (drawStart.x < -drawSize || drawStart.y < -drawSize) return;
    if (drawStart.x >= this.width || drawStart.y >= this.height) return;

    for (let x = Math.floor(drawStart.x); x < drawStart.x + drawSize; x++) {
      if (transform.y > 0 && transform.y < this.depthBuffer[x]) {
        let textureX = Math.floor(((x - drawStart.x) * sprite.image.naturalWidth) / drawSize);
        this.drawImageColumn(sprite.image, textureX, x, drawStart.y, drawSize);
      }
    }
  }

  private drawImageColumn(image: HTMLImageElement, x: number, dx: number, dy: number, dh: number) {
    this.ctx.drawImage(image, x, 0, 1, image.naturalHeight, dx, dy, 1, dh);
  }
}
