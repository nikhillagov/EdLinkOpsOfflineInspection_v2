/**
 * Inspection Store Module
 * Manages inspection state
 */

import { createLogger } from '@/utils/logger';
import { getInspectionService } from '@/services/database/inspection.service';

const logger = createLogger('InspectionStore');

interface InspectionState {
  inspections: any[];
  currentInspection: any | null;
  searchCriteria: any;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  availableCount: number;
  inProgressCount: number;
  completedCount: number;
}

const state: InspectionState = {
  inspections: [],
  currentInspection: null,
  searchCriteria: {},
  isLoading: false,
  error: null,
  totalCount: 0,
  availableCount: 0,
  inProgressCount: 0,
  completedCount: 0
};

const getters = {
  allInspections: (state: InspectionState) => state.inspections,
  currentInspection: (state: InspectionState) => state.currentInspection,
  isLoading: (state: InspectionState) => state.isLoading,
  error: (state: InspectionState) => state.error,
  stats: (state: InspectionState) => ({
    total: state.totalCount,
    available: state.availableCount,
    inProgress: state.inProgressCount,
    completed: state.completedCount
  })
};

const mutations = {
  setInspections(state: InspectionState, inspections: any[]) {
    state.inspections = inspections;
  },
  setCurrentInspection(state: InspectionState, inspection: any) {
    state.currentInspection = inspection;
  },
  setLoading(state: InspectionState, isLoading: boolean) {
    state.isLoading = isLoading;
  },
  setError(state: InspectionState, error: string | null) {
    state.error = error;
  },
  setSearchCriteria(state: InspectionState, criteria: any) {
    state.searchCriteria = criteria;
  },
  setStats(state: InspectionState, stats: any) {
    state.totalCount = stats.total || 0;
    state.availableCount = stats.available || 0;
    state.inProgressCount = stats.inProgress || 0;
    state.completedCount = stats.completed || 0;
  }
};

const actions = {
  async searchInspections({ commit }: any, criteria: any) {
    try {
      commit('setLoading', true);
      commit('setError', null);

      const service = getInspectionService();
      const results = await service.searchInspections(criteria);
      
      commit('setInspections', results);
      commit('setSearchCriteria', criteria);
      logger.info(`Found ${results.length} inspections`);
    } catch (error) {
      const message = (error as Error).message;
      commit('setError', message);
      logger.error('Search failed', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async getInspectionDetail({ commit }: any, allInspectionSchedulingId: number) {
    try {
      commit('setLoading', true);
      commit('setError', null);

      const service = getInspectionService();
      const inspection = await service.getInspectionDetail(allInspectionSchedulingId);
      
      commit('setCurrentInspection', inspection);
      logger.info(`Retrieved inspection ${allInspectionSchedulingId}`);
    } catch (error) {
      const message = (error as Error).message;
      commit('setError', message);
      logger.error('Get inspection failed', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async updateInspectionStatus({ commit, state }: any, { allInspectionSchedulingId, status }: any) {
    try {
      commit('setLoading', true);
      commit('setError', null);

      const service = getInspectionService();
      await service.updateInspectionScheduling(allInspectionSchedulingId, {
        inspectionStatus: status
      });

      // Update the current inspection in state
      if (state.currentInspection && state.currentInspection.allInspectionSchedulingId === allInspectionSchedulingId) {
        commit('setCurrentInspection', {
          ...state.currentInspection,
          inspectionStatus: status
        });
      }

      logger.info(`Updated inspection status to ${status}`);
    } catch (error) {
      const message = (error as Error).message;
      commit('setError', message);
      logger.error('Failed to update inspection status', error);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async loadDashboardData({ commit }: any) {
    try {
      commit('setLoading', true);
      
      const service = getInspectionService();
      const [
        total,
        available,
        inProgress,
        completed
      ] = await Promise.all([
        service.getInspectionsCount(),
        service.getInspectionsByStatus(0),
        service.getInspectionsByStatus(1),
        service.getInspectionsByStatus(2)
      ]);

      commit('setStats', {
        total,
        available: available.length,
        inProgress: inProgress.length,
        completed: completed.length
      });

      logger.info('Dashboard data loaded');
    } catch (error) {
      logger.error('Failed to load dashboard data', error);
    } finally {
      commit('setLoading', false);
    }
  },

  async updateActionItem({ commit, state }: any, { actionItemId, data }: any) {
    try {
      commit('setLoading', true);
      commit('setError', null);

      const service = getInspectionService();
      await service.updateActionItem(actionItemId, data);

      // Update the action item in the current inspection
      if (state.currentInspection && state.currentInspection.actionItems) {
        const itemIndex = state.currentInspection.actionItems.findIndex(
          (item: any) => item.actionItemId === actionItemId
        );
        if (itemIndex !== -1) {
          const updatedItems = [...state.currentInspection.actionItems];
          updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...data };
          commit('setCurrentInspection', {
            ...state.currentInspection,
            actionItems: updatedItems
          });
        }
      }

      logger.info(`Updated action item ${actionItemId}`);
    } catch (error) {
      const message = (error as Error).message;
      commit('setError', message);
      logger.error('Failed to update action item', error);
      throw error;
    } finally {
      commit('setLoading', false);
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
