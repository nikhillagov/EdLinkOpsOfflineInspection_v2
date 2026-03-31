<template>
  <Card :title="title" elevated>
    <div class="staff-card">
      <div class="staff-header">
        <div class="staff-info">
          <h4 class="staff-name">{{ staff.name }}</h4>
          <p class="staff-position">{{ staff.position }}</p>
        </div>
        <Badge :variant="staff.active ? 'success' : 'secondary'">
          {{ staff.active ? 'Active' : 'Inactive' }}
        </Badge>
      </div>

      <Divider />

      <div class="staff-details">
        <div class="detail-item">
          <span class="detail-label">Employee ID:</span>
          <span class="detail-value">{{ staff.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">{{ staff.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">{{ staff.phone }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Hire Date:</span>
          <span class="detail-value">{{ formatDate(staff.hireDate) }}</span>
        </div>
      </div>

      <div v-if="staff.certifications && staff.certifications.length > 0" class="certifications-section">
        <Divider />
        <h5 class="section-title">Certifications</h5>
        <div class="certifications-list">
          <Badge
            v-for="cert in staff.certifications"
            :key="cert"
            variant="info"
            size="sm"
          >
            {{ cert }}
          </Badge>
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

interface Staff {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: Date | string | null;
  active: boolean;
  certifications?: string[];
}

interface Props {
  staff: Staff;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Staff Member'
});

defineEmits<{
  view: [];
}>();

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<style scoped>
.staff-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.staff-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.staff-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.staff-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.staff-position {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.staff-details {
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

.certifications-section {
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

.certifications-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
