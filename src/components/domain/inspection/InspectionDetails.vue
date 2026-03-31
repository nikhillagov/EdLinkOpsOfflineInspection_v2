<template>
  <Card title="Inspection Details" elevated>
    <div class="inspection-details-content">
      <div class="details-section">
        <h5 class="section-title">Basic Information</h5>
        <div class="detail-item">
          <span class="detail-label">Inspection Type:</span>
          <span class="detail-value">{{ inspection.inspectionType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <Badge :variant="getStatusVariant(inspection.status)">
            {{ inspection.status }}
          </Badge>
        </div>
        <div class="detail-item">
          <span class="detail-label">Due Date:</span>
          <span class="detail-value">{{ formatDate(inspection.dueDate) }}</span>
        </div>
      </div>

      <Divider />

      <div class="details-section">
        <h5 class="section-title">Entity Information</h5>
        <div class="detail-item">
          <span class="detail-label">Entity Name:</span>
          <span class="detail-value">{{ inspection.entityName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">License Number:</span>
          <span class="detail-value">{{ inspection.licenseNumber }}</span>
        </div>
      </div>

      <Divider />

      <div class="details-section">
        <h5 class="section-title">Findings & Observations</h5>
        <div v-if="inspection.findings && inspection.findings.length > 0" class="findings-list">
          <div
            v-for="(finding, index) in inspection.findings"
            :key="index"
            class="finding-item"
          >
            <Badge :variant="getSeverityVariant(finding.severity)" size="sm">
              {{ finding.severity }}
            </Badge>
            <span>{{ finding.description }}</span>
          </div>
        </div>
        <p v-else class="empty-text">No findings recorded.</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import Badge from '@/components/common/Badge.vue';
import Divider from '@/components/common/Divider.vue';

interface Finding {
  severity: string;
  description: string;
}

interface Inspection {
  allInspectionSchedulingId: number;
  inspectionType: string;
  status: string;
  dueDate: Date | string | null;
  entityName: string;
  licenseNumber: string;
  findings?: Finding[];
}

defineProps<{
  inspection: Inspection;
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Scheduled': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
  };
  return variants[status] || 'secondary';
};

const getSeverityVariant = (severity: string) => {
  const variants: Record<string, any> = {
    'Critical': 'danger',
    'Major': 'warning',
    'Minor': 'info',
    'Note': 'secondary'
  };
  return variants[severity] || 'secondary';
};

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.inspection-details-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 150px;
}

.detail-value {
  color: #333;
  flex: 1;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.finding-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #ddd;
}

.empty-text {
  margin: 0;
  color: #999;
  font-size: 14px;
}
</style>
