/**
 * UI Store Module
 * Manages UI state (modals, dialogs, etc.)
 */

import { Module } from 'vuex';

interface ModalState {
  isOpen: boolean;
  title: string;
  content?: any;
  actions?: Array<{
    label: string;
    handler: () => void;
    variant?: string;
  }>;
}

interface UIState {
  modals: {
    inspectionDetail: ModalState;
    actionItem: ModalState;
    confirmation: ModalState;
    [key: string]: ModalState;
  };
  drawers: {
    [key: string]: {
      isOpen: boolean;
      title?: string;
    };
  };
  activeTab: string;
  loadingStates: {
    [key: string]: boolean;
  };
}

const state: UIState = {
  modals: {
    inspectionDetail: { isOpen: false, title: '' },
    actionItem: { isOpen: false, title: '' },
    confirmation: { isOpen: false, title: '' }
  },
  drawers: {},
  activeTab: 'overview',
  loadingStates: {}
};

const mutations = {
  OPEN_MODAL(state: UIState, { id, title, content, actions }) {
    state.modals[id] = {
      isOpen: true,
      title,
      content,
      actions
    };
  },

  CLOSE_MODAL(state: UIState, id: string) {
    if (state.modals[id]) {
      state.modals[id].isOpen = false;
    }
  },

  TOGGLE_MODAL(state: UIState, id: string) {
    if (state.modals[id]) {
      state.modals[id].isOpen = !state.modals[id].isOpen;
    }
  },

  OPEN_DRAWER(state: UIState, { id, title }) {
    if (!state.drawers[id]) {
      state.drawers[id] = { isOpen: false };
    }
    state.drawers[id].isOpen = true;
    state.drawers[id].title = title;
  },

  CLOSE_DRAWER(state: UIState, id: string) {
    if (state.drawers[id]) {
      state.drawers[id].isOpen = false;
    }
  },

  SET_ACTIVE_TAB(state: UIState, tabId: string) {
    state.activeTab = tabId;
  },

  SET_LOADING(state: UIState, { key, loading }: { key: string; loading: boolean }) {
    state.loadingStates[key] = loading;
  }
};

const actions = {
  openModal({ commit }, { id, title, content, actions }) {
    commit('OPEN_MODAL', { id, title, content, actions });
  },

  closeModal({ commit }, id: string) {
    commit('CLOSE_MODAL', id);
  },

  toggleModal({ commit }, id: string) {
    commit('TOGGLE_MODAL', id);
  },

  openDrawer({ commit }, { id, title }) {
    commit('OPEN_DRAWER', { id, title });
  },

  closeDrawer({ commit }, id: string) {
    commit('CLOSE_DRAWER', id);
  },

  setActiveTab({ commit }, tabId: string) {
    commit('SET_ACTIVE_TAB', tabId);
  },

  setLoading({ commit }, { key, loading }: { key: string; loading: boolean }) {
    commit('SET_LOADING', { key, loading });
  }
};

const getters = {
  isModalOpen: (state: UIState) => (id: string) => 
    state.modals[id]?.isOpen ?? false,
  getModal: (state: UIState) => (id: string) =>
    state.modals[id],
  isDrawerOpen: (state: UIState) => (id: string) =>
    state.drawers[id]?.isOpen ?? false,
  getDrawer: (state: UIState) => (id: string) =>
    state.drawers[id],
  getActiveTab: (state: UIState) => state.activeTab,
  isLoading: (state: UIState) => (key: string) =>
    state.loadingStates[key] ?? false
};

const uiModule: Module<UIState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default uiModule;
