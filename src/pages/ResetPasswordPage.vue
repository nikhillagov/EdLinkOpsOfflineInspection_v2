<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <div class="reset-password-box">
        <!-- Header -->
        <div class="page-header">
          <router-link to="/login" class="back-button">← Back to Login</router-link>
          <div class="header-content">
            <div class="icon">🔑</div>
            <h1>Reset Password</h1>
            <p class="subtitle">Create a new password for your account</p>
          </div>
        </div>

        <!-- Success State -->
        <div v-if="submitted" class="success-state">
          <div class="success-icon">✓</div>
          <h2>Password Reset Successful</h2>
          <p class="success-message">
            Your password has been reset successfully. You can now log in with your new password.
          </p>

          <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
        </div>

        <!-- Form State -->
        <div v-else>
          <!-- Error Alert -->
          <div v-if="error" class="alert alert-danger">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <p class="alert-title">Error</p>
              <p class="alert-message">{{ error }}</p>
            </div>
            <button class="alert-close" @click="error = null">×</button>
          </div>

          <!-- Info Alert -->
          <div v-if="!tokenVerified" class="alert alert-warning">
            <span class="alert-icon">⚙️</span>
            <div class="alert-content">
              <p class="alert-message">Verifying your reset token...</p>
            </div>
          </div>

          <!-- Form -->
          <form v-if="tokenVerified" @submit.prevent="handleSubmit" class="reset-form">
            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">New Password</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  v-model="formData.password"
                  type="password"
                  class="form-input"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Enter new password"
                  required
                  @blur="validateField('password')"
                  :disabled="isLoading"
                  autocomplete="new-password" />
                <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
              </div>

              <!-- Password Requirements -->
              <div class="password-requirements">
                <p class="requirements-title">Password must contain:</p>
                <ul class="requirements-list">
                  <li :class="{ met: formData.password.length >= 8 }">
                    At least 8 characters
                  </li>
                  <li :class="{ met: /[A-Z]/.test(formData.password) }">
                    One uppercase letter
                  </li>
                  <li :class="{ met: /[a-z]/.test(formData.password) }">
                    One lowercase letter
                  </li>
                  <li :class="{ met: /[0-9]/.test(formData.password) }">
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <input
                  id="confirm-password"
                  v-model="formData.confirmPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  placeholder="Confirm your new password"
                  required
                  @blur="validateField('confirmPassword')"
                  :disabled="isLoading"
                  autocomplete="new-password" />
                <span v-if="errors.confirmPassword" class="form-error">{{
                  errors.confirmPassword
                }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading || !isFormValid"
              :class="{ 'is-loading': isLoading }">
              {{ isLoading ? '⏳ Resetting...' : '✓ Reset Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePasswordReset } from '@/composables/useAuth';

const route = useRoute();
const { isLoading, error, resetPassword, clearError } = usePasswordReset();

const token = computed(() => route.query.token as string);
const tokenVerified = ref(false);
const submitted = ref(false);

const formData = ref({
  password: '',
  confirmPassword: ''
});

const errors = ref<Record<string, string>>({});

const isFormValid = computed(() => {
  return (
    formData.value.password.length >= 8 &&
    formData.value.confirmPassword.length > 0 &&
    formData.value.password === formData.value.confirmPassword &&
    Object.keys(errors.value).length === 0
  );
});

const validateField = (fieldName: string) => {
  errors.value[fieldName] = '';

  if (fieldName === 'password') {
    if (!formData.value.password) {
      errors.value.password = 'Password is required';
    } else if (formData.value.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.value.password)) {
      errors.value.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.value.password)) {
      errors.value.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.value.password)) {
      errors.value.password = 'Password must contain at least one number';
    }
  } else if (fieldName === 'confirmPassword') {
    if (!formData.value.confirmPassword) {
      errors.value.confirmPassword = 'Please confirm your password';
    } else if (formData.value.password !== formData.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match';
    }
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  // Validate password
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(formData.value.password)) {
    errors.value.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(formData.value.password)) {
    errors.value.password = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(formData.value.password)) {
    errors.value.password = 'Password must contain at least one number';
  }

  // Validate confirmation
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password';
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm() || !token.value) {
    return;
  }

  try {
    clearError();
    const success = await resetPassword(token.value, formData.value.password);

    if (success) {
      submitted.value = true;
    }
  } catch (err) {
    console.error('Password reset failed:', err);
  }
};

onMounted(() => {
  // Verify token format (basic check)
  if (token.value && token.value.length > 0) {
    tokenVerified.value = true;
  } else {
    error.value = 'Invalid or missing reset token. Please request a new password reset link.';
  }
});
</script>

<style scoped>
.reset-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.reset-password-container {
  width: 100%;
  max-width: 500px;
}

.reset-password-box {
  padding: 2.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.page-header {
  position: relative;
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: var(--bg-secondary, #f3f4f6);
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.5rem;
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: var(--bg-tertiary, #e5e7eb);
  color: var(--text-primary, #1f2937);
}

.header-content {
  text-align: center;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
}

.subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary, #6b7280);
}

.alert {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.alert-danger {
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
}

.alert-warning {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #991b1b;
  font-size: 0.95rem;
}

.alert-message {
  margin: 0;
  color: #7f1d1d;
  font-size: 0.875rem;
}

.alert-warning .alert-message {
  color: #78350f;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #991b1b;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-state {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: successPop 0.5s ease-out;
}

@keyframes successPop {
  0% {
    font-size: 0;
    opacity: 0;
  }
  100% {
    font-size: 4rem;
    opacity: 1;
  }
}

.success-state h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: var(--text-primary, #1f2937);
}

.success-message {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;
  color: var(--text-primary, #1f2937);
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: var(--bg-secondary, #f3f4f6);
  cursor: not-allowed;
}

.form-input.is-invalid {
  border-color: #ef4444;
}

.form-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
  display: block;
  margin-top: -0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.password-requirements {
  padding: 0.75rem;
  background-color: var(--bg-secondary, #f9fafb);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.requirements-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.requirements-list li {
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.requirements-list li::before {
  content: '✗';
  color: #ef4444;
  font-weight: bold;
}

.requirements-list li.met {
  color: #10b981;
}

.requirements-list li.met::before {
  content: '✓';
  color: #10b981;
}

.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .reset-password-box {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .icon {
    font-size: 2rem;
  }

  .success-icon {
    font-size: 3rem;
  }
}
</style>
