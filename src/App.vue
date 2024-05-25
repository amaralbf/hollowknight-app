<script setup lang="ts">
import { onMounted } from "vue";
// import { initCanvas } from "./pixi.ts";
import { initCanvas } from "./pixi.ts";

onMounted(() => {
  initCanvas();
});
</script>

<template>
  <div id="pixijs-canvas"></div>
</template>

<style scoped>
#pixijs-canvas {
  margin-top: 3rem;
}
</style>
