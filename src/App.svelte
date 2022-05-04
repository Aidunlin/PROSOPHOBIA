<script lang="ts">
  import { generateWorld, World } from "./world";
  import { getSprites, Sprite } from "./sprite";
  import { Player } from "./player";
  import { Raycaster } from "./raycaster";

  const ASPECT_RATIO = 16 / 9;
  const HEIGHT = 480;
  const WIDTH = Math.floor(HEIGHT * ASPECT_RATIO);

  let playing = false;
  let canvas: HTMLCanvasElement;

  let time = 0;
  let oldTime = 0;
  let frameTime = 0;

  let textures: HTMLImageElement[] = [];
  let world: World;
  let sprites: Sprite[];
  let player: Player;
  let raycaster: Raycaster;

  function init() {
    textures = getTextures();
    world = generateWorld(2, 2);
    sprites = getSprites(world, textures);
    player = new Player(world, 1.5, 1.5, Math.PI / 2);
    raycaster = new Raycaster(canvas, WIDTH, HEIGHT);
    playing = true;
    requestAnimationFrame(update);
  }

  function update() {
    updateTime();
    player.handleInputs(frameTime);
    raycaster.draw(textures, world, sprites, player);
    requestAnimationFrame(update);
  }

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

  function updateTime() {
    oldTime = time;
    time = performance.now();
    frameTime = (time - oldTime) / 1000;
  }

  document.onpointerlockchange = () => {
    if (document.pointerLockElement == canvas) {
      onmousemove = (e: MouseEvent) => player.handleMouse(e.movementX, frameTime);
      onkeydown = (e: KeyboardEvent) => player.handleKey(e, true);
      onkeyup = (e: KeyboardEvent) => player.handleKey(e, false);
    } else {
      onmousemove = null;
      onkeydown = null;
      onkeyup = null;
    }
  };
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
