<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="file-upload">
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="file-input"
        @change="handleFileSelect"
      />
      <div class="file-upload-area">
        <span class="upload-icon">📤</span>
        <p class="upload-text">
          Drag and drop your files here or
          <button type="button" class="upload-link" @click="fileInput?.click()">
            click to select
          </button>
        </p>
        <p class="upload-hint">{{ hint }}</p>
      </div>
      <div v-if="files.length > 0" class="file-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
          <span class="file-name">📄 {{ file.name }}</span>
          <button
            type="button"
            class="file-remove"
            @click="removeFile(index)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  label?: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  hint: 'Maximum file size: 10MB',
  multiple: true,
  accept: '*/*',
  required: false
});

const emit = defineEmits<{
  files: [files: File[]];
}>();

const fileInput = ref<HTMLInputElement>();
const files = ref<File[]>([]);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    files.value = files.value.concat(newFiles);
    emit('files', files.value);
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit('files', files.value);
};
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #dc3545;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #007bff;
  border-radius: 4px;
  padding: 30px;
  text-align: center;
  background-color: #f8f9ff;
  cursor: pointer;
  transition: all 0.2s;
}

.file-upload-area:hover {
  border-color: #0056b3;
  background-color: #f0f4ff;
}

.upload-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.upload-text {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.upload-link {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
}

.upload-link:hover {
  color: #0056b3;
}

.upload-hint {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #999;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

.file-name {
  color: #333;
}

.file-remove {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
}

.file-remove:hover {
  color: #dc3545;
}
</style>
