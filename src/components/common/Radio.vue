<template>
  <div class="radio-group">
    <label :for="id" class="radio-label">
      <input
        :id="id"
        v-model="internalValue"
        type="radio"
        :value="value"
        class="radio-input"
      />
      <span class="radio-custom"></span>
      <span class="radio-text">{{ label }}</span>
    </label>
    <span v-if="hint" class="radio-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  modelValue: string | boolean;
  label: string;
  value: string | boolean;
  hint?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (val: string | boolean) => emit('update:modelValue', val)
});
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.radio-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background-color: white;
  transition: all 0.2s;
  flex-shrink: 0;
}

.radio-input:checked + .radio-custom {
  background-color: #007bff;
  border-color: #007bff;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
}

.radio-input:focus + .radio-custom {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.radio-text {
  font-size: 14px;
  color: #333;
}

.radio-hint {
  font-size: 12px;
  color: #888;
  margin-left: 26px;
}
</style>
