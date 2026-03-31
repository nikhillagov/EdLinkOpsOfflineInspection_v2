<template>
  <div class="search-box">
    <input
      v-model="searchText"
      type="text"
      placeholder="Search..."
      class="search-input"
      @input="emitSearch"
    />
    <span class="search-icon">🔍</span>
    <button
      v-if="searchText"
      class="search-clear"
      @click="clearSearch"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string;
  debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
  debounce: 300
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [value: string];
}>();

const searchText = ref(props.modelValue);
let debounceTimer: ReturnType<typeof setTimeout>;

const emitSearch = () => {
  emit('update:modelValue', searchText.value);
  
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', searchText.value);
  }, props.debounce);
};

const clearSearch = () => {
  searchText.value = '';
  emit('update:modelValue', '');
  emit('search', '');
};
</script>

<style scoped>
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.6;
  pointer-events: none;
}

.search-clear {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  transition: color 0.2s;
}

.search-clear:hover {
  color: #333;
}
</style>
