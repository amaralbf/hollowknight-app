<script setup lang="ts">
import { Ref, ref } from "vue";
import Search from "./Search.vue";
import CyGraph from "./CyGraph/CyGraph.vue";
import PreviousPath from "./PreviousPath.vue";
import Progression from "./Progression.vue";

const searchText: Ref<string> = ref("");
const isPreviousPathChecked: Ref<boolean> = ref(false);
const progressionChecked: Ref<boolean> = ref(false);
const nextOnly: Ref<boolean> = ref(false);
const progressionFile: Ref<string | undefined> = ref(undefined);

const updateSearchText = (text: string) => {
  searchText.value = text;
};
const updateHighlightPreviousPath = (checkValue: boolean) => {
  isPreviousPathChecked.value = checkValue;
};

const updateProgression = (checkValue: boolean) => {
  progressionChecked.value = checkValue;
};

const updateProgressionFile = (content: string) => {
  progressionFile.value = content;
};

const updateNextOnly = (checkValue: boolean) => {
  nextOnly.value = checkValue;
};
</script>

<template>
  <div>
    <div class="filters">
      <Search
        :searchText="searchText"
        @search-input="updateSearchText"
        class="filter"
      />
      <PreviousPath
        :isPreviousPathChecked="isPreviousPathChecked"
        @toggle-previous-path="updateHighlightPreviousPath"
        class="filter"
      />
      <Progression
        :progressionChecked="progressionChecked"
        :nextOnly="nextOnly"
        :progressionFile="progressionFile"
        @toggle-progression="updateProgression"
        @toggle-next-only="updateNextOnly"
        @progression-file-load="updateProgressionFile"
        class="filter"
      />
    </div>
    <CyGraph
      :searchText="searchText"
      :isPreviousPathChecked="isPreviousPathChecked"
      :progressionChecked="progressionChecked"
      :nextOnly="nextOnly"
      :progressionFile="progressionFile"
    />
  </div>
</template>

<style>
.filters {
  display: flex;
  align-items: center;
}

.filter {
  padding: 10px 10px;
}
</style>
