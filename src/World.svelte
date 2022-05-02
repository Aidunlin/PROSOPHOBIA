<script lang="ts" context="module">
  export const _FREE_ = 0;
  
  export enum W {
    EGLE = 1,
    RBRK,
    PSTN,
    GSTN,
    BSTN,
    MOSS,
    WOOD,
    CSTN,
  }
  
  export enum S {
    LITE = -3,
    PLLR,
    BRRL,
  }

  export const ROOMS = [
    [
      [W.RBRK, W.RBRK, W.RBRK, W.RBRK, _FREE_, W.RBRK, W.EGLE, W.RBRK, W.RBRK],
      [W.RBRK, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.RBRK],
      [W.RBRK, _FREE_, S.BRRL, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.EGLE],
      [W.RBRK, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.RBRK],
      [_FREE_, _FREE_, _FREE_, _FREE_, S.LITE, _FREE_, _FREE_, _FREE_, _FREE_],
      [W.RBRK, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.RBRK],
      [W.EGLE, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.RBRK],
      [W.RBRK, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, S.PLLR, W.RBRK],
      [W.RBRK, W.RBRK, W.EGLE, W.RBRK, _FREE_, W.RBRK, W.RBRK, W.RBRK, W.RBRK],
    ], [
      [W.WOOD, W.WOOD, W.WOOD, W.WOOD, _FREE_, W.WOOD, W.WOOD, W.WOOD, W.WOOD],
      [W.WOOD, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.WOOD],
      [W.WOOD, _FREE_, S.BRRL, _FREE_, _FREE_, _FREE_, S.BRRL, _FREE_, W.WOOD],
      [W.WOOD, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.WOOD],
      [_FREE_, _FREE_, _FREE_, _FREE_, S.LITE, _FREE_, _FREE_, _FREE_, _FREE_],
      [W.WOOD, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.WOOD],
      [W.WOOD, _FREE_, S.BRRL, _FREE_, _FREE_, _FREE_, S.BRRL, _FREE_, W.WOOD],
      [W.WOOD, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, _FREE_, W.WOOD],
      [W.WOOD, W.WOOD, W.WOOD, W.WOOD, _FREE_, W.WOOD, W.WOOD, W.WOOD, W.WOOD],
    ]
  ];

  export function generateWorld(xRooms: number, yRooms: number) {
    let world: number[][] = [];
    for (let y = 0; y < yRooms * 9; y++) {
      let row: number[] = [];
      for (let x = 0; x < xRooms * 9; x++) row.push(_FREE_);
      world.push(row);
    }
    for (let yRoom = 0; yRoom < yRooms; yRoom++) {
      for (let xRoom = 0; xRoom < xRooms; xRoom++) {
        let room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
        for (let y = 0; y < 9; y++) {
          for (let x = 0; x < 9; x++) {
            let cell = room[y][x];
            if (xRoom == 0 && x == 0 && cell == _FREE_) cell = W.PSTN;
            if (yRoom == 0 && y == 0 && cell == _FREE_) cell = W.GSTN;
            if (xRoom == xRooms - 1 && x == 8 && cell == _FREE_) cell = W.BSTN;
            if (yRoom == yRooms - 1 && y == 8 && cell == _FREE_) cell = W.MOSS;
            world[yRoom * 9 + y][xRoom * 9 + x] = cell;
          }
        }
      }
    }
    return world;
  }

  export const getCell = (world: number[][], x: number, y: number) => world[Math.floor(y)][Math.floor(x)];
</script>
