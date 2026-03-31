<template>
  <div class="spinner-container">
    <div :class="['spinner', `spinner-${size}`, `spinner-${color}`]"></div>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: ''
});
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner-md {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-lg {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.spinner-primary {
  color: #007bff;
}

.spinner-secondary {
  color: #6c757d;
}

.spinner-white {
  color: white;
}

.spinner-text {
  margin: 0;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
