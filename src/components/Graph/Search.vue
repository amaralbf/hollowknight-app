<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  searchText: String,
});

const emit = defineEmits(["search-input"]);

const searchText = ref(props.searchText);

let timeoutId: string | number | NodeJS.Timeout;
const emitSearch = (event: any) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    emit("search-input", event.target.value);
  }, 500);
};
</script>

<template>
  <div class="search-div">
    <label>
      Search:
      <input
        type="text"
        v-model="searchText"
        @input="emitSearch"
        class="search-input"
      />
    </label>
  </div>
</template>

<style>
.search-div {
}

.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
