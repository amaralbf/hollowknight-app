<script setup lang="ts">
// defineProps<{
//   elem: {
//     image?: string;
//     name: string;
//     type: string;
//     dependencies: string;
//   };
// }>();
</script>

<template>
  <div class="elem-card">
    <!-- <div v-if="elem.image" class="elem-image-wrapper">
      <img :src="elem.image" alt="Record image" class="elem-image" />
    </div> -->

    <div class="elem-content">
      <h2 class="elem-name">{ elem.name }</h2>
      <p class="elem-type">{ elem.type }</p>

      <div class="elem-section">
        <h3>Dependencies</h3>
        <div class="elem-dependencies">{ elem.dependencies }</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elem-card {
  width: 23%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: #222;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.elem-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.elem-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.elem-content {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.elem-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #222;
}

.elem-type {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.elem-section {
  margin-top: 0.5rem;
}

.elem-section h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  color: #444;
}

.elem-dependencies {
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 0.75rem;
  white-space: pre-wrap;
  color: #333;
  font-size: 0.95rem;
}
</style>
