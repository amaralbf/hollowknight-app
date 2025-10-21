<script setup lang="ts">
import MapCanvas from '@/components/MapCanvas.vue';
import InfoPanel from '@/components/InfoPanel.vue';
import NavBar from '@/components/NavBar.vue';

import { ref, type Ref } from 'vue';

const hoveredElement: Ref<string | null> = ref(null);

function handleHover(elem: any) {
  hoveredElement.value = elem;
}
</script>

<template>
  <NavBar />
  <div class="main-div">
    <MapCanvas />
    <InfoPanel />
  </div>
</template>

<style scoped>
.main-div {
  width: 100%;
  display: inline-flex;
  justify-content: space-evenly;
  margin-top: 1rem;
}
</style>
