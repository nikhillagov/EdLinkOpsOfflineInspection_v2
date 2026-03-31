<template>
  <Card title="Action Request" elevated>
    <div class="action-request-content">
      <div class="request-header">
        <div class="request-info">
          <h4 class="request-title">{{ actionRequest.requestType }}</h4>
          <p class="request-entity">{{ actionRequest.entityName }}</p>
        </div>
        <Badge :variant="getStatusVariant(actionRequest.status)">
          {{ actionRequest.status }}
        </Badge>
      </div>

      <Divider />

      <div class="request-details">
        <div class="detail-item">
          <span class="detail-label">Request ID:</span>
          <span class="detail-value">{{ actionRequest.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Due Date:</span>
          <span class="detail-value">{{ formatDate(actionRequest.dueDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Priority:</span>
          <Badge :variant="getPriorityVariant(actionRequest.priority)" size="sm">
            {{ actionRequest.priority }}
          </Badge>
        </div>
      </div>

      <div v-if="actionRequest.violations && actionRequest.violations.length > 0" class="violations-section">
        <Divider />
        <h5 class="section-title">Violations</h5>
        <div class="violations-list">
          <div
            v-for="(violation, index) in actionRequest.violations"
            :key="index"
            class="violation-item"
          >
            <Badge variant="danger" size="sm">{{ violation.type }}</Badge>
            <span>{{ violation.description }}</span>
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

interface Violation {
  type: string;
  description: string;
}

interface ActionRequest {
  id: number;
  requestType: string;
  entityName: string;
  status: string;
  dueDate: Date | string | null;
  priority: string;
  violations?: Violation[];
}

defineProps<{
  actionRequest: ActionRequest;
}>();

defineEmits<{
  view: [];
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Resolved': 'success',
    'Overdue': 'danger'
  };
  return variants[status] || 'secondary';
};

const getPriorityVariant = (priority: string) => {
  const variants: Record<string, any> = {
    'High': 'danger',
    'Medium': 'warning',
    'Low': 'info'
  };
  return variants[priority] || 'secondary';
};

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.action-request-content {
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
  min-width: 120px;
}

.detail-value {
  color: #333;
}

.violations-section {
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

.violations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.violation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #fff5f5;
  border-radius: 4px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
