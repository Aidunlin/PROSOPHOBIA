<script lang="ts">
  import { EMPTY, generateWorld, getCell } from "./World.svelte";

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

    get plane() {
      return new Vector(-this.direction.y, this.direction.x).multiplyBy(ASPECT_RATIO / 2);
    }

    constructor(x?: number, y?: number, dx?: number, dy?: number) {
      this.position = new Vector(x, y);
      this.direction = new Vector(dx, dy);
    }

    move(by: Vector) {
      if (getCell(world, this.position.x + by.x, this.position.y) <= EMPTY) this.position.x += by.x;
      if (getCell(world, this.position.x, this.position.y + by.y) <= EMPTY) this.position.y += by.y;
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

  const ASPECT_RATIO = 16 / 9;
  const HEIGHT = 480;
  const WIDTH = Math.floor(HEIGHT * ASPECT_RATIO);

  let playing = false;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let time = 0;
  let oldTime = 0;
  let frameTime = 0;

  let textures: HTMLImageElement[] = [];
  let world: number[][];
  let spriteCache: Sprite[];
  let depthBuffer: number[];
  let player: Player;

  let inputs = {
    w: false,
    s: false,
    a: false,
    d: false,
    arrowleft: false,
    arrowright: false,
  };

  function handleKey(e: KeyboardEvent, isDown: boolean) {
    let key = e.key.toLowerCase();
    if (key in inputs) {
      e.preventDefault();
      inputs[key] = isDown;
    }
  }

  document.onpointerlockchange = () => {
    if (document.pointerLockElement == canvas) {
      onmousemove = (e: MouseEvent) => player.look((e.movementX * frameTime) / 4);
      onkeydown = (e: KeyboardEvent) => handleKey(e, true);
      onkeyup = (e: KeyboardEvent) => handleKey(e, false);
    } else {
      onmousemove = null;
      onkeydown = null;
      onkeyup = null;
    }
  };

  function getTextures() {
    return [
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
    ].map((name) => {
      let image = new Image();
      image.src = `pics/${name}.png`;
      return image;
    });
  }

  function getSprites() {
    let sprites = [];
    world.forEach((row, y) => {
      row.forEach((col, x) => {
        if (col < 0) sprites.push({ image: textures[7 - col], x: x + 0.5, y: y + 0.5 });
      });
    });
    return sprites;
  }

  function init() {
    textures = getTextures();
    world = generateWorld(2, 2);
    spriteCache = getSprites();
    depthBuffer = new Array<number>(WIDTH).fill(0);
    player = new Player(1.5, 1.5, 0, 1);
    playing = true;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    requestAnimationFrame(update);
  }

  function update() {
    updateTime();
    handleInputs();
    drawBackground();
    drawWalls();
    drawSprites();
    requestAnimationFrame(update);
  }

  function updateTime() {
    oldTime = time;
    time = performance.now();
    frameTime = (time - oldTime) / 1000;
  }

  function handleInputs() {
    let moveSpeed = frameTime * 4;
    let rotateSpeed = frameTime * 2;
    if (inputs.w) player.move(player.direction.multiplyBy(moveSpeed));
    if (inputs.s) player.move(player.direction.multiplyBy(-moveSpeed));
    if (inputs.a) player.move(new Vector(player.direction.y, -player.direction.x).multiplyBy(moveSpeed));
    if (inputs.d) player.move(new Vector(-player.direction.y, player.direction.x).multiplyBy(moveSpeed));
    if (inputs.arrowleft) player.look(-rotateSpeed);
    if (inputs.arrowright) player.look(rotateSpeed);
  }

  function drawBackground() {
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);
  }

  function drawWalls() {
    for (let x = 0; x < WIDTH; x++) drawWall(x);
  }

  function drawSprites() {
    spriteCache
      .map((sprite) => ({
        ...sprite,
        distance: (player.position.x - sprite.x) ** 2 + (player.position.y - sprite.y) ** 2,
      }))
      .sort((a, b) => b.distance - a.distance)
      .forEach(drawSprite);
  }

  function drawWall(x: number) {
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
    depthBuffer[x] = closestSideIsY ? sideDistance.y - deltaStep.y : sideDistance.x - deltaStep.x;

    let wallX = 0.0;
    if (closestSideIsY) wallX = player.position.x + depthBuffer[x] * rayDirection.x;
    else wallX = player.position.y + depthBuffer[x] * rayDirection.y;
    wallX -= Math.floor(wallX);

    let texture = textures[getCell(world, mapCell.x, mapCell.y) - 1];
    let textureX = Math.floor(wallX * texture.height);
    let lineHeight = HEIGHT / depthBuffer[x];
    let drawStart = (HEIGHT - lineHeight) / 2;

    drawImageColumn(texture, textureX, x, drawStart, lineHeight);
    if (!closestSideIsY) drawShadowColumn(x, drawStart, lineHeight);
  }

  function drawSprite(sprite: { distance: number; image: HTMLImageElement; x: number; y: number }) {
    let spritePosition = new Vector(sprite.x - player.position.x, sprite.y - player.position.y);

    let transform = new Vector(
      player.direction.y * spritePosition.x - player.direction.x * spritePosition.y,
      -player.plane.y * spritePosition.x + player.plane.x * spritePosition.y
    ).multiplyBy(1 / (player.plane.x * player.direction.y - player.direction.x * player.plane.y));

    let spriteScreenX = Math.floor((WIDTH / 2) * (1 + transform.x / transform.y));
    let spriteWidth = Math.floor(Math.abs(HEIGHT / transform.y));
    let spriteHeight = Math.floor(Math.abs(HEIGHT / transform.y));
    if (spriteWidth >= WIDTH * 2 || spriteHeight >= HEIGHT * 2) return;

    let drawStart = new Vector(spriteScreenX - spriteWidth / 2, (HEIGHT - spriteHeight) / 2);
    if (drawStart.x < -spriteWidth || drawStart.y < -spriteHeight) return;
    if (drawStart.x >= WIDTH || drawStart.y >= HEIGHT) return;

    for (let x = Math.floor(drawStart.x); x < drawStart.x + spriteWidth; x++) {
      let textureX = Math.floor(((x - (spriteScreenX - spriteWidth / 2)) * sprite.image.height) / spriteWidth);
      if (transform.y > 0 && transform.y < depthBuffer[x]) {
        drawImageColumn(sprite.image, textureX, x, drawStart.y, spriteHeight);
      }
    }
  }

  function drawImageColumn(image: HTMLImageElement, x: number, dx: number, dy: number, dh: number) {
    ctx.drawImage(image, x, 0, 1, image.height, dx, dy, 1, dh);
  }

  function drawShadowColumn(x: number, y: number, height: number) {
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(x + 0.5, y);
    ctx.lineTo(x + 0.5, y + height);
    ctx.stroke();
  }
</script>

{#if !playing}
  <div>
    <h1>svelteray</h1>
    <p>
      A raycaster built in Svelte & Canvas, based on
      <a href="https://lodev.org/cgtutor/raycasting.html" target="_blank">Lode's Raycasting Tutorial</a>
    </p>
    <button on:click={init}>Start</button>
  </div>
{/if}

<canvas
  bind:this={canvas}
  class:hide={!playing}
  style={`width: calc(100vh * ${ASPECT_RATIO})`}
  width={WIDTH}
  height={HEIGHT}
  on:mousedown={() => canvas.requestPointerLock()}
/>
