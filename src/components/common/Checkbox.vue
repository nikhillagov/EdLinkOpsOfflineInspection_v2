<template>
  <div class="checkbox-group">
    <label :for="id" class="checkbox-label">
      <input
        :id="id"
        v-model="internalValue"
        type="checkbox"
        :value="value"
        class="checkbox-input"
      />
      <span class="checkbox-custom"></span>
      <span class="checkbox-text">{{ label }}</span>
    </label>
    <span v-if="hint" class="checkbox-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  modelValue: boolean | string[];
  label: string;
  value?: string | boolean;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: true
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (val: boolean | string[]) => emit('update:modelValue', val)
});
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkbox-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  background-color: white;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #007bff;
  border-color: #007bff;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.checkbox-text {
  font-size: 14px;
  color: #333;
}

.checkbox-hint {
  font-size: 12px;
  color: #888;
  margin-left: 26px;
}
</style>
