/**
 * Service Request Store Module
 * Manages service request state
 */

import { Module } from 'vuex';
import type { ServiceRequest } from '@/models/service-request/service-request.model';

interface ServiceRequestState {
  serviceRequests: ServiceRequest[];
  currentServiceRequest: ServiceRequest | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    type?: string;
  };
}

const state: ServiceRequestState = {
  serviceRequests: [],
  currentServiceRequest: null,
  loading: false,
  error: null,
  filters: {}
};

const mutations = {
  SET_SERVICE_REQUESTS(state: ServiceRequestState, requests: ServiceRequest[]) {
    state.serviceRequests = requests;
  },

  SET_CURRENT_SERVICE_REQUEST(state: ServiceRequestState, request: ServiceRequest | null) {
    state.currentServiceRequest = request;
  },

  ADD_SERVICE_REQUEST(state: ServiceRequestState, request: ServiceRequest) {
    state.serviceRequests.push(request);
  },

  UPDATE_SERVICE_REQUEST(state: ServiceRequestState, updatedRequest: ServiceRequest) {
    const index = state.serviceRequests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      state.serviceRequests.splice(index, 1, updatedRequest);
    }
  },

  SET_LOADING(state: ServiceRequestState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: ServiceRequestState, error: string | null) {
    state.error = error;
  },

  SET_FILTER(state: ServiceRequestState, filter: Partial<ServiceRequestState['filters']>) {
    state.filters = { ...state.filters, ...filter };
  }
};

const actions = {
  setCurrentServiceRequest({ commit }, request: ServiceRequest | null) {
    commit('SET_CURRENT_SERVICE_REQUEST', request);
  },

  loadServiceRequests({ commit }) {
    commit('SET_LOADING', true);
    try {
      commit('SET_SERVICE_REQUESTS', []);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  addServiceRequest({ commit }, request: ServiceRequest) {
    commit('ADD_SERVICE_REQUEST', request);
  },

  updateServiceRequest({ commit }, request: ServiceRequest) {
    commit('UPDATE_SERVICE_REQUEST', request);
  },

  setStatusFilter({ commit }, status: string) {
    commit('SET_FILTER', { status });
  },

  setTypeFilter({ commit }, type: string) {
    commit('SET_FILTER', { type });
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  getAllServiceRequests: (state: ServiceRequestState) => state.serviceRequests,
  getCurrentServiceRequest: (state: ServiceRequestState) => state.currentServiceRequest,
  getServiceRequest: (state: ServiceRequestState) => (requestId: number) =>
    state.serviceRequests.find(r => r.id === requestId),
  getFilteredServiceRequests: (state: ServiceRequestState) => {
    let filtered = state.serviceRequests;
    if (state.filters.status) {
      filtered = filtered.filter(r => r.status === state.filters.status);
    }
    if (state.filters.type) {
      filtered = filtered.filter(r => r.type === state.filters.type);
    }
    return filtered;
  },
  isLoading: (state: ServiceRequestState) => state.loading,
  hasError: (state: ServiceRequestState) => !!state.error,
  getError: (state: ServiceRequestState) => state.error
};

const serviceRequestModule: Module<ServiceRequestState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default serviceRequestModule;
