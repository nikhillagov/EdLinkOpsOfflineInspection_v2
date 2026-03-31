<template>
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-sm {
  padding: 2px 8px;
  font-size: 11px;
}

.badge-md {
  padding: 4px 12px;
  font-size: 12px;
}

.badge-lg {
  padding: 6px 16px;
  font-size: 13px;
}

.badge-primary {
  background-color: #007bff;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #333;
}

.badge-info {
  background-color: #17a2b8;
  color: white;
}
</style>
