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
      return new Vector(-this.direction.y, this.direction.x);
    }
    constructor(x?: number, y?: number, dx?: number, dy?: number) {
      this.position = new Vector(x, y);
      this.direction = new Vector(dx, dy);
    }
    move(by: Vector) {
      if (!worldMap[Math.floor(this.position.y)][Math.floor(this.position.x + by.x)]) this.position.x += by.x;
      if (!worldMap[Math.floor(this.position.y + by.y)][Math.floor(this.position.x)]) this.position.y += by.y;
    }
    look(by: number) {
      this.direction = this.direction.rotateBy(by);
    }
  }

  const worldMap = [
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

  const imagePaths = [
    "pics/eagle.png",
    "pics/redbrick.png",
    "pics/purplestone.png",
    "pics/greystone.png",
    "pics/bluestone.png",
    "pics/mossy.png",
    "pics/wood.png",
    "pics/colorstone.png",
  ];

  const textures = imagePaths.map((path) => {
    let image = new Image();
    image.src = path;
    return image;
  });

  const textureSize = 64;
  let innerWidth = 0;
  let innerHeight = 0;

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
    if (inputs.hasOwnProperty(e.key)) inputs[e.key] = true;
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (inputs.hasOwnProperty(e.key)) inputs[e.key] = false;
  }

  function init() {
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.font = "36px monospace";
    setInterval(() => (fps = 1 / frameTime), 1000);
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, innerHeight / 2, innerWidth, innerHeight);

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
    drawText();
    window.requestAnimationFrame(draw);
  }

  function drawWalls() {
    for (let x = 0; x < innerWidth; x++) {
      let cameraX = (2 * x) / innerWidth - 1;
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
      while (worldMap[mapCell.y][mapCell.x] == 0) {
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

      let texture = textures[worldMap[mapCell.y][mapCell.x] - 1];
      let textureX = Math.floor(wallX * textureSize);
      let lineHeight = Math.floor(innerHeight / distanceToWall);
      let drawStart = (innerHeight - lineHeight) / 2;
      ctx.drawImage(texture, textureX, 0, 1, textureSize, x, drawStart, 1, lineHeight);

      if (!closestSideIsY) drawBakedLightingLine(x, drawStart, lineHeight);
    }
  }

  function drawText() {
    ctx.fillStyle = "green";
    ctx.fillText(`FPS: ${fps.toFixed(0)}`, 24, 48);
  }

  function drawBakedLightingLine(x: number, drawStart: number, lineHeight: number) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.moveTo(x, drawStart);
    ctx.lineTo(x, drawStart + lineHeight);
    ctx.stroke();
  }
</script>

<svelte:window on:load={init} bind:innerWidth bind:innerHeight on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<canvas bind:this={canvas} width={innerWidth} height={innerHeight} />
