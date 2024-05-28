<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from "vue";
import { buildGraph, zoomInOnNode } from "./graph";
import {
  initProgression,
  loadProgression,
  setProgressionStatus,
  toggleNextOnly,
} from "./progression";
import cytoscape from "cytoscape";

const props = defineProps({
  searchText: String,
  isPreviousPathChecked: Boolean,
  progressionChecked: Boolean,
  nextOnly: Boolean,
  progressionFile: String,
});

let cy: cytoscape.Core;

const handleSearchTextChange = (newText: string) => {
  zoomInOnNode(
    cy,
    newText,
    props.isPreviousPathChecked.valueOf(),
    props.progressionChecked,
  );
};

const handlePreviousPathChange = (isChecked: boolean) => {
  zoomInOnNode(
    cy,
    // @ts-expect-error
    props.searchText.valueOf(),
    isChecked,
    props.progressionChecked,
  );
};

const handleProgressionChange = (isChecked: boolean) => {
  setProgressionStatus(isChecked);
};

const handleNextOnlyChange = (isChecked: boolean) => {
  if (props.progressionChecked) {
    toggleNextOnly(cy, isChecked);
  } else {
    toggleNextOnly(cy, false);
  }
};

const handleProgressionFileChange = (content: string | undefined) => {
  loadProgression(content);
};

onMounted(() => {
  cy = buildGraph();

  initProgression(cy);
  // @ts-ignore
  watch(() => props.searchText, handleSearchTextChange);
  watch(() => props.isPreviousPathChecked, handlePreviousPathChange);
  watch(() => props.progressionChecked, handleProgressionChange);
  watch(() => props.nextOnly, handleNextOnlyChange);
  watch(() => props.progressionFile, handleProgressionFileChange);
});

onBeforeUnmount(() => {
  if (cy) {
    cy.destroy();
  }
});
</script>

<template>
  <div id="cy"></div>
</template>

<style scoped>
#cy {
  margin: auto;
  width: 1700px;
  height: 780px;
  display: block;
  border-radius: 10px;
  background-color: #e9e9e9;
  box-shadow: -0px 0px 15px #ddd;
}
</style>
