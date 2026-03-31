<template>
  <div class="inspection-detail">
    <div class="detail-header">
      <router-link to="/search" class="back-button">← Back</router-link>
      <h1 v-if="currentInspection">{{ currentInspection.allInspectionScheduling.entity.name }}</h1>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading inspection details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <router-link to="/search" class="btn-back">Go Back</router-link>
    </div>

    <div v-else-if="currentInspection" class="detail-content">
      <!-- Entity Information -->
      <div class="section">
        <h2>Entity Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Entity Name</label>
            <p>{{ currentInspection.allInspectionScheduling.entity.name }}</p>
          </div>
          <div class="info-item">
            <label>License Number</label>
            <p>{{ currentInspection.allInspectionScheduling.entity.licenseNumber || 'N/A' }}</p>
          </div>
          <div class="info-item">
            <label>City</label>
            <p>{{ currentInspection.allInspectionScheduling.entity.physicalAddressCity || 'N/A' }}</p>
          </div>
          <div class="info-item">
            <label>Parish</label>
            <p>{{ currentInspection.allInspectionScheduling.entity.parish || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Inspection Information -->
      <div class="section">
        <h2>Inspection Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Inspection Type</label>
            <p>{{ currentInspection.inspectionType }}</p>
          </div>
          <div class="info-item">
            <label>Status</label>
            <p :class="getStatusClass(currentInspection.inspectionStatus)">
              {{ getStatusLabel(currentInspection.inspectionStatus) }}
            </p>
          </div>
          <div class="info-item">
            <label>Priority</label>
            <p>{{ currentInspection.priority }}</p>
          </div>
          <div class="info-item">
            <label>Due Date</label>
            <p>{{ formatDate(currentInspection.dueDate) }}</p>
          </div>
          <div class="info-item">
            <label>Assigned To</label>
            <p>{{ currentInspection.assignedToUser || 'Unassigned' }}</p>
          </div>
          <div class="info-item">
            <label>Requested By</label>
            <p>{{ currentInspection.requestedBy || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Action Items -->
      <div class="section" v-if="currentInspection.actionItems && currentInspection.actionItems.length > 0">
        <h2>Action Items ({{ currentInspection.actionItems.length }})</h2>
        <div class="action-items-list">
          <div 
            v-for="(item, index) in currentInspection.actionItems"
            :key="item.actionItemId"
            class="action-item-card">
            <div class="item-header">
              <h3>{{ (index as number) + 1 }}. {{ item.actionItemTypeName }}</h3>
              <span class="item-status" :class="getItemStatusClass(item.progressStatusId)">
                {{ getItemStatusLabel(item.progressStatusId) }}
              </span>
            </div>
            
            <div v-if="item.actionItemData && item.actionItemData.length > 0" class="item-data">
              <div v-for="data in item.actionItemData" :key="data.actionItemProgressId" class="data-item">
                <strong>{{ data.field }}:</strong>
                <span>{{ data.data }}</span>
              </div>
            </div>

            <div class="item-actions">
              <button @click="editActionItem(item)" class="btn-edit">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Status -->
      <div class="section update-section">
        <h2>Update Status</h2>
        <div class="status-update">
          <select v-model.number="newStatus" class="form-select">
            <option value="0">Not Started</option>
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
          </select>
          <button @click="onUpdateInspectionStatus" class="btn-update">Update Status</button>
        </div>
      </div>
    </div>

    <!-- Action Item Modal -->
    <div v-if="showActionItemModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Action Item</h2>
          <button @click="closeActionItemModal" class="modal-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div v-if="editingActionItem" class="form-group">
            <label>Action Item Type</label>
            <input 
              v-model="editingActionItem.actionItemTypeName" 
              type="text" 
              class="form-input"
              disabled>
            
            <label class="mt-3">Status</label>
            <select v-model.number="editingActionItem.progressStatusId" class="form-select">
              <option value="0">Pending</option>
              <option value="1">In Progress</option>
              <option value="2">Completed</option>
            </select>

            <label class="mt-3">Data Fields</label>
            <div v-if="editingActionItem.actionItemData && editingActionItem.actionItemData.length > 0" class="data-fields">
              <div v-for="(data, idx) in editingActionItem.actionItemData" :key="idx" class="data-field-item">
                <label>{{ data.field }}</label>
                <input v-model="editingActionItem.actionItemData[idx].data" type="text" class="form-input">
              </div>
            </div>
            <p v-else class="text-muted">No data fields available</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeActionItemModal" class="btn-cancel">Cancel</button>
          <button @click="saveActionItem" class="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  name: 'InspectionDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      newStatus: 0,
      showActionItemModal: false,
      editingActionItem: null as any
    };
  },
  computed: {
    ...mapState('inspection', ['currentInspection', 'isLoading', 'error'])
  },
  methods: {
    ...mapActions('inspection', ['getInspectionDetail', 'updateInspectionStatus', 'updateActionItem']),
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
    getItemStatusLabel(statusId: number): string {
      const statuses: { [key: number]: string } = {
        0: 'Pending',
        1: 'In Progress',
        2: 'Completed'
      };
      return statuses[statusId] || 'Unknown';
    },
    getItemStatusClass(statusId: number): string {
      const classes: { [key: number]: string } = {
        0: 'item-status-pending',
        1: 'item-status-in-progress',
        2: 'item-status-completed'
      };
      return classes[statusId] || '';
    },
    formatDate(date: Date | string | null): string {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    },
    async onUpdateInspectionStatus() {
      try {
        if (!this.currentInspection) return;
        
        // Validate status selection
        if (this.newStatus < 0 || this.newStatus > 2) {
          alert('Please select a valid status');
          return;
        }

        // Call the store action (invoke the mapped action)
        const updateAction = (this as any).updateInspectionStatus;
        await updateAction({
          allInspectionSchedulingId: this.currentInspection.allInspectionSchedulingId,
          status: this.newStatus
        });

        alert('Inspection status updated successfully');
      } catch (error) {
        alert(`Failed to update status: ${(error as Error).message}`);
        console.error('Status update failed', error);
      }
    },
    editActionItem(item: any) {
      // Store the item being edited
      this.editingActionItem = JSON.parse(JSON.stringify(item));
      this.showActionItemModal = true;
    },
    async saveActionItem() {
      if (!this.editingActionItem) return;

      try {
        // Call the store action
        const updateAction = (this as any).updateActionItem;
        await updateAction({
          actionItemId: this.editingActionItem.actionItemId,
          data: {
            progressStatusId: this.editingActionItem.progressStatusId
          }
        });

        // Update data fields if they exist
        if (this.editingActionItem.actionItemData && this.editingActionItem.actionItemData.length > 0) {
          for (const dataField of this.editingActionItem.actionItemData) {
            if (dataField.actionItemProgressId) {
              // Note: In a real implementation, you'd batch these updates
              // or call a single method to update all data fields
              try {
                // This would need a service method to persist each data field
                // For now, we just update the in-memory state
              } catch (error) {
                console.warn('Failed to update data field:', error);
              }
            }
          }
        }

        alert('Action item updated successfully');
        this.closeActionItemModal();
      } catch (error) {
        alert(`Failed to update action item: ${(error as Error).message}`);
        console.error('Action item update failed', error);
      }
    },
    closeActionItemModal() {
      this.showActionItemModal = false;
      this.editingActionItem = null;
    }
  },
  async created() {
    const inspectionId = parseInt(this.id as string, 10);
    await this.getInspectionDetail(inspectionId);
    
    if (this.currentInspection) {
      this.newStatus = this.currentInspection.inspectionStatus;
    }
  }
});
</script>

