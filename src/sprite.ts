import type { World } from "./world";

export interface Sprite {
  image: HTMLImageElement;
  x: number;
  y: number;
}

export function getSprites(world: World, textures: HTMLImageElement[]) {
  let sprites: Sprite[] = [];
  world.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col < 0) sprites.push({ image: textures[7 - col], x: x + 0.5, y: y + 0.5 });
    });
  });
  return sprites;
}
