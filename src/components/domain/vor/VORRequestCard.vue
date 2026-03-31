<template>
  <Card title="VOR Request" elevated>
    <div class="vor-request-content">
      <div class="request-header">
        <div class="request-info">
          <h4 class="request-title">Verification of Records</h4>
          <p class="request-entity">{{ vorRequest.entityName }}</p>
        </div>
        <Badge :variant="getStatusVariant(vorRequest.status)">
          {{ vorRequest.status }}
        </Badge>
      </div>

      <Divider />

      <div class="request-details">
        <div class="detail-item">
          <span class="detail-label">Request ID:</span>
          <span class="detail-value">{{ vorRequest.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Request Date:</span>
          <span class="detail-value">{{ formatDate(vorRequest.requestDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Expected Completion:</span>
          <span class="detail-value">{{ formatDate(vorRequest.expectedCompletion) }}</span>
        </div>
      </div>

      <div v-if="vorRequest.findings && vorRequest.findings.length > 0" class="findings-section">
        <Divider />
        <h5 class="section-title">Findings</h5>
        <div class="findings-list">
          <div
            v-for="(finding, index) in vorRequest.findings"
            :key="index"
            class="finding-item"
          >
            <Badge :variant="getStatusVariant(finding.status)" size="sm">
              {{ finding.status }}
            </Badge>
            <span>{{ finding.findingType }}: {{ finding.description }}</span>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <Button
          label="View Details"
          variant="primary"
          size="sm"
          @click="$emit('view')"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import Badge from '@/components/common/Badge.vue';
import Divider from '@/components/common/Divider.vue';
import Button from '@/components/common/Button.vue';

interface Finding {
  status: string;
  findingType: string;
  description: string;
}

interface VORRequest {
  id: number;
  entityName: string;
  status: string;
  requestDate: Date | string | null;
  expectedCompletion: Date | string | null;
  findings?: Finding[];
}

defineProps<{
  vorRequest: VORRequest;
}>();

defineEmits<{
  view: [];
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Submitted': 'info',
    'Approved': 'success',
    'Rejected': 'danger',
    'Completed': 'success'
  };
  return variants[status] || 'secondary';
};

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.vor-request-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.request-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.request-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.request-entity {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 150px;
}

.detail-value {
  color: #333;
}

.findings-section {
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
  background-color: #f0f7ff;
  border-radius: 4px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
