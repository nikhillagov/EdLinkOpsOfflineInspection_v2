<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>
    <Button
      v-if="actionLabel"
      :label="actionLabel"
      variant="primary"
      size="md"
      @click="$emit('action')"
    />
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

interface Props {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
}

withDefaults(defineProps<Props>(), {
  icon: '📭',
  actionLabel: ''
});

defineEmits<{
  action: [];
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-message {
  font-size: 14px;
  color: #999;
  margin: 0 0 20px 0;
  max-width: 400px;
}
</style>
