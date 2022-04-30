<script lang="ts">
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
      return new Vector(-this.direction.y * 0.66, this.direction.x * 0.66);
    }
    constructor(x?: number, y?: number, dx?: number, dy?: number) {
      this.position = new Vector(x, y);
      this.direction = new Vector(dx, dy);
    }
    move(by: Vector) {
      if (!WORLD_MAP[Math.floor(this.position.y)][Math.floor(this.position.x + by.x)]) this.position.x += by.x;
      if (!WORLD_MAP[Math.floor(this.position.y + by.y)][Math.floor(this.position.x)]) this.position.y += by.y;
    }
    look(by: number) {
      this.direction = this.direction.rotateBy(by);
    }
  }

  const WORLD_MAP = [
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 6, 4, 4, 6, 4, 6, 4, 4, 4, 6, 4],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [8, 0, 3, 3, 0, 0, 0, 0, 0, 8, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [8, 0, 3, 3, 0, 0, 0, 0, 0, 8, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 6, 6, 6, 0, 6, 4, 6],
    [8, 8, 8, 8, 0, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 6, 0, 0, 0, 0, 0, 6],
    [7, 7, 7, 7, 0, 7, 7, 7, 7, 0, 8, 0, 8, 0, 8, 0, 8, 4, 0, 4, 0, 6, 0, 6],
    [7, 7, 0, 0, 0, 0, 0, 0, 7, 8, 0, 8, 0, 8, 0, 8, 8, 6, 0, 0, 0, 0, 0, 6],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 0, 0, 0, 0, 0, 4],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 0, 6, 0, 6, 0, 6],
    [7, 7, 0, 0, 0, 0, 0, 0, 7, 8, 0, 8, 0, 8, 0, 8, 8, 6, 4, 6, 0, 6, 6, 6],
    [7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 8, 4, 0, 6, 8, 4, 8, 3, 3, 3, 0, 3, 3, 3],
    [2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 6, 4, 0, 0, 6, 0, 6, 3, 0, 0, 0, 0, 0, 3],
    [2, 2, 0, 0, 0, 0, 0, 2, 2, 4, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 3],
    [2, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 3],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 6, 0, 6, 3, 3, 0, 0, 0, 3, 3],
    [2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 6, 6, 0, 0, 5, 0, 5, 0, 5],
    [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 5, 0, 5, 0, 0, 0, 5, 5],
    [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 5, 0, 5, 0, 5, 0, 5, 0, 5],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 5, 0, 5, 0, 5, 0, 5, 0, 5],
    [2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 5, 0, 5, 0, 0, 0, 5, 5],
    [2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ];

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

  interface Sprite {
    image: HTMLImageElement;
    x: number;
    y: number;
  }

  const SPRITES: Sprite[] = [
    { image: TEXTURES[8], x: 1.5, y: 15.5 },
    { image: TEXTURES[8], x: 1.5, y: 21.5 },
    { image: TEXTURES[8], x: 1.2, y: 16.2 },
    { image: TEXTURES[8], x: 1.8, y: 16 },
    { image: TEXTURES[8], x: 2.5, y: 3.5 },
    { image: TEXTURES[8], x: 15.1, y: 10 },
    { image: TEXTURES[8], x: 15.5, y: 9.5 },
    { image: TEXTURES[8], x: 15.8, y: 10.5 },
    { image: TEXTURES[9], x: 10.5, y: 18.5 },
    { image: TEXTURES[9], x: 11.5, y: 18.5 },
    { image: TEXTURES[9], x: 12.5, y: 18.5 },
    { image: TEXTURES[10], x: 4.5, y: 18.5 },
    { image: TEXTURES[10], x: 4.5, y: 10 },
    { image: TEXTURES[10], x: 6.5, y: 3.5 },
    { image: TEXTURES[10], x: 11.5, y: 20.5 },
    { image: TEXTURES[10], x: 12.5, y: 10 },
    { image: TEXTURES[10], x: 14.5, y: 3.5 },
    { image: TEXTURES[10], x: 20.5, y: 3.5 },
    { image: TEXTURES[10], x: 20.5, y: 14.5 },
  ];

  const TEXTURE_SIZE = 64;
  let width = 640;
  let height = 480;

  let zBuffer: number[] = [];
  for (let i = 0; i < width; i++) zBuffer.push(0);

  let player = new Player(11.5, 22, 0, -1);

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let time = 0;
  let oldTime = 0;
  let frameTime = 0;
  let fps = 0;

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
    if (inputs.hasOwnProperty(e.key)) inputs[e.key] = true;
  }

  function handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    if (inputs.hasOwnProperty(e.key)) inputs[e.key] = false;
  }

  function handleMouseMove(e: MouseEvent) {
    player.look(e.movementX * frameTime / 3);
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

  function init() {
    ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = false;
    ctx.font = "36px monospace";
    setInterval(() => (fps = 1 / frameTime), 1000);
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, height / 2, width, height);

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
    for (let x = 0; x < width; x++) {
      let cameraX = (2 * x) / width - 1;
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
      while (WORLD_MAP[mapCell.y][mapCell.x] == 0) {
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
      let lineHeight = height / distanceToWall;
      let drawStart = (height - lineHeight) / 2;
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
    let sprites = SPRITES.map<Sprite & { distance: number }>((sprite) => {
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

      let spriteScreenX = Math.floor((width / 2) * (1 + transform.x / transform.y));
      let spriteWidth = Math.floor(Math.abs(height / transform.y));
      let spriteHeight = Math.floor(Math.abs(height / transform.y));
      if (spriteWidth >= width * 2 && spriteHeight >= height * 2) continue;
      
      let drawStart = new Vector(spriteScreenX - spriteWidth / 2, (height - spriteHeight) / 2);
      if (drawStart.x < -spriteWidth || drawStart.y < -spriteHeight) continue;
      if (drawStart.x >= width || drawStart.y >= height) continue;

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
<h1>svelteray</h1>
<canvas bind:this={canvas} {width} {height} on:mousedown={() => canvas.requestPointerLock()} />
<p>FPS: {fps.toFixed(0)}</p>
