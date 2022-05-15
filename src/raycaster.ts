import { Vector } from "./vector";
import type { World } from "./world";
import type { Sprite } from "./sprite";
import type { Player } from "./player";

export class Raycaster {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixels: ImageData;
  depths: number[];
  textures: ImageData[];
  world: World;
  sprites: Sprite[];
  player: Player;

  constructor(
    canvas: HTMLCanvasElement,
    textures: ImageData[],
    world: World,
    sprites: Sprite[],
    player: Player
  ) {
    this.ctx = canvas.getContext("2d", {alpha: false});
    this.ctx.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.pixels = this.ctx.getImageData(0, 0, this.width, this.height);
    this.depths = new Array<number>(this.width).fill(0);
    this.textures = textures;
    this.world = world;
    this.sprites = sprites;
    this.player = player;
  }

  draw() {
    this.drawBackground();
    this.drawWalls();
    this.drawSprites();
    this.ctx.putImageData(this.pixels, 0, 0);
  }
  
  drawBackground() {
    for (let i = 0; i < this.pixels.data.length / 2; i += 4) {
      this.pixels.data[i] = 160;
      this.pixels.data[i + 1] = 153;
      this.pixels.data[i + 2] = 72;
      this.pixels.data[i + 3] = 255;
    }
    for (let i = this.pixels.data.length / 2; i < this.pixels.data.length; i += 4) {
      this.pixels.data[i] = 132;
      this.pixels.data[i + 1] = 125;
      this.pixels.data[i + 2] = 65;
      this.pixels.data[i + 3] = 255;
    }
  }

  drawWalls() {
    for (let x = 0; x < this.width; x++) this.drawWall(x);
  }

  drawSprites() {
    this.sprites
      .map((sprite) => ({
        ...sprite,
        distance: (this.player.position.x - sprite.x) ** 2 + (this.player.position.y - sprite.y) ** 2,
      }))
      .sort((a, b) => b.distance - a.distance)
      .forEach((sprite) => this.drawSprite(sprite));
  }

  drawWall(x: number) {
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
    while (this.world.at(mapCell.x, mapCell.y) <= 0) {
      closestSideIsY = sideDistance.y < sideDistance.x;
      if (closestSideIsY) {
        sideDistance.y += deltaStep.y;
        mapCell.y += Math.sign(rayDirection.y);
      } else {
        sideDistance.x += deltaStep.x;
        mapCell.x += Math.sign(rayDirection.x);
      }
    }
    this.depths[x] = closestSideIsY ? sideDistance.y - deltaStep.y : sideDistance.x - deltaStep.x;

    let wallX = 0;
    if (closestSideIsY) wallX = this.player.position.x + this.depths[x] * rayDirection.x;
    else wallX = this.player.position.y + this.depths[x] * rayDirection.y;
    wallX -= Math.floor(wallX);

    let texture = this.textures[this.world.at(mapCell.x, mapCell.y) - 1];
    let textureX = Math.floor(wallX * texture.width);
    let drawSize = Math.floor(this.height / this.depths[x]);
    let drawStart = Math.floor((this.height - drawSize) / 2);
    this.drawTextureColumn(texture, textureX, x, drawStart, drawSize, closestSideIsY ? 1 : 0.6);
  }

  drawSprite(sprite: Sprite & { distance: number }) {
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
      if (transform.y > 0 && transform.y < this.depths[x]) {
        let textureX = Math.floor(((x - drawStart.x) * sprite.texture.width) / drawSize);
        this.drawTextureColumn(sprite.texture, textureX, x, drawStart.y, drawSize);
      }
    }
  }

  drawTextureColumn(texture: ImageData, textureX: number, dx: number, dy: number, dh: number, a: number = 1) {
    let step = texture.height / dh;
    let textureY = Math.max(0, (dy - (this.height + dh) / 2) * step);
    let textureWidth = texture.width;
    for (let y = dy; y < dy + dh; y++) {
      let destIndex = y * this.width * 4 + dx * 4;
      let srcIndex = Math.floor(textureY) * textureWidth * 4 + textureX * 4;
      this.pixels.data[destIndex] = texture.data[srcIndex] * a;
      this.pixels.data[destIndex + 1] = texture.data[srcIndex + 1] * a;
      this.pixels.data[destIndex + 2] = texture.data[srcIndex + 2] * a;
      textureY += step;
    }
  }
}
