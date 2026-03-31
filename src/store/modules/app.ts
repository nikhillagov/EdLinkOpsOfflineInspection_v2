/**
 * App Store Module
 * Manages global app state
 */

import { Module } from 'vuex';

interface AppState {
  appName: string;
  version: string;
  isDarkMode: boolean;
  language: string;
  sidebar: {
    isOpen: boolean;
    collapsible: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  isOnline: boolean;
  lastSyncTime: Date | null;
}

const state: AppState = {
  appName: 'EdLink Ops Offline Inspection',
  version: '2.0.0',
  isDarkMode: false,
  language: 'en',
  sidebar: {
    isOpen: true,
    collapsible: true
  },
  notifications: [],
  isOnline: true,
  lastSyncTime: null
};

const mutations = {
  SET_DARK_MODE(state: AppState, isDarkMode: boolean) {
    state.isDarkMode = isDarkMode;
  },

  SET_LANGUAGE(state: AppState, language: string) {
    state.language = language;
  },

  TOGGLE_SIDEBAR(state: AppState) {
    state.sidebar.isOpen = !state.sidebar.isOpen;
  },

  SET_SIDEBAR_OPEN(state: AppState, isOpen: boolean) {
    state.sidebar.isOpen = isOpen;
  },

  ADD_NOTIFICATION(
    state: AppState,
    notification: { id: string; type: string; message: string; duration?: number }
  ) {
    state.notifications.push(notification as any);
  },

  REMOVE_NOTIFICATION(state: AppState, notificationId: string) {
    state.notifications = state.notifications.filter(n => n.id !== notificationId);
  },

  CLEAR_NOTIFICATIONS(state: AppState) {
    state.notifications = [];
  },

  SET_ONLINE_STATUS(state: AppState, isOnline: boolean) {
    state.isOnline = isOnline;
  },

  SET_LAST_SYNC_TIME(state: AppState, time: Date | null) {
    state.lastSyncTime = time;
  }
};

const actions = {
  toggleDarkMode({ commit, state }) {
    commit('SET_DARK_MODE', !state.isDarkMode);
  },

  setLanguage({ commit }, language: string) {
    commit('SET_LANGUAGE', language);
  },

  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },

  setSidebarOpen({ commit }, isOpen: boolean) {
    commit('SET_SIDEBAR_OPEN', isOpen);
  },

  addNotification(
    { commit },
    notification: { type: string; message: string; duration?: number }
  ) {
    const id = Date.now().toString();
    commit('ADD_NOTIFICATION', {
      id,
      ...notification
    });

    if (notification.duration) {
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', id);
      }, notification.duration);
    }

    return id;
  },

  removeNotification({ commit }, notificationId: string) {
    commit('REMOVE_NOTIFICATION', notificationId);
  },

  clearNotifications({ commit }) {
    commit('CLEAR_NOTIFICATIONS');
  },

  setOnlineStatus({ commit }, isOnline: boolean) {
    commit('SET_ONLINE_STATUS', isOnline);
  },

  setLastSyncTime({ commit }, time: Date | null) {
    commit('SET_LAST_SYNC_TIME', time);
  }
};

const getters = {
  appName: (state: AppState) => state.appName,
  version: (state: AppState) => state.version,
  isDarkMode: (state: AppState) => state.isDarkMode,
  language: (state: AppState) => state.language,
  isSidebarOpen: (state: AppState) => state.sidebar.isOpen,
  notifications: (state: AppState) => state.notifications,
  notificationCount: (state: AppState) => state.notifications.length,
  isOnline: (state: AppState) => state.isOnline,
  lastSyncTime: (state: AppState) => state.lastSyncTime
};

const appModule: Module<AppState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default appModule;
