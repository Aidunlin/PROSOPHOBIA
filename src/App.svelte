<script lang="ts">
  import { Game } from "./game";
  let canvas: HTMLCanvasElement;
</script>

<svelte:window on:load={() => new Game(canvas)} />
<canvas bind:this={canvas} />
<div id="textures">
  <img src="./assets/level0.png" alt="" />
</div>
