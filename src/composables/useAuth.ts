/**
 * Auth Composables
 * Composable functions for authentication management
 */

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import type { User } from '@/types/commonTypeDefinition';

/**
 * useAuth Composable
 * Main composable for authentication
 */
export const useAuth = () => {
  const store = useStore();
  const router = useRouter();

  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
  const user = computed(() => store.getters['auth/getUser']);
  const token = computed(() => store.getters['auth/getToken']);
  const isLoading = computed(() => store.getters['auth/isLoading']);
  const error = computed(() => store.getters['auth/getError']);
  const hasError = computed(() => store.getters['auth/hasError']);

  const login = async (username: string, password: string) => {
    try {
      const result = await store.dispatch('auth/login', {
        username,
        password
      });
      return result;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await store.dispatch('auth/logout');
      await router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => {
    store.commit('auth/SET_ERROR', null);
  };

  const refreshToken = async () => {
    const refreshToken = store.getters['auth/getToken'];
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      return await store.dispatch('auth/refreshToken', refreshToken);
    } catch (err) {
      // Redirect to login if token refresh fails
      await router.push('/login');
      throw err;
    }
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    hasError,

    // Methods
    login,
    logout,
    clearError,
    refreshToken
  };
};

/**
 * useAuthGuard Composable
 * Check permissions and roles
 */
export const useAuthGuard = () => {
  const store = useStore();

  const hasPermission = async (permission: string): Promise<boolean> => {
    const user = store.getters['auth/getUser'] as User | null;
    if (!user) return false;

    try {
      return await store.dispatch('auth/checkPermission', {
        userId: user.id,
        permission
      });
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  const hasRole = (role: string): boolean => {
    const user = store.getters['auth/getUser'] as User | null;
    if (!user) return false;
    return user.role === role || user.role === 'admin';
  };

  const isAdmin = (): boolean => {
    const user = store.getters['auth/getUser'] as User | null;
    if (!user) return false;
    return user.role === 'admin';
  };

  const canViewEntity = (): boolean => {
    return hasRole('admin') || hasRole('inspector') || hasRole('viewer');
  };

  const canEditEntity = (): boolean => {
    return hasRole('admin') || hasRole('inspector');
  };

  const canDeleteEntity = (): boolean => {
    return hasRole('admin');
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
    canViewEntity,
    canEditEntity,
    canDeleteEntity
  };
};

/**
 * usePasswordReset Composable
 * Handle password reset flow
 */
export const usePasswordReset = () => {
  const store = useStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const requestReset = async (email: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await store.dispatch('auth/requestPasswordReset', email);
      return true;
    } catch (err) {
      error.value = (err as Error).message || 'Failed to request password reset';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await store.dispatch('auth/resetPassword', { token, password });
      return true;
    } catch (err) {
      error.value = (err as Error).message || 'Failed to reset password';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    isLoading,
    error,
    requestReset,
    resetPassword,
    clearError
  };
};

/**
 * useSession Composable
 * Manage session and tokens
 */
export const useSession = () => {
  const store = useStore();
  const router = useRouter();

  const isExpired = (): boolean => {
    const token = store.getters['auth/getToken'];
    if (!token) return true;

    try {
      // Decode JWT token (basic approach)
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const decoded = JSON.parse(atob(parts[1]));
      const expirationTime = decoded.exp * 1000;
      return Date.now() > expirationTime;
    } catch (error) {
      return true;
    }
  };

  const isExpiringSoon = (minutesBefore: number = 5): boolean => {
    const token = store.getters['auth/getToken'];
    if (!token) return true;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const decoded = JSON.parse(atob(parts[1]));
      const expirationTime = decoded.exp * 1000;
      const soonTime = Date.now() + minutesBefore * 60 * 1000;

      return soonTime > expirationTime;
    } catch (error) {
      return true;
    }
  };

  const logout = async () => {
    try {
      await store.dispatch('auth/logout');
      await router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshIfExpiring = async () => {
    if (isExpiringSoon()) {
      try {
        const refreshToken = store.getters['auth/getToken'];
        if (refreshToken) {
          await store.dispatch('auth/refreshToken', refreshToken);
        }
      } catch (error) {
        console.error('Token refresh failed, redirecting to login');
        await logout();
      }
    }
  };

  return {
    isExpired,
    isExpiringSoon,
    logout,
    refreshIfExpiring
  };
};
