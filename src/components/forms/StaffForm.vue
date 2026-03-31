<template>
  <form @submit.prevent="submitForm" class="staff-form">
    <!-- Personal Information -->
    <div class="form-section">
      <h3 class="section-title">Personal Information</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="firstName" class="form-label">First Name *</label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            class="form-input"
            :class="{ 'is-invalid': errors.firstName }"
            placeholder="First name"
            required
            @blur="validateField('firstName')" />
          <span v-if="errors.firstName" class="form-error">{{ errors.firstName }}</span>
        </div>

        <div class="form-group">
          <label for="lastName" class="form-label">Last Name *</label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            class="form-input"
            :class="{ 'is-invalid': errors.lastName }"
            placeholder="Last name"
            required
            @blur="validateField('lastName')" />
          <span v-if="errors.lastName" class="form-error">{{ errors.lastName }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ 'is-invalid': errors.email }"
          placeholder="Email address"
          required
          @blur="validateField('email')" />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

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
          <label for="dateOfBirth" class="form-label">Date of Birth</label>
          <input
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            type="date"
            class="form-input" />
        </div>
      </div>
    </div>

    <!-- Employment Information -->
    <div class="form-section">
      <h3 class="section-title">Employment Information</h3>

      <div class="form-group">
        <label for="position" class="form-label">Position/Title *</label>
        <input
          id="position"
          v-model="formData.position"
          type="text"
          class="form-input"
          :class="{ 'is-invalid': errors.position }"
          placeholder="Job position/title"
          required
          @blur="validateField('position')" />
        <span v-if="errors.position" class="form-error">{{ errors.position }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="department" class="form-label">Department</label>
          <input
            id="department"
            v-model="formData.department"
            type="text"
            class="form-input"
            placeholder="Department" />
        </div>

        <div class="form-group">
          <label for="status" class="form-label">Employment Status</label>
          <select
            id="status"
            v-model="formData.status"
            class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate" class="form-label">Start Date</label>
          <input
            id="startDate"
            v-model="formData.startDate"
            type="date"
            class="form-input" />
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Role/Permission Level</label>
          <select
            id="role"
            v-model="formData.role"
            class="form-input">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrator</option>
            <option value="inspector">Inspector</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Identification -->
    <div class="form-section">
      <h3 class="section-title">Identification</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="badgeNumber" class="form-label">Badge/ID Number</label>
          <input
            id="badgeNumber"
            v-model="formData.badgeNumber"
            type="text"
            class="form-input"
            placeholder="Badge or ID number" />
        </div>

        <div class="form-group">
          <label for="ssn" class="form-label">SSN (Last 4 Digits)</label>
          <input
            id="ssn"
            v-model="formData.ssn"
            type="password"
            class="form-input"
            placeholder="Last 4 digits of SSN"
            maxlength="4" />
        </div>
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
          placeholder="Additional notes about this staff member"
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

interface StaffModel {
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  position: string;
  department?: string;
  status: string;
  startDate?: string;
  role?: string;
  badgeNumber?: string;
  ssn?: string;
  notes?: string;
}

const props = defineProps<{
  staff?: Partial<StaffModel>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<StaffModel>];
  cancel: [];
}>();

const formData = ref<Partial<StaffModel>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  position: '',
  department: '',
  status: 'active',
  startDate: '',
  role: 'viewer',
  badgeNumber: '',
  ssn: '',
  notes: ''
});

const errors = ref<Record<string, string>>({});

watch(() => props.staff, (newStaff) => {
  if (newStaff) {
    formData.value = { ...newStaff };
  }
}, { immediate: true, deep: true });

const validateField = (fieldName: string) => {
  const field = fieldName as keyof typeof formData.value;
  const value = formData.value[field];

  errors.value[fieldName] = '';

  if (fieldName === 'firstName' && !value) {
    errors.value.firstName = 'First name is required';
  } else if (fieldName === 'lastName' && !value) {
    errors.value.lastName = 'Last name is required';
  } else if (fieldName === 'email') {
    if (!value) {
      errors.value.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      errors.value.email = 'Please enter a valid email address';
    }
  } else if (fieldName === 'position' && !value) {
    errors.value.position = 'Position is required';
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.firstName) {
    errors.value.firstName = 'First name is required';
  }
  if (!formData.value.lastName) {
    errors.value.lastName = 'Last name is required';
  }
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
  }
  if (!formData.value.position) {
    errors.value.position = 'Position is required';
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
.staff-form {
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
