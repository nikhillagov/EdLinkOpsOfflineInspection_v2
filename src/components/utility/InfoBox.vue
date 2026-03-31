<template>
  <div class="info-box" :class="`info-box-${variant}`">
    <div class="info-icon">{{ icon }}</div>
    <div class="info-content">
      <h4 v-if="title" class="info-title">{{ title }}</h4>
      <p class="info-message">{{ message }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  icon: 'ℹ'
});
</script>

<style scoped>
.info-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 4px;
  border-left: 4px solid;
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.info-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.info-box-info {
  background-color: #d1ecf1;
  border-left-color: #17a2b8;
  color: #0c5460;
}

.info-box-success {
  background-color: #d4edda;
  border-left-color: #28a745;
  color: #155724;
}

.info-box-warning {
  background-color: #fff3cd;
  border-left-color: #ffc107;
  color: #856404;
}

.info-box-error {
  background-color: #f8d7da;
  border-left-color: #dc3545;
  color: #721c24;
}
</style>
