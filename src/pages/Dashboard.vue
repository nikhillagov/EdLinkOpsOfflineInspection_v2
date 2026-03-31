<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p class="subtitle">Welcome to EdLink Offline Inspection Tool</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon available">📊</div>
        <div class="stat-content">
          <p class="stat-label">Available Inspections</p>
          <p class="stat-value">{{ stats.available }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon in-progress">⏳</div>
        <div class="stat-content">
          <p class="stat-label">In Progress</p>
          <p class="stat-value">{{ stats.inProgress }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon completed">✅</div>
        <div class="stat-content">
          <p class="stat-label">Completed</p>
          <p class="stat-value">{{ stats.completed }}</p>
        </div>
      </div>

      <div class="stat-card" :class="{ alert: pendingSyncCount > 0 }">
        <div class="stat-icon pending">🔄</div>
        <div class="stat-content">
          <p class="stat-label">Pending Sync</p>
          <p class="stat-value">{{ pendingSyncCount }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link to="/search" class="action-button primary">
        <span>🔍 Search Inspections</span>
      </router-link>
      <button @click="manualSync" :disabled="isSyncing" class="action-button secondary">
        <span>{{ isSyncing ? '⏳ Syncing...' : '📤 Sync Now' }}</span>
      </button>
    </div>

    <!-- Info Sections -->
    <div class="info-section">
      <h2>Getting Started</h2>
      <div class="info-content">
        <div class="info-card">
          <h3>📋 How to Use</h3>
          <ol>
            <li>Use the <strong>Search</strong> page to find inspections</li>
            <li>Click on an inspection to view details</li>
            <li>Complete action items offline</li>
            <li>Changes are automatically queued for sync when online</li>
          </ol>
        </div>

        <div class="info-card">
          <h3>🌐 Online/Offline Status</h3>
          <p>The application works completely offline. When you return online, changes are automatically synchronized with the server.</p>
          <p>Current Status: <strong :class="{ online: isOnline, offline: !isOnline }">{{ isOnline ? '🟢 Online' : '🔴 Offline' }}</strong></p>
        </div>

        <div class="info-card">
          <h3>💾 Local Storage</h3>
          <p>All inspection data is stored locally on your machine. Your data is secure and accessible even without internet.</p>
        </div>
      </div>
    </div>

    <!-- Sync Status -->
    <div class="sync-status" v-if="syncMetadata">
      <h3>Sync Information</h3>
      <div class="sync-details">
        <p><strong>Last Sync:</strong> {{ formatDate(syncMetadata.lastSyncTime) }}</p>
        <p><strong>Total Synced:</strong> {{ syncMetadata.totalRecordsSynced }}</p>
        <p><strong>Total Failures:</strong> {{ syncMetadata.totalFailures }}</p>
        <p><strong>Status:</strong> <span :class="syncMetadata.lastSyncStatus?.toLowerCase()">{{ syncMetadata.lastSyncStatus }}</span></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  name: 'Dashboard',
  computed: {
    ...mapState('inspection', {
      stats: state => ({
        total: state.totalCount,
        available: state.availableCount,
        inProgress: state.inProgressCount,
        completed: state.completedCount
      })
    }),
    ...mapState('sync', [
      'isOnline',
      'pendingSyncCount',
      'isSyncing',
      'syncMetadata'
    ])
  },
  methods: {
    ...mapActions('sync', ['performManualSync']),
    async manualSync() {
      await this.performManualSync();
    },
    formatDate(date: Date | null): string {
      if (!date) return 'Never';
      return new Date(date).toLocaleString();
    }
  },
  created() {
    this.$store.dispatch('inspection/loadDashboardData');
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card.alert {
  border-left: 4px solid #dc3545;
  background-color: #fff5f5;
}

.stat-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #007c8a;
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-button.primary {
  background-color: #007c8a;
  color: white;
}

.action-button.primary:hover {
  background-color: #005a66;
}

.action-button.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.action-button.secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007c8a;
}

.info-card h3 {
  margin: 0 0 15px 0;
  color: #007c8a;
  font-size: 16px;
}

.info-card ol {
  padding-left: 20px;
  margin: 0;
}

.info-card li {
  margin-bottom: 10px;
  color: #555;
}

.info-card p {
  margin: 10px 0;
  color: #555;
  line-height: 1.6;
}

.sync-status {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sync-status h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.sync-details {
  display: grid;
  gap: 10px;
}

.sync-details p {
  margin: 0;
  color: #666;
}

.sync-details strong {
  color: #333;
}

.sync-details span.success {
  color: #28a745;
  font-weight: 600;
}

.sync-details span.failed {
  color: #dc3545;
  font-weight: 600;
}

.online {
  color: #28a745;
}

.offline {
  color: #dc3545;
}
</style>
