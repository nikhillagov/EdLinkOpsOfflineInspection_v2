<template>
  <AppLayout>
    <PageLayout title="VOR Requests" subtitle="Verification of Records requests">
      <template #actions>
        <Button label="New VOR Request" variant="primary" @click="handleNew" />
      </template>

      <!-- Status Summary -->
      <Card title="VOR Status Summary">
        <div class="status-summary">
          <div class="status-item">
            <span class="status-label">Pending</span>
            <span class="status-value pending">{{ pendingCount }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">In Progress</span>
            <span class="status-value progress">{{ inProgressCount }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Verified</span>
            <span class="status-value verified">{{ verifiedCount }}</span>
          </div>
        </div>
      </Card>

      <!-- Results -->
      <Card :title="`VOR Requests (${vorRequests.length})`">
        <div v-if="vorRequests.length" class="vor-list">
          <VORRequestCard v-for="vor in vorRequests" :key="vor.id" :vor-request="vor" />
        </div>
        <EmptyState
          v-else
          icon="file-check"
          title="No VOR Requests"
          message="Create a new VOR request or wait for submissions"
        />
      </Card>
    </PageLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  AppLayout,
  PageLayout,
  Card,
  Button,
  VORRequestCard,
  EmptyState
} from '@/components';
import type { VORRequest } from '@/types/commonTypeDefinition';

const router = useRouter();
const store = useStore();

const vorRequests = ref<VORRequest[]>([]);

const pendingCount = computed(() => {
  return vorRequests.value.filter(v => v.status === 'pending').length;
});

const inProgressCount = computed(() => {
  return vorRequests.value.filter(v => v.status === 'in-progress').length;
});

const verifiedCount = computed(() => {
  return vorRequests.value.filter(v => v.status === 'verified').length;
});

onMounted(async () => {
  await loadVORRequests();
});

const loadVORRequests = async () => {
  try {
    const state = store.state.vor;
    vorRequests.value = state?.vorRequests || [];
  } catch (error) {
    console.error('Failed to load VOR requests:', error);
  }
};

const handleNew = async () => {
  await router.push('/vor-requests/new');
};
</script>

<style scoped>
.status-summary {
  display: flex;
  gap: 24px;
  justify-content: space-around;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.status-label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
}

.status-value {
  font-size: 28px;
  font-weight: 700;
}

.status-value.pending {
  color: #ffc107;
}

.status-value.progress {
  color: #007bff;
}

.status-value.verified {
  color: #28a745;
}

.vor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .status-summary {
    flex-direction: column;
  }
}
</style>
