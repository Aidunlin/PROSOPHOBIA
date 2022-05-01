<script lang="ts">
  import { WORLD_MAP, _FREE_ } from "./World.svelte";

  class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number) {
      this.x = x ?? 0;
      this.y = y ?? 0;
    }
    multiplyBy(by: number) {
      return new Vector(this.x * by, this.y * by);
    }
    rotateBy(by: number) {
      return new Vector(this.x * Math.cos(by) - this.y * Math.sin(by), this.x * Math.sin(by) + this.y * Math.cos(by));
    }
  }

  class Player {
    position: Vector;
    direction: Vector;
    get plane(): Vector {
      return new Vector(-this.direction.y, this.direction.x).multiplyBy(ASPECT_RATIO / 2);
    }
    constructor(x?: number, y?: number, dx?: number, dy?: number) {
      this.position = new Vector(x, y);
      this.direction = new Vector(dx, dy);
    }
    move(by: Vector) {
      if (WORLD_MAP[Math.floor(this.position.y)][Math.floor(this.position.x + by.x * 2)] <= _FREE_) this.position.x += by.x;
      if (WORLD_MAP[Math.floor(this.position.y + by.y * 2)][Math.floor(this.position.x)] <= _FREE_) this.position.y += by.y;
    }
    look(by: number) {
      this.direction = this.direction.rotateBy(by);
    }
  }

  interface Sprite {
    image: HTMLImageElement;
    x: number;
    y: number;
  }

  const IMAGE_NAMES = [
    "eagle",
    "redbrick",
    "purplestone",
    "greystone",
    "bluestone",
    "mossy",
    "wood",
    "colorstone",
    "barrel",
    "pillar",
    "greenlight",
  ];

  const TEXTURES = IMAGE_NAMES.map((path) => {
    let image = new Image();
    image.src = `pics/${path}.png`;
    return image;
  });

  let spriteCache: Sprite[] = [];
  WORLD_MAP.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col < 0) spriteCache.push({image: TEXTURES[7 - col], x: x + 0.5, y: y + 0.5});
    })
  })

  const TEXTURE_SIZE = 64;

  const ASPECT_RATIO = 3 / 2;
  const HEIGHT = 480;
  const WIDTH = HEIGHT * ASPECT_RATIO;

  let zBuffer = new Array<number>(WIDTH).fill(0);

  let player = new Player(11.5, 22, 0, -1);

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let time = 0;
  let oldTime = 0;
  let frameTime = 0;

  let frameTimeDisplay = 0;
  let fpsDisplay = 0;

  let inputs = {
    w: false,
    s: false,
    a: false,
    d: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  function handleKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    let key = e.key.toLowerCase();
    if (key in inputs) inputs[key] = true;
  }

  function handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    let key = e.key.toLowerCase();
    if (key in inputs) inputs[key] = false;
  }

  function handleMouseMove(e: MouseEvent) {
    player.look((e.movementX * frameTime) / 3);
  }

  document.onpointerlockchange = () => {
    if (document.pointerLockElement == canvas) {
      document.onmousemove = handleMouseMove;
      document.onkeydown = handleKeyDown;
      document.onkeyup = handleKeyUp;
    } else {
      document.onmousemove = null;
      document.onkeydown = null;
      document.onkeyup = null;
    }
  };

  function updateMetrics() {
    frameTimeDisplay = frameTime * 1000;
    fpsDisplay = 1 / frameTime;
  }

  function init() {
    ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = false;
    setInterval(updateMetrics, 1000);
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);

    oldTime = time;
    time = performance.now();
    frameTime = (time - oldTime) / 1000;

    let moveSpeed = frameTime * 4;
    let rotateSpeed = frameTime * 3;

    if (inputs.w) player.move(player.direction.multiplyBy(moveSpeed));
    if (inputs.s) player.move(player.direction.multiplyBy(-moveSpeed));
    if (inputs.a) player.move(new Vector(player.direction.y, -player.direction.x).multiplyBy(moveSpeed));
    if (inputs.d) player.move(new Vector(-player.direction.y, player.direction.x).multiplyBy(moveSpeed));
    if (inputs.ArrowLeft) player.look(-rotateSpeed);
    if (inputs.ArrowRight) player.look(rotateSpeed);

    drawWalls();
    drawSprites();

    window.requestAnimationFrame(draw);
  }

  function drawWalls() {
    for (let x = 0; x < WIDTH; x++) {
      let cameraX = (2 * x) / WIDTH - 1;
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
      while (WORLD_MAP[mapCell.y][mapCell.x] <= _FREE_) {
        closestSideIsY = sideDistance.y < sideDistance.x;
        if (closestSideIsY) {
          sideDistance.y += deltaStep.y;
          mapCell.y += Math.sign(rayDirection.y);
        } else {
          sideDistance.x += deltaStep.x;
          mapCell.x += Math.sign(rayDirection.x);
        }
      }
      let distanceToWall = closestSideIsY ? sideDistance.y - deltaStep.y : sideDistance.x - deltaStep.x;

      let wallX = 0.0;
      if (closestSideIsY) wallX = player.position.x + distanceToWall * rayDirection.x;
      else wallX = player.position.y + distanceToWall * rayDirection.y;
      wallX -= Math.floor(wallX);

      let texture = TEXTURES[WORLD_MAP[mapCell.y][mapCell.x] - 1];
      let textureX = Math.floor(wallX * TEXTURE_SIZE);
      let lineHeight = HEIGHT / distanceToWall;
      let drawStart = (HEIGHT - lineHeight) / 2;
      ctx.drawImage(texture, textureX, 0, 1, TEXTURE_SIZE, x, drawStart, 1, lineHeight);

      if (!closestSideIsY) {
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, drawStart);
        ctx.lineTo(x + 0.5, drawStart + lineHeight);
        ctx.stroke();
      }

      zBuffer[x] = distanceToWall;
    }
  }

  function drawSprites() {
    let sprites = spriteCache.map<Sprite & { distance: number }>((sprite) => {
      return {
        ...sprite,
        distance: (player.position.x - sprite.x) ** 2 + (player.position.y - sprite.y) ** 2,
      };
    }).sort((a, b) => b.distance - a.distance);

    for (let i = 0; i < sprites.length; i++) {
      let spritePosition = new Vector(sprites[i].x - player.position.x, sprites[i].y - player.position.y);

      let transform = new Vector(
        player.direction.y * spritePosition.x - player.direction.x * spritePosition.y,
        -player.plane.y * spritePosition.x + player.plane.x * spritePosition.y
      ).multiplyBy(1 / (player.plane.x * player.direction.y - player.direction.x * player.plane.y));

      let spriteScreenX = Math.floor((WIDTH / 2) * (1 + transform.x / transform.y));
      let spriteWidth = Math.floor(Math.abs(HEIGHT / transform.y));
      let spriteHeight = Math.floor(Math.abs(HEIGHT / transform.y));
      if (spriteWidth >= WIDTH * 2 && spriteHeight >= HEIGHT * 2) continue;

      let drawStart = new Vector(spriteScreenX - spriteWidth / 2, (HEIGHT - spriteHeight) / 2);
      if (drawStart.x < -spriteWidth || drawStart.y < -spriteHeight) continue;
      if (drawStart.x >= WIDTH || drawStart.y >= HEIGHT) continue;

      for (let x = Math.floor(drawStart.x); x < drawStart.x + spriteWidth; x++) {
        let textureX = Math.floor(((x - (spriteScreenX - spriteWidth / 2)) * TEXTURE_SIZE) / spriteWidth);
        if (transform.y > 0 && transform.y < zBuffer[x]) {
          ctx.drawImage(sprites[i].image, textureX, 0, 1, TEXTURE_SIZE, x, drawStart.y, 1, spriteHeight);
        }
      }
    }
  }
</script>

<svelte:window on:load={init} />
<div>
  <h1>svelteray</h1>
  <p>
    A raycaster built in Svelte & Canvas, based on
    <a href="https://lodev.org/cgtutor/raycasting.html" target="_blank">Lode's Raycasting Tutorial</a>
  </p>
</div>
<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} on:mousedown={() => canvas.requestPointerLock()} />
<p>FPS: {fpsDisplay.toFixed(0)} | Frametime: {frameTimeDisplay.toFixed(1)} ms</p>
