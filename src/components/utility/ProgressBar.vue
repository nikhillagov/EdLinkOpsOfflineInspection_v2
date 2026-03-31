<template>
  <div class="progress-bar-wrapper">
    <div v-if="label" class="progress-label">
      <span class="label-text">{{ label }}</span>
      <span class="label-value" v-if="showValue">{{ modelValue }}%</span>
    </div>
    <div class="progress-container">
      <div
        class="progress-bar"
        :class="`progress-${variant}`"
        :style="{ width: modelValue + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
  label?: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  showValue?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'success',
  showValue: true
});
</script>

<style scoped>
.progress-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.label-text {
  flex: 1;
}

.label-value {
  color: #666;
}

.progress-container {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-success {
  background-color: #28a745;
}

.progress-warning {
  background-color: #ffc107;
}

.progress-danger {
  background-color: #dc3545;
}

.progress-info {
  background-color: #007bff;
}
</style>
