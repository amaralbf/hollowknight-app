<script setup lang="ts">
import { onMounted } from 'vue';

import initCanvas from '@/services/HKMap/app';

const emit = defineEmits(['element-click']);

const emitElementClick = (element: any) => {
  console.log('Emitting "element-click"');
  emit('element-click', element);
};

onMounted(() => {
  initCanvas(emitElementClick);
});
</script>

<template>
  <div class="canvas-wrapper">
    <div id="canvas-div"></div>
  </div>
</template>

<style>
.canvas-wrapper {
  margin: auto;
}
</style>
