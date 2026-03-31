<template>
  <div class="pagination">
    <Button
      label="← Prev"
      variant="secondary"
      size="sm"
      :disabled="currentPage === 1"
      @click="previousPage"
    />
    
    <div class="page-info">
      Page <span class="page-number">{{ currentPage }}</span> of
      <span class="total-pages">{{ totalPages }}</span>
    </div>
    
    <Button
      label="Next →"
      variant="secondary"
      size="sm"
      :disabled="currentPage === totalPages"
      @click="nextPage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from './Button.vue';

interface Props {
  currentPage: number;
  totalPages: number;
}

const emit = defineEmits<{
  'update:currentPage': [page: number];
}>();

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

const props = defineProps<Props>();
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
}

.page-info {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.page-number,
.total-pages {
  font-weight: 600;
  color: #333;
}
</style>
