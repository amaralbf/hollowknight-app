<script setup lang="ts">
import { ref } from 'vue';
import { downloadProgression } from './CyGraph/progression';

const props = defineProps({
  progressionChecked: Boolean,
  nextOnly: Boolean,
  progressionFile: String,
});

const emit = defineEmits(['toggle-progression', 'toggle-next-only', 'progression-file-load']);

const progressionChecked = ref(props.progressionChecked);
const nextOnly = ref(props.nextOnly);
const progressionFile = ref(props.progressionFile);

const emitProgressionToggle = (event: any) => {
  emit('toggle-progression', event.target.checked);
};

const handleDownloadClick = () => {
  downloadProgression();
  //   progressionChecked.value = false;
  //   emit("toggle-progression", false);
};

const openFilePicker = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json'; // specify accepted file types if needed
  input.onchange = (event) => {
    //@ts-expect-error
    const file = event.target?.files?.[0];
    if (file) {
      readFileContent(file);
    }
  };
  input.click();
};

const readFileContent = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target) {
      progressionFile.value = e.target.result as string;
      emit('progression-file-load', progressionFile.value);
    }
  };
  reader.readAsText(file);
};

const emitNextOnlyToggle = (event: any) => {
  console.log('Emit toggle-next-only', event.target.checked);
  emit('toggle-next-only', event.target.checked);
};
</script>

<template>
  <div class="checkbox-container">
    <div>
      <label>
        Track progression:
        <input
          type="checkbox"
          v-model="progressionChecked"
          @change="emitProgressionToggle"
          class="checkbox-input"
        />
      </label>
    </div>
    <div class="next-only-container">
      <label>
        Show next only:
        <input
          type="checkbox"
          v-model="nextOnly"
          @change="emitNextOnlyToggle"
          class="checkbox-input"
        />
      </label>
    </div>

    <div class="file-container">
      <v-btn @click="openFilePicker">Load Progression</v-btn>
      <v-btn @click="handleDownloadClick">Save Progression</v-btn>
    </div>
  </div>
</template>

<style>
.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-container label {
  vertical-align: middle;
}

.file-container,
.next-only-container {
  padding-left: 10px;
}

.file-container button {
  /* display: block; */
  margin: 3px;
}

.checkbox-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
