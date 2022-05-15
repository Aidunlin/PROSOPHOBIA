<script lang="ts">
  import { Game } from "./game";

  let canvas: HTMLCanvasElement;
  let displayHeight = "100vh";
  let displayWidth = `calc(${displayHeight} * ${Game.ASPECT_RATIO})`;

  function init() {
    let game = new Game(canvas);
    document.onpointerlockchange = () => {
      if (document.pointerLockElement == canvas) {
        document.onmousemove = game.handleMouseMove;
        document.onkeydown = game.handleKeyDown;
        document.onkeyup = game.handleKeyUp;
      } else {
        document.onmousemove = null;
        document.onkeydown = null;
        document.onkeyup = null;
      }
    };
  }
</script>

<svelte:window on:load={init} />

<canvas
  bind:this={canvas}
  style={`width: ${displayWidth}; height: ${displayHeight}`}
  width={Game.WIDTH}
  height={Game.HEIGHT}
  on:mousedown={() => canvas.requestPointerLock()}
/>

<div id="textures">
  <img src="./assets/level0.png" alt="" />
</div>
