/**
 * License Store Module
 * Manages license/credential state
 */

import { Module } from 'vuex';

interface LicenseState {
  licenses: any[];
  currentLicense: any | null;
  loading: boolean;
  error: string | null;
}

const state: LicenseState = {
  licenses: [],
  currentLicense: null,
  loading: false,
  error: null
};

const mutations = {
  SET_LICENSES(state: LicenseState, licenses: any[]) {
    state.licenses = licenses;
  },

  SET_CURRENT_LICENSE(state: LicenseState, license: any | null) {
    state.currentLicense = license;
  },

  ADD_LICENSE(state: LicenseState, license: any) {
    state.licenses.push(license);
  },

  UPDATE_LICENSE(state: LicenseState, updatedLicense: any) {
    const index = state.licenses.findIndex(l => l.id === updatedLicense.id);
    if (index !== -1) {
      state.licenses.splice(index, 1, updatedLicense);
    }
  },

  SET_LOADING(state: LicenseState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: LicenseState, error: string | null) {
    state.error = error;
  }
};

const actions = {
  setCurrentLicense({ commit }, license: any | null) {
    commit('SET_CURRENT_LICENSE', license);
  },

  loadLicenses({ commit }) {
    commit('SET_LOADING', true);
    try {
      commit('SET_LICENSES', []);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  addLicense({ commit }, license: any) {
    commit('ADD_LICENSE', license);
  },

  updateLicense({ commit }, license: any) {
    commit('UPDATE_LICENSE', license);
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  getAllLicenses: (state: LicenseState) => state.licenses,
  getCurrentLicense: (state: LicenseState) => state.currentLicense,
  getLicense: (state: LicenseState) => (licenseId: number) =>
    state.licenses.find(l => l.id === licenseId),
  isLoading: (state: LicenseState) => state.loading,
  hasError: (state: LicenseState) => !!state.error,
  getError: (state: LicenseState) => state.error
};

const licenseModule: Module<LicenseState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default licenseModule;
