/**
 * Entity Store Module
 * Manages entity (center) state
 */

import { Module } from 'vuex';
import type { EntityModel } from '@/models/entity/entity.model';

interface EntityState {
  entities: EntityModel[];
  currentEntity: EntityModel | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchText: string;
    status?: string;
  };
}

const state: EntityState = {
  entities: [],
  currentEntity: null,
  loading: false,
  error: null,
  filters: {
    searchText: ''
  }
};

const mutations = {
  SET_ENTITIES(state: EntityState, entities: EntityModel[]) {
    state.entities = entities;
  },

  SET_CURRENT_ENTITY(state: EntityState, entity: EntityModel | null) {
    state.currentEntity = entity;
  },

  ADD_ENTITY(state: EntityState, entity: EntityModel) {
    state.entities.push(entity);
  },

  UPDATE_ENTITY(state: EntityState, updatedEntity: EntityModel) {
    const index = state.entities.findIndex(e => e.id === updatedEntity.id);
    if (index !== -1) {
      state.entities.splice(index, 1, updatedEntity);
    }
  },

  REMOVE_ENTITY(state: EntityState, entityId: number) {
    state.entities = state.entities.filter(e => e.id !== entityId);
  },

  SET_LOADING(state: EntityState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: EntityState, error: string | null) {
    state.error = error;
  },

  SET_FILTER(state: EntityState, filter: Partial<EntityState['filters']>) {
    state.filters = { ...state.filters, ...filter };
  },

  CLEAR_FILTERS(state: EntityState) {
    state.filters = { searchText: '' };
  }
};

const actions = {
  setCurrentEntity({ commit }, entity: EntityModel | null) {
    commit('SET_CURRENT_ENTITY', entity);
  },

  async loadEntities({ commit }) {
    commit('SET_LOADING', true);
    try {
      // This would load from service
      commit('SET_ENTITIES', []);
    } catch (error: any) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  addEntity({ commit }, entity: EntityModel) {
    commit('ADD_ENTITY', entity);
  },

  updateEntity({ commit }, entity: EntityModel) {
    commit('UPDATE_ENTITY', entity);
  },

  removeEntity({ commit }, entityId: number) {
    commit('REMOVE_ENTITY', entityId);
  },

  setSearchFilter({ commit }, searchText: string) {
    commit('SET_FILTER', { searchText });
  },

  clearFilters({ commit }) {
    commit('CLEAR_FILTERS');
  },

  clearError({ commit }) {
    commit('SET_ERROR', null);
  }
};

const getters = {
  getAllEntities: (state: EntityState) => state.entities,
  getCurrentEntity: (state: EntityState) => state.currentEntity,
  getEntity: (state: EntityState) => (entityId: number) =>
    state.entities.find(e => e.id === entityId),
  getFilteredEntities: (state: EntityState) => {
    if (!state.filters.searchText) return state.entities;
    return state.entities.filter(e =>
      e.licenseeName?.toLowerCase().includes(state.filters.searchText.toLowerCase()) ||
      e.facilityName?.toLowerCase().includes(state.filters.searchText.toLowerCase())
    );
  },
  isLoading: (state: EntityState) => state.loading,
  hasError: (state: EntityState) => !!state.error,
  getError: (state: EntityState) => state.error,
  getFilters: (state: EntityState) => state.filters
};

const entityModule: Module<EntityState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default entityModule;
