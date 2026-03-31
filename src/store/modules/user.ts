/**
 * User Store Module
 * Manages user state
 */

import { Module } from 'vuex';
import type { User, UserRole } from '@/types/commonTypeDefinition';
import { getUserService } from '@/services/user.service';

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const userService = getUserService();

const state: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null
};

const mutations = {
  SET_CURRENT_USER(state: UserState, user: User | null) {
    state.currentUser = user;
  },

  SET_USERS(state: UserState, users: User[]) {
    state.users = users;
  },

  ADD_USER(state: UserState, user: User) {
    state.users.push(user);
  },

  UPDATE_USER(state: UserState, updatedUser: User) {
    const index = state.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser);
    }
    if (state.currentUser?.id === updatedUser.id) {
      state.currentUser = updatedUser;
    }
  },

  REMOVE_USER(state: UserState, userId: number) {
    state.users = state.users.filter(u => u.id !== userId);
  },

  SET_LOADING(state: UserState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: UserState, error: string | null) {
    state.error = error;
  }
};

const actions = {
  async loadCurrentUser({ commit }, userId: number) {
    commit('SET_LOADING', true);
    try {
      const user = await userService.getUserById(userId);
      commit('SET_CURRENT_USER', user);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async loadAllUsers({ commit }) {
    commit('SET_LOADING', true);
    try {
      const users = await userService.getAllUsers();
      commit('SET_USERS', users);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createUser({ commit }, userData: Partial<User>) {
    commit('SET_LOADING', true);
    try {
      const user = await userService.createUser(userData);
      commit('ADD_USER', user);
      return user;
    } catch (error: any) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateUser({ commit }, { userId, userData }: { userId: number; userData: Partial<User> }) {
    commit('SET_LOADING', true);
    try {
      const user = await userService.updateUser(userId, userData);
      commit('UPDATE_USER', user);
      return user;
    } catch (error: any) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteUser({ commit }, userId: number) {
    commit('SET_LOADING', true);
    try {
      await userService.deleteUser(userId);
      commit('REMOVE_USER', userId);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async assignRole({ commit }, { userId, role }: { userId: number; role: UserRole }) {
    commit('SET_LOADING', true);
    try {
      await userService.assignRole(userId, role);
      const user = await userService.getUserById(userId);
      if (user) {
        commit('UPDATE_USER', user);
      }
    } catch (error: any) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  getCurrentUser: (state: UserState) => state.currentUser,
  getAllUsers: (state: UserState) => state.users,
  getUser: (state: UserState) => (userId: number) => 
    state.users.find(u => u.id === userId),
  getUsersByRole: (state: UserState) => (role: UserRole) =>
    state.users.filter(u => u.role === role),
  isLoading: (state: UserState) => state.loading,
  hasError: (state: UserState) => !!state.error,
  getError: (state: UserState) => state.error
};

const userModule: Module<UserState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default userModule;
