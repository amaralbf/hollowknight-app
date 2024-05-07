<script setup lang="ts">
import { onMounted } from "vue";
import { initCanvas } from "./pixi.ts";

onMounted(() => {
  initCanvas();
});
</script>

<template>
  <div id="pixijs-canvas"></div>
</template>

<style scoped></style>
