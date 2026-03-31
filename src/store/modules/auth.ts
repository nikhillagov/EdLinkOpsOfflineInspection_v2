/**
 * Auth Store Module
 * Manages authentication state
 */

import { Module } from 'vuex';
import type { AuthToken, User } from '@/types/commonTypeDefinition';
import { getAuthService } from '@/services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const authService = getAuthService();

const state: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null
};

const mutations = {
  SET_AUTHENTICATED(state: AuthState, authenticated: boolean) {
    state.isAuthenticated = authenticated;
  },

  SET_USER(state: AuthState, user: User | null) {
    state.user = user;
  },

  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token;
  },

  SET_REFRESH_TOKEN(state: AuthState, refreshToken: string | null) {
    state.refreshToken = refreshToken;
  },

  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error;
  },

  LOGOUT(state: AuthState) {
    state.isAuthenticated = false;
    state.user = null;
    state.token = null;
    state.refreshToken = null;
  }
};

const actions = {
  async login({ commit }, credentials: { username: string; password: string }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const authToken = await authService.login(credentials);
      commit('SET_TOKEN', authToken.accessToken);
      commit('SET_REFRESH_TOKEN', authToken.refreshToken);
      commit('SET_AUTHENTICATED', true);
      return authToken;
    } catch (error: any) {
      commit('SET_ERROR', error.message);
      commit('SET_AUTHENTICATED', false);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async logout({ commit, state }) {
    try {
      if (state.token) {
        await authService.logout(state.token);
      }
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      commit('LOGOUT');
    }
  },

  async verifyToken({ commit }, token: string) {
    try {
      const user = await authService.verifyToken(token);
      commit('SET_USER', user);
      commit('SET_AUTHENTICATED', true);
      return user;
    } catch (error: any) {
      commit('SET_AUTHENTICATED', false);
      throw error;
    }
  },

  async refreshToken({ commit }, refreshToken: string) {
    try {
      const authToken = await authService.refreshToken(refreshToken);
      commit('SET_TOKEN', authToken.accessToken);
      commit('SET_REFRESH_TOKEN', authToken.refreshToken);
      return authToken;
    } catch (error: any) {
      commit('LOGOUT');
      throw error;
    }
  },

  async checkPermission(_, { userId, permission }: { userId: number; permission: string }) {
    return await authService.checkPermission(userId, permission);
  },

  async requestPasswordReset(_, email: string) {
    return await authService.requestPasswordReset(email);
  },

  async resetPassword(_, { token, password }: { token: string; password: string }) {
    return await authService.resetPasswordWithToken(token, password);
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  getUser: (state: AuthState) => state.user,
  getToken: (state: AuthState) => state.token,
  isLoading: (state: AuthState) => state.loading,
  hasError: (state: AuthState) => !!state.error,
  getError: (state: AuthState) => state.error
};

const authModule: Module<AuthState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default authModule;
