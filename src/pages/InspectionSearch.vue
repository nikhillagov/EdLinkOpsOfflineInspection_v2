<template>
  <div class="inspection-search">
    <div class="search-header">
      <h1>Search Inspections</h1>
      <p class="subtitle">Find and manage your inspections</p>
    </div>

    <!-- Search Filters -->
    <div class="search-filters">
      <div class="filter-group">
        <label>Entity/Center Name</label>
        <input 
          v-model="searchCriteria.entityName"
          type="text"
          placeholder="Search by name..."
          @input="debounceSearch"
          class="form-input">
      </div>

      <div class="filter-group">
        <label>License Number</label>
        <input 
          v-model="searchCriteria.licenseNumber"
          type="text"
          placeholder="Search by license..."
          @input="debounceSearch"
          class="form-input">
      </div>

      <div class="filter-group">
        <label>Inspection Type</label>
        <select v-model="searchCriteria.actionRequestTypeName" @change="performSearch" class="form-select">
          <option value="">All Types</option>
          <option value="Initial Inspection">Initial Inspection</option>
          <option value="Annual Inspection">Annual Inspection</option>
          <option value="Complaint Inspection">Complaint Inspection</option>
          <option value="Incident Inspection">Incident Inspection</option>
          <option value="Follow Up">Follow Up</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Status</label>
        <select v-model.number="searchCriteria.statusId" @change="performSearch" class="form-select">
          <option value="">All Statuses</option>
          <option value="0">Not Started</option>
          <option value="1">In Progress</option>
          <option value="2">Completed</option>
        </select>
      </div>

      <button @click="clearFilters" class="btn-clear">Clear Filters</button>
    </div>

    <!-- Search Results -->
    <div class="search-results">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Searching inspections...</p>
      </div>

      <div v-else-if="inspections.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No inspections found</h3>
        <p>Try adjusting your search filters</p>
      </div>

      <div v-else class="inspections-list">
        <div 
          v-for="inspection in inspections" 
          :key="inspection.allInspectionSchedulingId"
          @click="openInspection(inspection)"
          class="inspection-item">
          <div class="inspection-header">
            <h3>{{ inspection.entityName }}</h3>
            <span class="license-badge">{{ inspection.licenseNumber }}</span>
          </div>
          <div class="inspection-meta">
            <span class="meta-item">
              <strong>Type:</strong> {{ inspection.inspectionType }}
            </span>
            <span class="meta-item">
              <strong>Status:</strong> 
              <span :class="getStatusClass(inspection.inspectionStatus)">
                {{ getStatusLabel(inspection.inspectionStatus) }}
              </span>
            </span>
            <span class="meta-item" v-if="inspection.dueDate">
              <strong>Due:</strong> {{ formatDate(inspection.dueDate) }}
            </span>
          </div>
          <div class="inspection-arrow">→</div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="hasMore" class="pagination">
        <button @click="loadMore" class="btn-load-more">
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  name: 'InspectionSearch',
  data() {
    return {
      searchCriteria: {
        entityName: '',
        licenseNumber: '',
        actionRequestTypeName: '',
        statusId: ''
      },
      currentOffset: 0,
      hasMore: true,
      searchTimeout: null as NodeJS.Timeout | null
    };
  },
  computed: {
    ...mapState('inspection', ['inspections', 'isLoading', 'error'])
  },
  methods: {
    ...mapActions('inspection', ['searchInspections']),
    debounceSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    async performSearch() {
      this.currentOffset = 0;
      await this.searchInspections({
        ...this.searchCriteria,
        limit: 50,
        offset: 0
      });
      this.hasMore = (this.$store.state.inspection.inspections || []).length >= 50;
    },
    async loadMore() {
      this.currentOffset += 50;
      await this.searchInspections({
        ...this.searchCriteria,
        limit: 50,
        offset: this.currentOffset
      });
      this.hasMore = (this.$store.state.inspection.inspections || []).length >= 50;
    },
    clearFilters() {
      this.searchCriteria = {
        entityName: '',
        licenseNumber: '',
        actionRequestTypeName: '',
        statusId: ''
      };
      this.performSearch();
    },
    openInspection(inspection: any) {
      this.$router.push({
        name: 'InspectionDetail',
        params: { id: inspection.allInspectionSchedulingId }
      });
    },
    getStatusLabel(statusId: number): string {
      const statuses: { [key: number]: string } = {
        0: 'Not Started',
        1: 'In Progress',
        2: 'Completed'
      };
      return statuses[statusId] || 'Unknown';
    },
    getStatusClass(statusId: number): string {
      const classes: { [key: number]: string } = {
        0: 'status-not-started',
        1: 'status-in-progress',
        2: 'status-completed'
      };
      return classes[statusId] || '';
    },
    formatDate(date: Date | string): string {
      return new Date(date).toLocaleDateString();
    }
  },
  created() {
    this.performSearch();
  }
});
</script>

<style scoped>
.inspection-search {
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 30px;
}

.search-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.search-filters {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007c8a;
  box-shadow: 0 0 0 3px rgba(0, 124, 138, 0.1);
}

.btn-clear {
  background: #f0f0f0;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  font-size: 14px;
  font-weight: 500;
}

.btn-clear:hover {
  background: #e0e0e0;
}

.search-results {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007c8a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 15px 0 10px 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.inspections-list {
  divide-y: 1px solid #eee;
}

.inspection-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspection-item:hover {
  background-color: #f5f5f5;
}

.inspection-header {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.inspection-header h3 {
  margin: 0;
  color: #007c8a;
  font-size: 16px;
  font-weight: 600;
}

.license-badge {
  background: #e8f4f8;
  color: #007c8a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.inspection-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: #666;
}

.meta-item strong {
  color: #333;
  margin-right: 5px;
}

.meta-item span {
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.status-not-started {
  background: #e2e3e5;
  color: #383d41;
}

.status-in-progress {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.inspection-arrow {
  color: #007c8a;
  font-size: 20px;
  margin-left: 20px;
}

.pagination {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #eee;
}

.btn-load-more {
  background-color: #007c8a;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-load-more:hover {
  background-color: #005a66;
}
</style>
