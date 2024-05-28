<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  isPreviousPathChecked: Boolean,
});

const emit = defineEmits(["toggle-previous-path"]);

const isPreviousPathChecked = ref(props.isPreviousPathChecked);

const emitHighlightPreviousPath = (event: any) => {
  emit("toggle-previous-path", event.target.checked);
};
</script>

<template>
  <div class="highlight-previous-path-div">
    <label>
      Highlight previous path:
      <input
        type="checkbox"
        v-model="isPreviousPathChecked"
        @change="emitHighlightPreviousPath"
        class="checkbox-input"
      />
    </label>
  </div>
</template>

<style>
.highlight-previous-path-div {
}

.highlight-previous-path-div label {
  vertical-align: middle;
}

.checkbox-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
