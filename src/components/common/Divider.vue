<template>
  <div class="divider" :class="`divider-${variant}`"></div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'dashed' | 'dotted';
}

withDefaults(defineProps<Props>(), {
  variant: 'solid'
});
</script>

<style scoped>
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 12px 0;
}

.divider-solid {
  border-style: solid;
}

.divider-dashed {
  border-top: 1px dashed #e0e0e0;
  background: none;
}

.divider-dotted {
  border-top: 1px dotted #e0e0e0;
  background: none;
}
</style>
