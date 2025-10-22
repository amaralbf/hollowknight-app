<script setup lang="ts">
import type { MapElement } from '@/services/Elements/element';

defineProps<{
  element: MapElement | null;
}>();
</script>

<template>
  <div class="elem-card">
    <div class="name-div">
      <h1 class="elem-name">{{ element ? element.name : '' }}</h1>
    </div>

    <div class="elem-image-wrapper">
      <img
        v-if="element && element.imgUrl"
        :src="element.imgUrl"
        alt="Element icon"
        class="elem-image"
      />
    </div>

    <div class="field-section">
      <div class="field-row">
        <div>Type</div>
        <div>{{ element ? element.type : '' }}</div>
      </div>
      <div class="field-row">
        <div>Location</div>
        <div>{{ element ? element.location : '' }}</div>
      </div>
    </div>

    <div class="field-section">
      <div class="field-row">
        <div>Requires</div>
        <!-- <div>{{ element ? element.location : '' }}</div> -->
      </div>
    </div>

    <!-- <h2 class="elem-name">The Knight</h2> -->

    <!-- <h2 class="elem-name">{{ element.name }}</h2> -->

    <!-- </div> -->

    <!-- <div class="elem-content"> -->
    <!-- <div v-if="element.image" class="elem-image-wrapper">
      <img :src="element.image" alt="Record image" class="elem-image" />
    </div> -->

    <!-- <p class="elem-type">{{ element ? element.type : '' }}</p>

      <div class="elem-section">
        <h3>Dependencies</h3>
        <div class="elem-requires">{{ element ? element.requires : '' }}</div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.elem-card {
  width: 23%;
  display: flex;
  flex-direction: column;
  background-color: #222;
  /* font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; */
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.field-section {
  border-bottom-style: solid;
  border-bottom-color: #fff;
  border-bottom-width: 1px;
  border-image-slice: 47% 0%;
  border-image-source: linear-gradient(to right, #fff0, #fff, #fff0);
  border-image-width: 1;
  border-top-style: none;

  padding-bottom: 10px;
}

.field-row {
  display: flex;
  padding: 10px 10px 0;
}

.field-row div:nth-child(odd) {
  font-family: 'Trajan Pro Regular';
  width: 6.5rem;
  padding-top: 4px;
  text-align: right;
  padding-right: 1rem;
  font-size: 15px;
}

.field-row div:nth-child(even) {
  font-size: 16px;
  color: #ddd;
  /* letter-spacing: ; */
}

.elem-image-wrapper {
  padding: 1rem;
  /* height: 500px; */
  /* padding-top: 1rem; */
  /* overflow: hidden; */
}

.elem-image {
  display: block;
  height: 150px;
  margin: 0 auto;
  /* height: 100%; */
  object-fit: cover;
}

.elem-content {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.name-div {
  background-color: #000;
}

.elem-name {
  font-family: 'Trajan Pro Regular';
  margin: 0;
  font-size: 1.25rem;
  font-weight: normal;
  color: #fff;
  text-align: center;
  padding: 0.5rem 0 0.25rem;
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

.elem-requires {
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 0.75rem;
  white-space: pre-wrap;
  color: #333;
  font-size: 0.95rem;
}
</style>
