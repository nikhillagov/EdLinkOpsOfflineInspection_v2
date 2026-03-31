<template>
  <div class="two-column-layout">
    <div class="left-column">
      <slot name="left" />
    </div>
    <div class="right-column">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  leftWidth?: string;
  rightWidth?: string;
  gap?: string;
}

withDefaults(defineProps<Props>(), {
  leftWidth: 'auto',
  rightWidth: 'auto',
  gap: '24px'
});
</script>

<style scoped>
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: v-bind(gap);
  width: 100%;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}
</style>
