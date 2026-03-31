<template>
  <Card :title="title" elevated>
    <div class="inspection-card">
      <div class="inspection-header">
        <div class="inspection-info">
          <h4 class="inspection-type">{{ inspection.inspectionType }}</h4>
          <p class="inspection-entity">{{ inspection.entityName }}</p>
        </div>
        <Badge :variant="getStatusVariant(inspection.inspectionStatus)">
          {{ inspection.inspectionStatus }}
        </Badge>
      </div>
      
      <div class="inspection-details">
        <div class="detail-row">
          <span class="detail-label">License Number:</span>
          <span class="detail-value">{{ inspection.licenseNumber }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date:</span>
          <span class="detail-value">{{ formatDate(inspection.dueDate) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Created:</span>
          <span class="detail-value">{{ formatDate(inspection.createdDate) }}</span>
        </div>
      </div>

      <div class="inspection-footer">
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
import Button from '@/components/common/Button.vue';

interface Inspection {
  allInspectionSchedulingId: number;
  actionRequestId: number;
  entityName: string;
  licenseNumber: string;
  inspectionType: string;
  dueDate: Date | string | null;
  inspectionStatus: string;
  createdDate: Date | string;
}

interface Props {
  inspection: Inspection;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Inspection'
});

defineEmits<{
  view: [];
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

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.inspection-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inspection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.inspection-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.inspection-type {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.inspection-entity {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.inspection-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  color: #333;
}

.inspection-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
