<template>
  <div class="avatar" :class="`avatar-${size}`" :style="avatarStyle" :title="name">
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  backgroundColor: '#007bff',
  color: 'white'
});

const initials = computed(() => {
  const names = props.name.split(' ').filter(n => n.length > 0);
  return names.map(n => n[0].toUpperCase()).slice(0, 2).join('');
});

const avatarStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  color: props.color
}));
</script>

<style scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  user-select: none;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.avatar-md {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.avatar-lg {
  width: 56px;
  height: 56px;
  font-size: 16px;
}
</style>
