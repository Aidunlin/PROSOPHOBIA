import type { World } from "./world";

export class Sprite {
  image: HTMLImageElement;
  x: number;
  y: number;

  static getSprites(world: World, textures: HTMLImageElement[]) {
    let sprites: Sprite[] = [];
    world.map.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col < 0) sprites.push({ image: textures[7 - col], x: x + 0.5, y: y + 0.5 });
      });
    });
    return sprites;
  }
}
