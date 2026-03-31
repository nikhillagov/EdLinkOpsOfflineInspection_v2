/**
 * Action Request Store Module
 * Manages action request state
 */

import { Module } from 'vuex';
import type { ActionRequest } from '@/models/action-request/action-request.model';

interface ActionRequestState {
  actionRequests: ActionRequest[];
  currentActionRequest: ActionRequest | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    entityId?: number;
  };
}

const state: ActionRequestState = {
  actionRequests: [],
  currentActionRequest: null,
  loading: false,
  error: null,
  filters: {}
};

const mutations = {
  SET_ACTION_REQUESTS(state: ActionRequestState, requests: ActionRequest[]) {
    state.actionRequests = requests;
  },

  SET_CURRENT_ACTION_REQUEST(state: ActionRequestState, request: ActionRequest | null) {
    state.currentActionRequest = request;
  },

  ADD_ACTION_REQUEST(state: ActionRequestState, request: ActionRequest) {
    state.actionRequests.push(request);
  },

  UPDATE_ACTION_REQUEST(state: ActionRequestState, updatedRequest: ActionRequest) {
    const index = state.actionRequests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      state.actionRequests.splice(index, 1, updatedRequest);
    }
  },

  SET_LOADING(state: ActionRequestState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: ActionRequestState, error: string | null) {
    state.error = error;
  },

  SET_FILTER(state: ActionRequestState, filter: Partial<ActionRequestState['filters']>) {
    state.filters = { ...state.filters, ...filter };
  }
};

const actions = {
  setCurrentActionRequest({ commit }, request: ActionRequest | null) {
    commit('SET_CURRENT_ACTION_REQUEST', request);
  },

  loadActionRequests({ commit }) {
    commit('SET_LOADING', true);
    try {
      commit('SET_ACTION_REQUESTS', []);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  addActionRequest({ commit }, request: ActionRequest) {
    commit('ADD_ACTION_REQUEST', request);
  },

  updateActionRequest({ commit }, request: ActionRequest) {
    commit('UPDATE_ACTION_REQUEST', request);
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
  getAllActionRequests: (state: ActionRequestState) => state.actionRequests,
  getCurrentActionRequest: (state: ActionRequestState) => state.currentActionRequest,
  getActionRequest: (state: ActionRequestState) => (requestId: number) =>
    state.actionRequests.find(r => r.id === requestId),
  getFilteredActionRequests: (state: ActionRequestState) => {
    let filtered = state.actionRequests;
    if (state.filters.status) {
      filtered = filtered.filter(r => r.status === state.filters.status);
    }
    if (state.filters.entityId) {
      filtered = filtered.filter(r => r.entityId === state.filters.entityId);
    }
    return filtered;
  },
  isLoading: (state: ActionRequestState) => state.loading,
  hasError: (state: ActionRequestState) => !!state.error,
  getError: (state: ActionRequestState) => state.error
};

const actionRequestModule: Module<ActionRequestState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default actionRequestModule;
