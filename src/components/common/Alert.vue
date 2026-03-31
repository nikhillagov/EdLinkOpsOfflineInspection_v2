<template>
  <div :class="['alert', `alert-${type}`]">
    <div class="alert-content">
      <span class="alert-icon">
        {{ typeIcon }}
      </span>
      <div class="alert-message">
        <span v-if="title" class="alert-title">{{ title }}</span>
        <span class="alert-text">{{ message }}</span>
      </div>
    </div>
    <button v-if="closable" class="alert-close" @click="$emit('close')">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  closable?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: true
});

defineEmits<{
  close: [];
}>();

const typeIcon = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[computed<Props['type']>(() => '').value as keyof typeof icons] || 'ℹ';
});
</script>

<style scoped>
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.alert-icon {
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.alert-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-title {
  font-weight: 600;
}

.alert-text {
  opacity: 0.9;
}

.alert-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>
