/**
 * VOR Store Module
 * Manages Verification of Records (VOR) state
 */

import { Module } from 'vuex';
import type { VORRequest } from '@/models/vor/vor.model';

interface VORState {
  vorRequests: VORRequest[];
  currentVORRequest: VORRequest | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    entityId?: number;
  };
}

const state: VORState = {
  vorRequests: [],
  currentVORRequest: null,
  loading: false,
  error: null,
  filters: {}
};

const mutations = {
  SET_VOR_REQUESTS(state: VORState, requests: VORRequest[]) {
    state.vorRequests = requests;
  },

  SET_CURRENT_VOR_REQUEST(state: VORState, request: VORRequest | null) {
    state.currentVORRequest = request;
  },

  ADD_VOR_REQUEST(state: VORState, request: VORRequest) {
    state.vorRequests.push(request);
  },

  UPDATE_VOR_REQUEST(state: VORState, updatedRequest: VORRequest) {
    const index = state.vorRequests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      state.vorRequests.splice(index, 1, updatedRequest);
    }
  },

  SET_LOADING(state: VORState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: VORState, error: string | null) {
    state.error = error;
  },

  SET_FILTER(state: VORState, filter: Partial<VORState['filters']>) {
    state.filters = { ...state.filters, ...filter };
  }
};

const actions = {
  setCurrentVORRequest({ commit }, request: VORRequest | null) {
    commit('SET_CURRENT_VOR_REQUEST', request);
  },

  loadVORRequests({ commit }) {
    commit('SET_LOADING', true);
    try {
      commit('SET_VOR_REQUESTS', []);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  addVORRequest({ commit }, request: VORRequest) {
    commit('ADD_VOR_REQUEST', request);
  },

  updateVORRequest({ commit }, request: VORRequest) {
    commit('UPDATE_VOR_REQUEST', request);
  },

  setStatusFilter({ commit }, status: string) {
    commit('SET_FILTER', { status });
  },

  setEntityFilter({ commit }, entityId: number) {
    commit('SET_FILTER', { entityId });
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  getAllVORRequests: (state: VORState) => state.vorRequests,
  getCurrentVORRequest: (state: VORState) => state.currentVORRequest,
  getVORRequest: (state: VORState) => (requestId: number) =>
    state.vorRequests.find(r => r.id === requestId),
  getFilteredVORRequests: (state: VORState) => {
    let filtered = state.vorRequests;
    if (state.filters.status) {
      filtered = filtered.filter(r => r.status === state.filters.status);
    }
    if (state.filters.entityId) {
      filtered = filtered.filter(r => r.entityId === state.filters.entityId);
    }
    return filtered;
  },
  isLoading: (state: VORState) => state.loading,
  hasError: (state: VORState) => !!state.error,
  getError: (state: VORState) => state.error
};

const vorModule: Module<VORState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default vorModule;
