export type World = number[][];

export const EMPTY = 0;

enum W {
  EGL = 1,
  RBK,
  PST,
  GST,
  BST,
  MSS,
  WDD,
  CST,
}

enum S {
  LIT = -3,
  PLR,
  BRL,
}

const ROOMS = [
  [
    [W.RBK, W.RBK, W.RBK, W.RBK, EMPTY, W.RBK, W.EGL, W.RBK, W.RBK],
    [W.RBK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.RBK],
    [W.RBK, EMPTY, S.BRL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.EGL],
    [W.RBK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.RBK],
    [EMPTY, EMPTY, EMPTY, EMPTY, S.LIT, EMPTY, EMPTY, EMPTY, EMPTY],
    [W.RBK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.RBK],
    [W.EGL, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.RBK],
    [W.RBK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, S.PLR, W.RBK],
    [W.RBK, W.RBK, W.EGL, W.RBK, EMPTY, W.RBK, W.RBK, W.RBK, W.RBK],
  ],
  [
    [W.WDD, W.WDD, W.WDD, W.WDD, EMPTY, W.WDD, W.WDD, W.WDD, W.WDD],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [W.WDD, EMPTY, S.BRL, EMPTY, EMPTY, EMPTY, S.BRL, EMPTY, W.WDD],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [EMPTY, EMPTY, EMPTY, EMPTY, S.LIT, EMPTY, EMPTY, EMPTY, EMPTY],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [W.WDD, EMPTY, S.BRL, EMPTY, EMPTY, EMPTY, S.BRL, EMPTY, W.WDD],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [W.WDD, W.WDD, W.WDD, W.WDD, EMPTY, W.WDD, W.WDD, W.WDD, W.WDD],
  ],
  [
    [W.WDD, W.WDD, W.WDD, W.WDD, EMPTY, W.WDD, W.WDD, W.WDD, W.WDD],
    [W.WDD, EMPTY, EMPTY, W.WDD, EMPTY, EMPTY, W.WDD, EMPTY, W.WDD],
    [W.WDD, EMPTY, EMPTY, W.WDD, EMPTY, EMPTY, W.WDD, EMPTY, W.WDD],
    [W.WDD, EMPTY, W.WDD, W.WDD, EMPTY, EMPTY, W.WDD, EMPTY, W.WDD],
    [EMPTY, EMPTY, EMPTY, EMPTY, S.LIT, EMPTY, W.WDD, EMPTY, EMPTY],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [W.WDD, EMPTY, W.WDD, W.WDD, W.WDD, W.WDD, EMPTY, EMPTY, W.WDD],
    [W.WDD, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.WDD],
    [W.WDD, W.WDD, W.WDD, W.WDD, EMPTY, W.WDD, W.WDD, W.WDD, W.WDD],
  ],
];

export function generateWorld(xRooms: number, yRooms: number) {
  let world: World = [];
  for (let y = 0; y < yRooms * 9; y++) {
    let row: number[] = [];
    for (let x = 0; x < xRooms * 9; x++) row.push(EMPTY);
    world.push(row);
  }
  for (let yRoom = 0; yRoom < yRooms; yRoom++) {
    for (let xRoom = 0; xRoom < xRooms; xRoom++) {
      let room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          let cell = room[y][x];
          if (xRoom == 0 && x == 0 && cell == EMPTY) cell = W.PST;
          if (yRoom == 0 && y == 0 && cell == EMPTY) cell = W.GST;
          if (xRoom == xRooms - 1 && x == 8 && cell == EMPTY) cell = W.BST;
          if (yRoom == yRooms - 1 && y == 8 && cell == EMPTY) cell = W.MSS;
          world[yRoom * 9 + y][xRoom * 9 + x] = cell;
        }
      }
    }
  }
  return world;
}

export function getCell(world: World, x: number, y: number) {
  return world[Math.floor(y)][Math.floor(x)];
}