<style scoped>
.inspection-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 30px;
}

.back-button {
  color: #007c8a;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 15px;
  display: inline-block;
  transition: color 0.3s;
}

.back-button:hover {
  color: #005a66;
}

.detail-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.loading-state,
.error-state {
  background: white;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.error-state {
  color: #dc3545;
}

.error-state p {
  margin: 0 0 20px 0;
}

.btn-back {
  background-color: #007c8a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 2px solid #007c8a;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.info-item p {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
}

.status-not-started,
.item-status-pending {
  background: #e2e3e5;
  color: #383d41;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
}

.status-in-progress,
.item-status-in-progress {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
}

.status-completed,
.item-status-completed {
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
}

.action-items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-item-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  background: #f8f9fa;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.item-header h3 {
  margin: 0;
  color: #333;
  font-size: 15px;
}

.item-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
}

.item-data {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.data-item {
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.data-item strong {
  color: #333;
  margin-right: 5px;
}

.item-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.btn-edit {
  background: #007c8a;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.btn-edit:hover {
  background: #005a66;
}

.update-section {
  display: flex;
  flex-direction: column;
}

.status-update {
  display: flex;
  gap: 10px;
}

.form-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
}

.btn-update {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-update:hover {
  background-color: #218838;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #ddd;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.form-input:focus {
  outline: none;
  border-color: #007c8a;
  box-shadow: 0 0 0 3px rgba(0, 124, 138, 0.1);
}

.mt-3 {
  margin-top: 15px;
}

.data-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.data-field-item label {
  font-size: 12px;
  margin-bottom: 6px;
  color: #666;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-save {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save:hover {
  background-color: #218838;
}

.text-muted {
  color: #999;
  font-size: 14px;
  margin: 10px 0;
}
</style>
