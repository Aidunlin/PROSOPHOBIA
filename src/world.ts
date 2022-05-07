export class World {
  map: number[][];

  constructor(xRooms: number, yRooms: number) {
    this.map = [];
    for (let y = 0; y < yRooms * 9; y++) {
      this.map.push(new Array<number>(xRooms * 9).fill(EMPTY));
    }
    for (let yRoom = 0; yRoom < yRooms; yRoom++) {
      for (let xRoom = 0; xRoom < xRooms; xRoom++) {
        let room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
        for (let y = 0; y < 9; y++) {
          for (let x = 0; x < 9; x++) {
            let cell = room[y][x];
            if (cell == EMPTY) {
              if ((xRoom == 0 && x == 0) || (xRoom == xRooms - 1 && x == 8)) cell = W.LV0;
              if ((yRoom == 0 && y == 0) || (yRoom == yRooms - 1 && y == 8)) cell = W.LV0;
            }
            this.map[yRoom * 9 + y][xRoom * 9 + x] = cell;
          }
        }
      }
    }
  }

  at(x: number, y: number) {
    return this.map[Math.floor(y)][Math.floor(x)];
  }
}

export const EMPTY = 0;

enum W {
  LV0 = 1,
}

enum S {}

const ROOMS = [
  [
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0, EMPTY, EMPTY, W.LV0],
    [EMPTY, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0, EMPTY, EMPTY, EMPTY],
    [W.LV0, EMPTY, EMPTY, W.LV0, W.LV0, W.LV0, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
  ],
  [
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0],
    [W.LV0, W.LV0, W.LV0, EMPTY, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, W.LV0, EMPTY, EMPTY, EMPTY, W.LV0, W.LV0, W.LV0],
    [W.LV0, EMPTY, W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
  ],
  [
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
    [W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0],
    [W.LV0, EMPTY, W.LV0, W.LV0, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0],
    [EMPTY, EMPTY, EMPTY, EMPTY, W.LV0, EMPTY, W.LV0, EMPTY, EMPTY],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, EMPTY, W.LV0],
    [W.LV0, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, W.LV0],
    [W.LV0, W.LV0, W.LV0, W.LV0, EMPTY, W.LV0, W.LV0, W.LV0, W.LV0],
  ],
];
