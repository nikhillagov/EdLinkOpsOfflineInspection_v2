<template>
  <form @submit.prevent="submitForm" class="entity-form">
    <!-- Basic Information -->
    <div class="form-section">
      <h3 class="section-title">Basic Information</h3>

      <div class="form-group">
        <label for="name" class="form-label">Entity Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ 'is-invalid': errors.name }"
          placeholder="Enter entity name"
          required
          @blur="validateField('name')" />
        <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="entityType" class="form-label">Entity Type *</label>
        <select
          id="entityType"
          v-model="formData.entityType"
          class="form-input"
          :class="{ 'is-invalid': errors.entityType }"
          @change="validateField('entityType')">
          <option value="">Select entity type</option>
          <option value="facility">Facility</option>
          <option value="organization">Organization</option>
          <option value="other">Other</option>
        </select>
        <span v-if="errors.entityType" class="form-error">{{ errors.entityType }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="licenseNumber" class="form-label">License Number</label>
          <input
            id="licenseNumber"
            v-model="formData.licenseNumber"
            type="text"
            class="form-input"
            placeholder="License number" />
        </div>

        <div class="form-group">
          <label for="status" class="form-label">Status</label>
          <select
            id="status"
            v-model="formData.status"
            class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Address Information -->
    <div class="form-section">
      <h3 class="section-title">Address Information</h3>

      <div class="form-group">
        <label for="city" class="form-label">City</label>
        <input
          id="city"
          v-model="formData.physicalAddressCity"
          type="text"
          class="form-input"
          placeholder="City" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="parish" class="form-label">Parish</label>
          <input
            id="parish"
            v-model="formData.parish"
            type="text"
            class="form-input"
            placeholder="Parish" />
        </div>

        <div class="form-group">
          <label for="zip" class="form-label">ZIP Code</label>
          <input
            id="zip"
            v-model="formData.zip"
            type="text"
            class="form-input"
            placeholder="ZIP code" />
        </div>
      </div>

      <div class="form-group">
        <label for="address" class="form-label">Street Address</label>
        <input
          id="address"
          v-model="formData.address"
          type="text"
          class="form-input"
          placeholder="Street address" />
      </div>
    </div>

    <!-- Contact Information -->
    <div class="form-section">
      <h3 class="section-title">Contact Information</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="form-input"
            placeholder="Phone number" />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="Email address" />
        </div>
      </div>

      <div class="form-group">
        <label for="contactPerson" class="form-label">Contact Person</label>
        <input
          id="contactPerson"
          v-model="formData.contactPerson"
          type="text"
          class="form-input"
          placeholder="Contact person name" />
      </div>
    </div>

    <!-- Notes -->
    <div class="form-section">
      <h3 class="section-title">Additional Information</h3>

      <div class="form-group">
        <label for="notes" class="form-label">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          class="form-textarea"
          placeholder="Enter any additional notes"
          rows="4" />
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
import type { EntityModel } from '@/models/entity/entity.model';

const props = defineProps<{
  entity?: Partial<EntityModel>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<EntityModel>];
  cancel: [];
}>();

const formData = ref<Partial<EntityModel>>({
  name: '',
  entityType: '',
  licenseNumber: '',
  status: 'active',
  physicalAddressCity: '',
  parish: '',
  zip: '',
  address: '',
  phone: '',
  email: '',
  contactPerson: '',
  notes: ''
});

const errors = ref<Record<string, string>>({});

// Watch for external entity prop changes
watch(() => props.entity, (newEntity) => {
  if (newEntity) {
    formData.value = { ...newEntity };
  }
}, { immediate: true, deep: true });

const validateField = (fieldName: string) => {
  const field = fieldName as keyof typeof formData.value;
  const value = formData.value[field];

  errors.value[fieldName] = '';

  if (fieldName === 'name' && !value) {
    errors.value.name = 'Entity name is required';
  } else if (fieldName === 'entityType' && !value) {
    errors.value.entityType = 'Entity type is required';
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.name) {
    errors.value.name = 'Entity name is required';
  }
  if (!formData.value.entityType) {
    errors.value.entityType = 'Entity type is required';
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
.entity-form {
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
