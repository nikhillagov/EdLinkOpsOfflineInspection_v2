<template>
  <form @submit.prevent="submitForm" class="license-form">
    <!-- License Information -->
    <div class="form-section">
      <h3 class="section-title">License Information</h3>

      <div class="form-group">
        <label for="licenseNumber" class="form-label">License Number *</label>
        <input
          id="licenseNumber"
          v-model="formData.licenseNumber"
          type="text"
          class="form-input"
          :class="{ 'is-invalid': errors.licenseNumber }"
          placeholder="Enter license number"
          required
          @blur="validateField('licenseNumber')" />
        <span v-if="errors.licenseNumber" class="form-error">{{ errors.licenseNumber }}</span>
      </div>

      <div class="form-group">
        <label for="licenseType" class="form-label">License Type *</label>
        <select
          id="licenseType"
          v-model="formData.licenseType"
          class="form-input"
          :class="{ 'is-invalid': errors.licenseType }"
          @change="validateField('licenseType')">
          <option value="">Select license type</option>
          <option value="general">General License</option>
          <option value="specialization">Specialization License</option>
          <option value="credential">Credential</option>
          <option value="certification">Certification</option>
        </select>
        <span v-if="errors.licenseType" class="form-error">{{ errors.licenseType }}</span>
      </div>

      <div class="form-group">
        <label for="status" class="form-label">Status *</label>
        <select
          id="status"
          v-model="formData.status"
          class="form-input"
          @change="validateField('status')">
          <option value="valid">Valid</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
          <option value="revoked">Revoked</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Dates -->
    <div class="form-section">
      <h3 class="section-title">Dates</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="effectiveDate" class="form-label">Effective Date *</label>
          <input
            id="effectiveDate"
            v-model="formData.effectiveDate"
            type="date"
            class="form-input"
            :class="{ 'is-invalid': errors.effectiveDate }"
            required
            @change="validateField('effectiveDate')" />
          <span v-if="errors.effectiveDate" class="form-error">{{ errors.effectiveDate }}</span>
        </div>

        <div class="form-group">
          <label for="expirationDate" class="form-label">Expiration Date *</label>
          <input
            id="expirationDate"
            v-model="formData.expirationDate"
            type="date"
            class="form-input"
            :class="{ 'is-invalid': errors.expirationDate }"
            required
            @change="validateField('expirationDate')" />
          <span v-if="errors.expirationDate" class="form-error">{{ errors.expirationDate }}</span>
        </div>
      </div>
    </div>

    <!-- Holder Information -->
    <div class="form-section">
      <h3 class="section-title">Holder Information</h3>

      <div class="form-group">
        <label for="holderName" class="form-label">Holder Name</label>
        <input
          id="holderName"
          v-model="formData.holderName"
          type="text"
          class="form-input"
          placeholder="Full name of license holder" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="holderEmail" class="form-label">Email</label>
          <input
            id="holderEmail"
            v-model="formData.holderEmail"
            type="email"
            class="form-input"
            placeholder="Email address" />
        </div>

        <div class="form-group">
          <label for="holderPhone" class="form-label">Phone</label>
          <input
            id="holderPhone"
            v-model="formData.holderPhone"
            type="tel"
            class="form-input"
            placeholder="Phone number" />
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="form-section">
      <h3 class="section-title">Additional Information</h3>

      <div class="form-group">
        <label for="issuingAuthority" class="form-label">Issuing Authority</label>
        <input
          id="issuingAuthority"
          v-model="formData.issuingAuthority"
          type="text"
          class="form-input"
          placeholder="Authority that issued the license" />
      </div>

      <div class="form-group">
        <label for="notes" class="form-label">Notes</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          class="form-textarea"
          placeholder="Additional notes about this license"
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

interface LicenseModel {
  id?: number | string;
  licenseNumber: string;
  licenseType: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  holderName?: string;
  holderEmail?: string;
  holderPhone?: string;
  issuingAuthority?: string;
  notes?: string;
}

const props = defineProps<{
  license?: Partial<LicenseModel>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<LicenseModel>];
  cancel: [];
}>();

const formData = ref<Partial<LicenseModel>>({
  licenseNumber: '',
  licenseType: '',
  status: 'valid',
  effectiveDate: '',
  expirationDate: '',
  holderName: '',
  holderEmail: '',
  holderPhone: '',
  issuingAuthority: '',
  notes: ''
});

const errors = ref<Record<string, string>>({});

watch(() => props.license, (newLicense) => {
  if (newLicense) {
    formData.value = { ...newLicense };
  }
}, { immediate: true, deep: true });

const validateField = (fieldName: string) => {
  const field = fieldName as keyof typeof formData.value;
  const value = formData.value[field];

  errors.value[fieldName] = '';

  if (fieldName === 'licenseNumber' && !value) {
    errors.value.licenseNumber = 'License number is required';
  } else if (fieldName === 'licenseType' && !value) {
    errors.value.licenseType = 'License type is required';
  } else if (fieldName === 'effectiveDate' && !value) {
    errors.value.effectiveDate = 'Effective date is required';
  } else if (fieldName === 'expirationDate' && !value) {
    errors.value.expirationDate = 'Expiration date is required';
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.licenseNumber) {
    errors.value.licenseNumber = 'License number is required';
  }
  if (!formData.value.licenseType) {
    errors.value.licenseType = 'License type is required';
  }
  if (!formData.value.effectiveDate) {
    errors.value.effectiveDate = 'Effective date is required';
  }
  if (!formData.value.expirationDate) {
    errors.value.expirationDate = 'Expiration date is required';
  }

  // Validate date order
  if (formData.value.effectiveDate && formData.value.expirationDate) {
    const effectiveDate = new Date(formData.value.effectiveDate);
    const expirationDate = new Date(formData.value.expirationDate);
    if (expirationDate <= effectiveDate) {
      errors.value.expirationDate = 'Expiration date must be after effective date';
    }
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
.license-form {
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
