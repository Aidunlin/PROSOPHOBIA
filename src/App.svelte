<script lang="ts">
  import { Game } from "./game";

  let canvas: HTMLCanvasElement;
  let game: Game;
  
  function init() {
    game = new Game(window, canvas);
  }

  document.onpointerlockchange = () => {
    if (document.pointerLockElement == canvas) {
      onmousemove = game.handleMouseMove;
      onkeydown = game.handleKeyDown;
      onkeyup = game.handleKeyUp;
    } else {
      onmousemove = null;
      onkeydown = null;
      onkeyup = null;
    }
  };
</script>

{#if !game}
  <div>
    <h1>PROSOPHOBIA</h1>
    <button on:click={init}>Play</button>
  </div>
{/if}

<canvas
  bind:this={canvas}
  class:hide={!game}
  style={`width: calc(100vh * ${Game.ASPECT_RATIO}); height: 100vh`}
  width={Game.WIDTH}
  height={Game.HEIGHT}
  on:mousedown={() => canvas.requestPointerLock()}
/>
