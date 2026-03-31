<template>
  <Card title="Service Request" elevated>
    <div class="service-request-content">
      <div class="request-header">
        <div class="request-info">
          <h4 class="request-title">{{ serviceRequest.type }}</h4>
          <p class="request-entity">{{ serviceRequest.entityName }}</p>
        </div>
        <Badge :variant="getStatusVariant(serviceRequest.status)">
          {{ serviceRequest.status }}
        </Badge>
      </div>

      <Divider />

      <div class="request-details">
        <div class="detail-item">
          <span class="detail-label">Request ID:</span>
          <span class="detail-value">{{ serviceRequest.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Submission Date:</span>
          <span class="detail-value">{{ formatDate(serviceRequest.submissionDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Expected Completion:</span>
          <span class="detail-value">{{ formatDate(serviceRequest.expectedCompletion) }}</span>
        </div>
      </div>

      <div v-if="serviceRequest.description" class="description-section">
        <Divider />
        <h5 class="section-title">Description</h5>
        <p class="description-text">{{ serviceRequest.description }}</p>
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

interface ServiceRequest {
  id: number;
  type: string;
  entityName: string;
  status: string;
  submissionDate: Date | string | null;
  expectedCompletion: Date | string | null;
  description?: string;
}

defineProps<{
  serviceRequest: ServiceRequest;
}>();

defineEmits<{
  view: [];
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Submitted': 'info',
    'Processing': 'warning',
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
.service-request-content {
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

.description-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
