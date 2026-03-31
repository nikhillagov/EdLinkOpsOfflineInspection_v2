<template>
  <div class="detail-actions">
    <div class="actions-group">
      <button 
        v-if="showEdit && !isEditing"
        class="btn btn-primary"
        @click="emit('edit')"
        :disabled="disabled">
        ✎ Edit
      </button>

      <button 
        v-if="showSave && isEditing"
        class="btn btn-success"
        @click="emit('save')"
        :disabled="disabled || isSaving"
        :class="{ 'is-loading': isSaving }">
        {{ isSaving ? '⏳ Saving...' : '✓ Save' }}
      </button>

      <button 
        v-if="showCancel && isEditing"
        class="btn btn-secondary"
        @click="emit('cancel')"
        :disabled="disabled || isSaving">
        ✕ Cancel
      </button>

      <button 
        v-if="showDelete"
        class="btn btn-danger"
        @click="handleDelete"
        :disabled="disabled || isSaving"
        :class="{ 'is-loading': isDeleting }">
        {{ isDeleting ? '⏳ Deleting...' : '🗑 Delete' }}
      </button>

      <button 
        v-if="showBack"
        class="btn btn-secondary"
        @click="emit('back')"
        :disabled="disabled">
        ← Back
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this {{ itemType }}?</p>
          <p class="text-muted">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteConfirm = false">Cancel</button>
          <button class="btn btn-danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isEditing: boolean;
  disabled?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
  showEdit?: boolean;
  showSave?: boolean;
  showCancel?: boolean;
  showDelete?: boolean;
  showBack?: boolean;
  itemType?: string;
}>();

const emit = defineEmits<{
  edit: [];
  save: [];
  cancel: [];
  delete: [];
  back: [];
}>();

const showDeleteConfirm = ref(false);

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = () => {
  showDeleteConfirm.value = false;
  emit('delete');
};

// Default values
const getDefault = (prop: any, defaultValue: boolean) => {
  return prop !== undefined ? prop : defaultValue;
};
</script>

<style scoped>
.detail-actions {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--bg-secondary, #f9fafb);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
}

.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary, #3b82f6);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark, #2563eb);
}

.btn-success {
  background-color: var(--success, #10b981);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: var(--success-dark, #059669);
}

.btn-danger {
  background-color: var(--danger, #ef4444);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--danger-dark, #dc2626);
}

.btn-secondary {
  background-color: var(--bg-tertiary, #e5e7eb);
  color: var(--text-primary, #1f2937);
  border: 1px solid var(--border-color, #d1d5db);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-quaternary, #d1d5db);
}

.btn.is-loading {
  opacity: 0.8;
  pointer-events: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary, #1f2937);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0.5rem 0;
  color: var(--text-secondary, #6b7280);
}

.text-muted {
  font-size: 0.875rem;
  color: var(--text-tertiary, #9ca3af);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .actions-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
