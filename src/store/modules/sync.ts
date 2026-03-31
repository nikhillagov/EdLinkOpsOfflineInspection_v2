/**
 * Sync Store Module
 * Manages synchronization state
 */

import { createLogger } from '@/utils/logger';
import { getSyncService, SyncConfig } from '@/services/database/sync.service';

const logger = createLogger('SyncStore');

// Sync service instance
let syncService: any = null;

// Default sync configuration
const DEFAULT_SYNC_CONFIG: SyncConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  syncIntervalMs: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelayMs: 5000,
  batchSize: 100
};

interface SyncState {
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  pendingSyncCount: number;
  lastSyncTime: Date | null;
  syncMessage: string;
  syncMetadata: any;
  autoSyncEnabled: boolean;
}

const state: SyncState = {
  isOnline: navigator.onLine,
  syncStatus: 'idle',
  pendingSyncCount: 0,
  lastSyncTime: null,
  syncMessage: '',
  syncMetadata: null,
  autoSyncEnabled: true
};

const getters = {
  isOnline: (state: SyncState) => state.isOnline,
  syncStatus: (state: SyncState) => state.syncStatus,
  pendingSyncCount: (state: SyncState) => state.pendingSyncCount,
  lastSyncTime: (state: SyncState) => state.lastSyncTime,
  syncMessage: (state: SyncState) => state.syncMessage,
  autoSyncEnabled: (state: SyncState) => state.autoSyncEnabled,
  isSyncing: (state: SyncState) => state.syncStatus === 'syncing'
};

const mutations = {
  setOnlineStatus(state: SyncState, isOnline: boolean) {
    state.isOnline = isOnline;
  },
  setSyncStatus(state: SyncState, status: 'idle' | 'syncing' | 'success' | 'error') {
    state.syncStatus = status;
  },
  setPendingSyncCount(state: SyncState, count: number) {
    state.pendingSyncCount = count;
  },
  setLastSyncTime(state: SyncState, time: Date | null) {
    state.lastSyncTime = time;
  },
  setSyncMessage(state: SyncState, message: string) {
    state.syncMessage = message;
  },
  setSyncMetadata(state: SyncState, metadata: any) {
    state.syncMetadata = metadata;
  },
  setAutoSyncEnabled(state: SyncState, enabled: boolean) {
    state.autoSyncEnabled = enabled;
  }
};

const actions = {
  initializeSync({ commit }: any) {
    // Listen to online/offline events
    window.addEventListener('online', () => {
      commit('setOnlineStatus', true);
      logger.info('Application is online');
    });

    window.addEventListener('offline', () => {
      commit('setOnlineStatus', false);
      logger.info('Application is offline');
    });

    logger.info('Sync initialization complete');
  },

  async performManualSync({ commit }: any) {
    try {
      commit('setSyncStatus', 'syncing');
      commit('setSyncMessage', 'Syncing data...');

      // Initialize sync service if not already done
      if (!syncService) {
        syncService = getSyncService(DEFAULT_SYNC_CONFIG);
      }

      const result = await syncService.performSync();

      if (result.success) {
        commit('setSyncStatus', 'success');
        commit('setLastSyncTime', new Date());
        commit('setSyncMessage', `Sync completed: ${result.recordsSynced} records synced`);
        if (result.failures && result.failures.length > 0) {
          commit('setSyncMessage', `Sync completed with ${result.failures.length} failures`);
        }
      } else {
        commit('setSyncStatus', 'error');
        commit('setSyncMessage', result.message || 'Sync failed');
      }

      logger.info('Manual sync completed', result);
      return result;
    } catch (error) {
      commit('setSyncStatus', 'error');
      commit('setSyncMessage', (error as Error).message);
      logger.error('Sync failed', error);
      throw error;
    }
  },

  setAutoSync({ commit }: any, enabled: boolean) {
    try {
      commit('setAutoSyncEnabled', enabled);
      
      // Initialize sync service if not already done
      if (!syncService) {
        syncService = getSyncService(DEFAULT_SYNC_CONFIG);
      }
      
      if (enabled) {
        logger.info('Starting auto sync...');
        syncService.startAutoSync();
      } else {
        logger.info('Stopping auto sync...');
        syncService.stopAutoSync();
      }
    } catch (error) {
      logger.error('Failed to toggle auto sync', error);
      commit('setSyncMessage', (error as Error).message);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
