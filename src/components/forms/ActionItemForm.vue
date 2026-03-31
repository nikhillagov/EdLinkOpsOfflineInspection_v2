<template>
  <form @submit.prevent="submitForm" class="action-item-form">
    <!-- Action Item Information -->
    <div class="form-section">
      <h3 class="section-title">Action Item Details</h3>

      <div class="form-group">
        <label for="typeId" class="form-label">Action Item Type *</label>
        <select
          id="typeId"
          v-model="formData.typeId"
          class="form-input"
          :class="{ 'is-invalid': errors.typeId }"
          @change="validateField('typeId')">
          <option value="">Select action item type</option>
          <option value="1">Correction Required</option>
          <option value="2">Documentation</option>
          <option value="3">Staff Training</option>
          <option value="4">Equipment Upgrade</option>
          <option value="5">Policy Review</option>
          <option value="6">Other</option>
        </select>
        <span v-if="errors.typeId" class="form-error">{{ errors.typeId }}</span>
      </div>

      <div class="form-group">
        <label for="status" class="form-label">Status *</label>
        <select
          id="status"
          v-model="formData.status"
          class="form-input"
          @change="validateField('status')">
          <option value="0">Pending</option>
          <option value="1">In Progress</option>
          <option value="2">Completed</option>
          <option value="3">Deferred</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">Priority</label>
        <select
          id="priority"
          v-model="formData.priority"
          class="form-input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <!-- Timeline -->
    <div class="form-section">
      <h3 class="section-title">Timeline</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="dueDate" class="form-label">Due Date</label>
          <input
            id="dueDate"
            v-model="formData.dueDate"
            type="date"
            class="form-input" />
        </div>

        <div class="form-group">
          <label for="completedDate" class="form-label">Completed Date</label>
          <input
            id="completedDate"
            v-model="formData.completedDate"
            type="date"
            class="form-input" />
        </div>
      </div>
    </div>

    <!-- Assignment -->
    <div class="form-section">
      <h3 class="section-title">Assignment</h3>

      <div class="form-group">
        <label for="assignedTo" class="form-label">Assigned To</label>
        <input
          id="assignedTo"
          v-model="formData.assignedTo"
          type="text"
          class="form-input"
          placeholder="Name of assigned person" />
      </div>

      <div class="form-group">
        <label for="department" class="form-label">Department</label>
        <input
          id="department"
          v-model="formData.department"
          type="text"
          class="form-input"
          placeholder="Department responsible" />
      </div>
    </div>

    <!-- Description & Notes -->
    <div class="form-section">
      <h3 class="section-title">Details</h3>

      <div class="form-group">
        <label for="description" class="form-label">Description *</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-textarea"
          :class="{ 'is-invalid': errors.description }"
          placeholder="Detailed description of the action item"
          rows="5"
          required
          @blur="validateField('description')" />
        <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="foundingBasis" class="form-label">Founding Basis / Reference</label>
        <textarea
          id="foundingBasis"
          v-model="formData.foundingBasis"
          class="form-textarea"
          placeholder="Reference to regulations, standards, or findings"
          rows="3" />
      </div>

      <div class="form-group">
        <label for="notes" class="form-label">Internal Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          class="form-textarea"
          placeholder="Internal notes about progress and updates"
          rows="3" />
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface ActionItemModel {
  id?: number | string;
  typeId: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  department?: string;
  description: string;
  foundingBasis?: string;
  notes?: string;
}

const props = defineProps<{
  action?: Partial<ActionItemModel>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<ActionItemModel>];
  cancel: [];
}>();

const formData = ref<Partial<ActionItemModel>>({
  typeId: '',
  status: '0',
  priority: 'medium',
  dueDate: '',
  completedDate: '',
  assignedTo: '',
  department: '',
  description: '',
  foundingBasis: '',
  notes: ''
});

const errors = ref<Record<string, string>>({});

watch(() => props.action, (newAction) => {
  if (newAction) {
    formData.value = { ...newAction };
  }
}, { immediate: true, deep: true });

const validateField = (fieldName: string) => {
  const field = fieldName as keyof typeof formData.value;
  const value = formData.value[field];

  errors.value[fieldName] = '';

  if (fieldName === 'typeId' && !value) {
    errors.value.typeId = 'Action item type is required';
  } else if (fieldName === 'description' && !value) {
    errors.value.description = 'Description is required';
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.typeId) {
    errors.value.typeId = 'Action item type is required';
  }
  if (!formData.value.description) {
    errors.value.description = 'Description is required';
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  emit('submit', formData.value);
};
</script>

<style scoped>
.action-item-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  padding: 1.5rem;
  background-color: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #1f2937);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: var(--text-primary, #1f2937);
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.is-invalid,
.form-textarea.is-invalid {
  border-color: var(--danger, #ef4444);
}

.form-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--danger, #ef4444);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-textarea {
  font-family: inherit;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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

.btn-secondary {
  background-color: var(--bg-tertiary, #e5e7eb);
  color: var(--text-primary, #1f2937);
  border: 1px solid var(--border-color, #d1d5db);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-quaternary, #d1d5db);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
