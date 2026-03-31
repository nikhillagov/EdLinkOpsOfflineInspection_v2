<template>
  <Card :title="title" elevated>
    <div class="document-item">
      <div class="document-header">
        <div class="document-info">
          <h4 class="document-name">{{ document.name }}</h4>
          <p class="document-type">{{ document.type }}</p>
        </div>
        <Badge v-if="document.verified" variant="success" size="sm">
          ✓ Verified
        </Badge>
      </div>

      <Divider />

      <div class="document-details">
        <div class="detail-item">
          <span class="detail-label">Document ID:</span>
          <span class="detail-value">{{ document.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Upload Date:</span>
          <span class="detail-value">{{ formatDate(document.uploadDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">File Size:</span>
          <span class="detail-value">{{ formatFileSize(document.fileSize) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <Badge :variant="getStatusVariant(document.status)" size="sm">
            {{ document.status }}
          </Badge>
        </div>
      </div>

      <div v-if="document.expirationDate" class="expiration-section">
        <Divider />
        <div class="detail-item">
          <span class="detail-label">Expiration Date:</span>
          <span class="detail-value" :class="getExpirationClass(document.expirationDate)">
            {{ formatDate(document.expirationDate) }}
          </span>
        </div>
      </div>

      <div class="footer-actions">
        <Button
          label="Download"
          variant="secondary"
          size="sm"
          @click="$emit('download')"
        />
        <Button
          label="View"
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

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
  uploadDate: Date | string | null;
  expirationDate?: Date | string | null;
  fileSize: number;
  verified?: boolean;
}

interface Props {
  document: Document;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Document'
});

defineEmits<{
  view: [];
  download: [];
}>();

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    'Approved': 'success',
    'Pending Review': 'warning',
    'Rejected': 'danger',
    'Archived': 'secondary'
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
.document-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.document-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  word-break: break-word;
}

.document-type {
  margin: 0;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
}

.document-details {
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
  min-width: 130px;
}

.detail-value {
  color: #333;
}

.detail-value.expiration-warning {
  color: #dc3545;
  font-weight: 500;
}

.expiration-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
