<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="multiselect-container">
      <div class="multiselect-input">
        <div class="selected-items">
          <span
            v-for="item in selectedItems"
            :key="item.value"
            class="selected-tag"
          >
            {{ item.label }}
            <button
              type="button"
              class="tag-remove"
              @click="removeItem(item.value)"
            >
              ×
            </button>
          </span>
        </div>
        <input
          v-model="searchText"
          type="text"
          :placeholder="selectedItems.length === 0 ? placeholder : ''"
          class="multiselect-search"
          @click="isOpen = true"
        />
      </div>
      <div v-if="isOpen" class="multiselect-dropdown">
        <div
          v-for="item in filteredOptions"
          :key="item.value"
          :class="['multiselect-option', {
            'multiselect-option-selected': isSelected(item.value)
          }]"
          @click="toggleItem(item)"
        >
          <input
            type="checkbox"
            :checked="isSelected(item.value)"
            class="option-checkbox"
          />
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: (string | number)[];
  label?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items...',
  required: false
});

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]];
}>();

const isOpen = ref(false);
const searchText = ref('');

const selectedItems = computed(() =>
  props.options.filter(opt => props.modelValue.includes(opt.value))
);

const filteredOptions = computed(() =>
  props.options.filter(opt =>
    opt.label.toLowerCase().includes(searchText.value.toLowerCase())
  )
);

const isSelected = (value: string | number) =>
  props.modelValue.includes(value);

const toggleItem = (item: Option) => {
  const newValue = isSelected(item.value)
    ? props.modelValue.filter(v => v !== item.value)
    : [...props.modelValue, item.value];
  emit('update:modelValue', newValue);
};

const removeItem = (value: string | number) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== value));
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

.multiselect-container {
  position: relative;
}

.multiselect-input {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 36px;
  background-color: white;
}

.multiselect-input:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.tag-remove {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  color: #999;
}

.tag-remove:hover {
  color: #333;
}

.multiselect-search {
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  min-width: 100px;
  font-family: inherit;
}

.multiselect-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.multiselect-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.multiselect-option:hover {
  background-color: #f5f5f5;
}

.multiselect-option-selected {
  background-color: #e9ecef;
}

.option-checkbox {
  cursor: pointer;
}
</style>
