<template>
  <Card :title="title" elevated>
    <div class="license-card">
      <div class="license-header">
        <div class="license-info">
          <h4 class="license-number">{{ license.licenseNumber }}</h4>
          <p class="license-type">{{ license.type }}</p>
        </div>
        <Badge :variant="getStatusVariant(license.status)">
          {{ license.status }}
        </Badge>
      </div>

      <Divider />

      <div class="license-details">
        <div class="detail-item">
          <span class="detail-label">Entity:</span>
          <span class="detail-value">{{ license.entityName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Issue Date:</span>
          <span class="detail-value">{{ formatDate(license.issueDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Expiration Date:</span>
          <span class="detail-value" :class="getExpirationClass(license.expirationDate)">
            {{ formatDate(license.expirationDate) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Certification Level:</span>
          <span class="detail-value">{{ license.certificationLevel }}</span>
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

interface License {
  id: number;
  licenseNumber: string;
  type: string;
  entityName: string;
  status: string;
  issueDate: Date | string | null;
  expirationDate: Date | string | null;
  certificationLevel: string;
}

interface Props {
  license: License;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'License'
});

defineEmits<{
  view: [];
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Active': 'success',
    'Expired': 'danger',
    'Suspended': 'warning',
    'Revoked': 'danger',
    'Pending': 'info'
  };
  return variants[status] || 'secondary';
};

const getExpirationClass = (expirationDate: Date | string | null) => {
  if (!expirationDate) return '';
  const d = new Date(expirationDate);
  const today = new Date();
  const daysUntilExpiry = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry < 30 ? 'expiration-warning' : '';
};

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.license-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.license-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.license-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.license-number {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  font-family: monospace;
}

.license-type {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.license-details {
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

.detail-value.expiration-warning {
  color: #dc3545;
  font-weight: 500;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
