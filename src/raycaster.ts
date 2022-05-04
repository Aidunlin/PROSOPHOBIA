import { Vector } from "./vector";
import { getCell, EMPTY, World } from "./world";
import type { Sprite } from "./sprite";
import type { Player } from "./player";

export class Raycaster {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  depthBuffer: number[];

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.width = width;
    this.height = height;
    this.depthBuffer = new Array<number>(width).fill(0);
  }

  draw(textures: HTMLImageElement[], world: World, sprites: Sprite[], player: Player) {
    this.drawBackground();
    this.drawWalls(player, world, textures);
    this.drawSprites(sprites, player);
  }

  drawBackground() {
    this.ctx.fillStyle = "#383838";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#707070";
    this.ctx.fillRect(0, this.height / 2, this.width, this.height);
  }

  drawWalls(player: Player, world: World, textures: HTMLImageElement[]) {
    for (let x = 0; x < this.width; x++) this.drawWall(x, player, world, textures);
  }

  drawSprites(sprites: Sprite[], player: Player) {
    sprites
      .map((sprite) => ({
        ...sprite,
        distance: (player.position.x - sprite.x) ** 2 + (player.position.y - sprite.y) ** 2,
      }))
      .sort((a, b) => b.distance - a.distance)
      .forEach((sprite) => this.drawSprite(sprite, player));
  }

  drawWall(x: number, player: Player, world: World, textures: HTMLImageElement[]) {
    let cameraX = (2 * x) / this.width - 1;
    let rayDirection = new Vector(
      player.direction.x + player.plane.x * cameraX,
      player.direction.y + player.plane.y * cameraX
    );
    let deltaStep = new Vector(Math.abs(1 / rayDirection.x), Math.abs(1 / rayDirection.y));

    let mapCell = new Vector(Math.floor(player.position.x), Math.floor(player.position.y));
    let sideDistance = new Vector(
      (rayDirection.x < 0 ? player.position.x - mapCell.x : mapCell.x + 1 - player.position.x) * deltaStep.x,
      (rayDirection.y < 0 ? player.position.y - mapCell.y : mapCell.y + 1 - player.position.y) * deltaStep.y
    );

    let closestSideIsY = false;
    while (getCell(world, mapCell.x, mapCell.y) <= EMPTY) {
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

    let wallX = 0.0;
    if (closestSideIsY) wallX = player.position.x + this.depthBuffer[x] * rayDirection.x;
    else wallX = player.position.y + this.depthBuffer[x] * rayDirection.y;
    wallX -= Math.floor(wallX);

    let texture = textures[getCell(world, mapCell.x, mapCell.y) - 1];
    let textureX = Math.floor(wallX * texture.height);
    let lineHeight = this.height / this.depthBuffer[x];
    let drawStart = (this.height - lineHeight) / 2;

    this.drawImageColumn(texture, textureX, x, drawStart, lineHeight);
    if (!closestSideIsY) this.drawShadowColumn(x, drawStart, lineHeight);
  }

  drawSprite(sprite: Sprite & { distance: number }, player: Player) {
    let spritePosition = new Vector(sprite.x - player.position.x, sprite.y - player.position.y);

    let transform = new Vector(
      player.direction.y * spritePosition.x - player.direction.x * spritePosition.y,
      -player.plane.y * spritePosition.x + player.plane.x * spritePosition.y
    ).multiplyBy(1 / (player.plane.x * player.direction.y - player.direction.x * player.plane.y));

    let spriteScreenX = Math.floor((this.width / 2) * (1 + transform.x / transform.y));
    let spriteWidth = Math.floor(Math.abs(this.height / transform.y));
    let spriteHeight = Math.floor(Math.abs(this.height / transform.y));
    if (spriteWidth >= this.width * 2 || spriteHeight >= this.height * 2) return;

    let drawStart = new Vector(spriteScreenX - spriteWidth / 2, (this.height - spriteHeight) / 2);
    if (drawStart.x < -spriteWidth || drawStart.y < -spriteHeight) return;
    if (drawStart.x >= this.width || drawStart.y >= this.height) return;

    for (let x = Math.floor(drawStart.x); x < drawStart.x + spriteWidth; x++) {
      let textureX = Math.floor(((x - (spriteScreenX - spriteWidth / 2)) * sprite.image.height) / spriteWidth);
      if (transform.y > 0 && transform.y < this.depthBuffer[x]) {
        this.drawImageColumn(sprite.image, textureX, x, drawStart.y, spriteHeight);
      }
    }
  }

  drawImageColumn(image: HTMLImageElement, x: number, dx: number, dy: number, dh: number) {
    this.ctx.drawImage(image, x, 0, 1, image.height, dx, dy, 1, dh);
  }

  drawShadowColumn(x: number, y: number, height: number) {
    this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
    this.ctx.beginPath();
    this.ctx.moveTo(x + 0.5, y);
    this.ctx.lineTo(x + 0.5, y + height);
    this.ctx.stroke();
  }
}
