<script setup lang="ts">
import { onMounted, ref } from 'vue';

import initCanvas from '@/services/HKMap/app';

const emit = defineEmits(['element-click']);
const emitElementClick = (element: any) => {
  emit('element-click', element);
};

const canvasDiv = ref<HTMLElement | null>(null);

onMounted(() => {
  const width = canvasDiv.value?.clientWidth;
  initCanvas(emitElementClick, width);
});
</script>

<template>
  <div class="map-div">
    <div id="canvas-div" ref="canvasDiv"></div>
  </div>
</template>

<style scoped>
.map-div {
  width: 75%;
}
</style>
