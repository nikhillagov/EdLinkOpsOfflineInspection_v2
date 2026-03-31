<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-box">
        <!-- Header -->
        <div class="page-header">
          <router-link to="/login" class="back-button">← Back to Login</router-link>
          <div class="header-content">
            <div class="icon">🔐</div>
            <h1>Forgot Password?</h1>
            <p class="subtitle">
              {{ submitted ? 'Check your email' : 'Reset your password' }}
            </p>
          </div>
        </div>

        <!-- Success State -->
        <div v-if="submitted" class="success-state">
          <div class="success-icon">✓</div>
          <h2>Password Reset Sent</h2>
          <p class="success-message">
            We've sent a password reset link to <strong>{{ email }}</strong>. Check your email
            inbox (and spam folder) for further instructions.
          </p>
          <p class="success-note">
            If you don't receive an email within a few minutes, please try again or contact support.
          </p>

          <button @click="resetForm" class="btn btn-secondary">Return to Login</button>
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
          <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div class="alert-content">
              <p class="alert-message">
                Enter the email address associated with your account, and we'll send you a link to
                reset your password.
              </p>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="reset-form">
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-input"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="Enter your email address"
                  required
                  @blur="validateField('email')"
                  :disabled="isLoading"
                  autocomplete="email" />
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading || !isFormValid"
              :class="{ 'is-loading': isLoading }">
              {{ isLoading ? '⏳ Sending...' : '✓ Send Reset Link' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePasswordReset } from '@/composables/useAuth';

const email = ref('');
const submitted = ref(false);
const errors = ref<Record<string, string>>({});
const { isLoading, error, requestReset, clearError } = usePasswordReset();

const isFormValid = computed(() => {
  return email.value.trim().length > 0 && Object.keys(errors.value).length === 0;
});

const validateField = (fieldName: string) => {
  errors.value[fieldName] = '';

  if (fieldName === 'email') {
    if (!email.value.trim()) {
      errors.value.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errors.value.email = 'Please enter a valid email address';
    }
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!email.value.trim()) {
    errors.value.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    clearError();
    const success = await requestReset(email.value);

    if (success) {
      submitted.value = true;
    }
  } catch (err) {
    console.error('Password reset request failed:', err);
  }
};

const resetForm = () => {
  email.value = '';
  submitted.value = false;
  errors.value = {};
  clearError();
};
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.forgot-password-container {
  width: 100%;
  max-width: 500px;
}

.forgot-password-box {
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

.alert-info {
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
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

.alert-info .alert-message {
  color: #0c4a6e;
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
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

.success-note {
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: var(--text-tertiary, #9ca3af);
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
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #ef4444;
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

.btn-secondary {
  background-color: var(--bg-secondary, #f9fafb);
  color: var(--text-primary, #1f2937);
  border: 1px solid var(--border-color, #e5e7eb);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-tertiary, #e5e7eb);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .forgot-password-box {
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
