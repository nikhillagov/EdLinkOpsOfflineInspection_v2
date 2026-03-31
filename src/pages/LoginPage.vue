<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <!-- Header -->
        <div class="login-header">
          <div class="logo">🔐</div>
          <h1>EdLink Offline Inspector</h1>
          <p class="subtitle">Sign In to Your Account</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger">
          <span class="alert-icon">⚠️</span>
          <div class="alert-content">
            <p class="alert-title">Login Failed</p>
            <p class="alert-message">{{ error }}</p>
          </div>
          <button class="alert-close" @click="error = null">×</button>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Username/Email -->
          <div class="form-group">
            <label for="username" class="form-label">Username or Email</label>
            <div class="input-wrapper">
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                class="form-input"
                :class="{ 'is-invalid': errors.username }"
                placeholder="Enter your username or email"
                required
                @blur="validateField('username')"
                :disabled="isLoading"
                autocomplete="username" />
              <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                class="form-input"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Enter your password"
                required
                @blur="validateField('password')"
                :disabled="isLoading"
                autocomplete="current-password" />
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-group checkbox-group">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="checkbox-input"
              :disabled="isLoading" />
            <label for="remember" class="checkbox-label">Remember me</label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-login"
            :disabled="isLoading || !isFormValid"
            :class="{ 'is-loading': isLoading }">
            {{ isLoading ? '⏳ Signing in...' : '✓ Sign In' }}
          </button>
        </form>

        <!-- Additional Links -->
        <div class="login-footer">
          <router-link to="/forgot-password" class="link-secondary">
            Forgot password?
          </router-link>
          <span class="separator">•</span>
          <router-link to="/reset-password" class="link-secondary">
            Reset password
          </router-link>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-section">
          <p class="demo-title">Demo Credentials</p>
          <div class="demo-content">
            <p><strong>Username:</strong> <code>demo</code></p>
            <p><strong>Password:</strong> <code>password</code></p>
            <p class="demo-note">For testing purposes only</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Info Panel (Desktop Only) -->
      <div class="login-info">
        <div class="info-content">
          <h2>Welcome Back!</h2>
          <p>
            EdLink Offline Inspector helps you manage inspections and maintain compliance records
            efficiently and securely.
          </p>

          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">📋</div>
              <div class="feature-text">
                <h4>Inspection Management</h4>
                <p>Track and manage all your inspections in one place</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <div class="feature-text">
                <h4>Secure Access</h4>
                <p>Your data is protected with industry-standard encryption</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <div class="feature-text">
                <h4>Works Offline</h4>
                <p>Access your data even without an internet connection</p>
              </div>
            </div>
          </div>

          <div class="info-footer">
            <p>Version 2.0</p>
            <p class="text-muted">© 2026 EdLink. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const credentials = ref({
  username: '',
  password: ''
});

const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const errors = ref<Record<string, string>>({});

const isFormValid = computed(() => {
  return (
    credentials.value.username.trim().length > 0 &&
    credentials.value.password.length > 0 &&
    Object.values(errors.value).every(e => !e)
  );
});

const validateField = (fieldName: string) => {
  errors.value[fieldName] = '';

  if (fieldName === 'username') {
    if (!credentials.value.username.trim()) {
      errors.value.username = 'Username or email is required';
    } else if (credentials.value.username.includes('@')) {
      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.username)) {
        errors.value.username = 'Please enter a valid email address';
      }
    }
  } else if (fieldName === 'password') {
    if (!credentials.value.password) {
      errors.value.password = 'Password is required';
    } else if (credentials.value.password.length < 6) {
      errors.value.password = 'Password must be at least 6 characters';
    }
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!credentials.value.username.trim()) {
    errors.value.username = 'Username or email is required';
  } else if (credentials.value.username.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.username)) {
      errors.value.username = 'Please enter a valid email address';
    }
  }

  if (!credentials.value.password) {
    errors.value.password = 'Password is required';
  } else if (credentials.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;

    // Dispatch login action
    const result = await store.dispatch('auth/login', {
      username: credentials.value.username,
      password: credentials.value.password
    });

    // Store credentials if "remember me" is checked
    if (rememberMe.value) {
      localStorage.setItem('edlink_remembered_username', credentials.value.username);
    } else {
      localStorage.removeItem('edlink_remembered_username');
    }

    // Redirect to dashboard
    await router.push('/');
  } catch (err) {
    const errorMessage = (err as Error).message || 'Login failed. Please check your credentials.';
    error.value = errorMessage;
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Load remembered username on mount
onMounted(() => {
  const remembered = localStorage.getItem('edlink_remembered_username');
  if (remembered) {
    credentials.value.username = remembered;
    rememberMe.value = true;
  }

  // Check if already authenticated
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  if (isAuthenticated) {
    router.push('/');
  }
});
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 700px;
}

.login-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.login-header h1 {
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-top: -0.75rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  margin: 0;
}

.btn-login {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-login.is-loading {
  pointer-events: none;
}

.login-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.link-secondary {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.link-secondary:hover {
  color: #764ba2;
  text-decoration: underline;
}

.separator {
  color: var(--border-color, #d1d5db);
}

.demo-section {
  padding: 1rem;
  background-color: var(--bg-secondary, #f9fafb);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
}

.demo-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-content p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary, #6b7280);
}

.demo-content code {
  background-color: white;
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  color: #667eea;
  font-weight: 600;
}

.demo-note {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
  margin-top: 0.25rem;
}

.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
}

.info-content h2 {
  margin: 0 0 1.5rem 0;
  font-size: 2.25rem;
  font-weight: 700;
}

.info-content > p {
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.95;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.feature-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.85;
}

.info-footer {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.7;
}

.info-footer p {
  margin: 0.25rem 0;
}

.text-muted {
  opacity: 0.6;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .login-info {
    display: none;
  }

  .login-box {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 0.5rem;
  }

  .login-box {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .logo {
    font-size: 2rem;
  }

  .btn-login {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-input {
    font-size: 0.9rem;
    padding: 0.65rem;
  }
}
</style>
