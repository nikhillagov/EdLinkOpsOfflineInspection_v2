<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-fields">
        <slot></slot>
      </div>

      <div v-if="errorMessage" class="form-error-message">
        <Alert type="error" :message="errorMessage" @close="clearError" />
      </div>

      <div class="form-actions">
        <Button
          label="Cancel"
          variant="secondary"
          size="md"
          @click="$emit('cancel')"
        />
        <Button
          :label="submitLabel"
          variant="primary"
          size="md"
          :loading="loading"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/common/Button.vue';
import Alert from '@/components/common/Alert.vue';

interface Props {
  submitLabel?: string;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  submitLabel: 'Submit',
  loading: false
});

const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

const errorMessage = ref<string>('');

const handleSubmit = () => {
  clearError();
  emit('submit');
};

const clearError = () => {
  errorMessage.value = '';
};

const setError = (message: string) => {
  errorMessage.value = message;
};

defineExpose({
  setError,
  clearError
});
</script>

<style scoped>
.form-wrapper {
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-error-message {
  margin: 12px 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}
</style>
