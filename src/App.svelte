<script lang="ts">
  class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    rotateBy(by: number) {
      return new Vector(this.x * Math.cos(by) - this.y * Math.sin(by), this.x * Math.sin(by) + this.y * Math.cos(by));
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
  ]

  const textures = imagePaths.map(path => {
    let image = new Image();
    image.src = path;
    return image;
  })

  const textureSize = 64;
  let innerWidth = 0;
  let innerHeight = 0;

  let position = new Vector(11.5, 22);
  let direction = new Vector(0, -1);
  let plane = new Vector(1, 0);

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let time = 0;
  let oldTime = 0;
  let frameTime = 0;

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

  function move(vel: Vector) {
    if (!worldMap[Math.floor(position.y)][Math.floor(position.x + vel.x)]) position.x += vel.x;
    if (!worldMap[Math.floor(position.y + vel.y)][Math.floor(position.x)]) position.y += vel.y;
  }

  function rotate(vel: number) {
    direction = direction.rotateBy(vel);
    plane = plane.rotateBy(vel);
  }

  function init() {
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, innerHeight / 2, innerWidth, innerHeight);
    
    drawWalls();

    oldTime = time;
    time = performance.now();
    frameTime = (time - oldTime) / 1000;

    let moveSpeed = frameTime * 4;
    let rotateSpeed = frameTime * 3;

    if (inputs.w) move(new Vector(direction.x * moveSpeed, direction.y * moveSpeed));
    if (inputs.s) move(new Vector(-direction.x * moveSpeed, -direction.y * moveSpeed));
    if (inputs.a) move(new Vector(direction.y * moveSpeed, -direction.x * moveSpeed));
    if (inputs.d) move(new Vector(-direction.y * moveSpeed, direction.x * moveSpeed));
    if (inputs.ArrowLeft) rotate(-rotateSpeed);
    if (inputs.ArrowRight) rotate(rotateSpeed);

    window.requestAnimationFrame(draw);
  }

  function drawWalls() {
    for (let x = 0; x < innerWidth; x++) {
      let cameraX = (2 * x) / innerWidth - 1;
      let rayDirection = new Vector(direction.x + plane.x * cameraX, direction.y + plane.y * cameraX);
      let mapCell = new Vector(Math.floor(position.x), Math.floor(position.y));

      let deltaStep = new Vector(Math.abs(1 / rayDirection.x), Math.abs(1 / rayDirection.y));

      let firstStep = new Vector(
        (rayDirection.x < 0 ? position.x - mapCell.x : mapCell.x + 1 - position.x) * deltaStep.x,
        (rayDirection.y < 0 ? position.y - mapCell.y : mapCell.y + 1 - position.y) * deltaStep.y
      );

      let sideDistance = new Vector(firstStep.x, firstStep.y);

      let closestSideIsY = false;
      while (worldMap[mapCell.y][mapCell.x] == 0) {
        if (sideDistance.x < sideDistance.y) {
          sideDistance.x += deltaStep.x;
          mapCell.x += Math.sign(rayDirection.x);
          closestSideIsY = false;
        } else {
          sideDistance.y += deltaStep.y;
          mapCell.y += Math.sign(rayDirection.y);
          closestSideIsY = true;
        }
      }

      let distanceToWall = closestSideIsY ? sideDistance.y - deltaStep.y : sideDistance.x - deltaStep.x;

      let lineHeight = Math.floor(innerHeight / distanceToWall);
      let drawStart = (innerHeight - lineHeight) / 2;

      let textureIndex = worldMap[mapCell.y][mapCell.x] - 1;

      let wallX = 0.0;
      if (!closestSideIsY) wallX = position.y + distanceToWall * rayDirection.y;
      else wallX = position.x + distanceToWall * rayDirection.x;
      wallX -= Math.floor(wallX);

      let textureX = Math.floor(wallX * textureSize);
      ctx.drawImage(textures[textureIndex], textureX, 0, 1, textureSize, x, drawStart, 1, lineHeight);

      if (!closestSideIsY) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.moveTo(x, drawStart);
        ctx.lineTo(x, drawStart + lineHeight);
        ctx.stroke();
      }
    }
  }
</script>

<svelte:window on:load={init} bind:innerWidth bind:innerHeight on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<canvas bind:this={canvas} width={innerWidth} height={innerHeight} />
