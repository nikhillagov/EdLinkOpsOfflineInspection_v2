<template>
  <Card :title="title" elevated>
    <div class="entity-card">
      <div class="entity-header">
        <div class="entity-info">
          <h4 class="entity-name">{{ entity.licenseeName }}</h4>
          <p class="entity-facility">{{ entity.facilityName }}</p>
        </div>
        <Badge :variant="entity.status ? 'success' : 'danger'">
          {{ entity.status ? 'Active' : 'Inactive' }}
        </Badge>
      </div>

      <div class="entity-details">
        <div class="detail-row">
          <span class="detail-label">License Type:</span>
          <span class="detail-value">{{ entity.licenseType }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Parish:</span>
          <span class="detail-value">{{ entity.parish }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">License Number:</span>
          <span class="detail-value">{{ entity.licenseNumber }}</span>
        </div>
      </div>

      <div class="entity-footer">
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
import type { EntityModel } from '@/models/entity/entity.model';

interface Props {
  entity: EntityModel;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Entity'
});

defineEmits<{
  view: [];
}>();
</script>

<style scoped>
.entity-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.entity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entity-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.entity-facility {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.entity-details {
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

.entity-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
