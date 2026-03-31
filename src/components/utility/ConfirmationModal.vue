<template>
  <Modal :is-open="isOpen" :title="title" :size="size" @close="closeModal" @confirm="confirmAction">
    <div class="confirmation-modal">
      <Alert :type="type" :message="message" :closable="false" />
      <div v-if="details" class="confirmation-details">
        <p class="details-text">{{ details }}</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'warning',
  size: 'md',
  loading: false
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const closeModal = () => {
  emit('close');
};

const confirmAction = () => {
  emit('confirm');
};

import Modal from '@/components/common/Modal.vue';
import Alert from '@/components/common/Alert.vue';
</script>

<style scoped>
.confirmation-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirmation-details {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.details-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
