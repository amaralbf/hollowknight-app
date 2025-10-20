<script setup lang="ts">
import HKMap from '@/components/HKMap.vue';
import InfoPanel from '@/components/InfoPanel.vue';
</script>

<template>
  <div class="main-div">
    <HKMap />
    <InfoPanel />
  </div>
</template>

<style scoped>
.main-div {
  width: 100%;
  display: inline-flex;
  justify-content: space-evenly;
  margin-top: 1rem;
  /* margin-left: 0.5rem; */
}
</style>
