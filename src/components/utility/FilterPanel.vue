<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h4 class="filter-title">Filters</h4>
      <button v-if="hasAppliedFilters" class="clear-filters" @click="clearAll">
        Clear All
      </button>
    </div>

    <div class="filter-content">
      <slot></slot>
    </div>

    <div class="filter-actions">
      <Button
        label="Apply Filters"
        variant="primary"
        size="sm"
        @click="$emit('apply')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';

interface Props {
  hasAppliedFilters?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasAppliedFilters: false
});

const emit = defineEmits<{
  apply: [];
  clear: [];
}>();

const clearAll = () => {
  emit('clear');
};
</script>

<style scoped>
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.filter-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.clear-filters {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  padding: 0;
}

.clear-filters:hover {
  color: #0056b3;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
}
</style>
