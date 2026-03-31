<template>
  <AppLayout>
    <PageLayout title="Service Requests" subtitle="Track service and support requests">
      <template #actions>
        <Button label="New Service Request" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <ServiceRequestSearch @search="handleSearch" />
      </Card>

      <!-- Results -->
      <Card :title="`Service Requests (${filteredRequests.length})`">
        <div v-if="filteredRequests.length" class="results-list">
          <ServiceRequestCard
            v-for="request in filteredRequests"
            :key="request.id"
            :service-request="request"
          />
        </div>
        <EmptyState
          v-else
          icon="inbox"
          title="No Service Requests Found"
          message="Create a new service request or adjust your filters"
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
  ServiceRequestSearch,
  ServiceRequestCard,
  EmptyState
} from '@/components';
import type { ServiceRequest } from '@/types/commonTypeDefinition';

const router = useRouter();
const store = useStore();

const requests = ref<ServiceRequest[]>([]);
const filters = ref<any>({});

const filteredRequests = computed(() => {
  let filtered = [...requests.value];

  if (filters.value.status) {
    filtered = filtered.filter(r => r.status === filters.value.status);
  }
  if (filters.value.type) {
    filtered = filtered.filter(r => r.serviceType === filters.value.type);
  }
  if (filters.value.entityId) {
    filtered = filtered.filter(r => r.entityId === filters.value.entityId);
  }

  return filtered;
});

onMounted(async () => {
  await loadRequests();
});

const loadRequests = async () => {
  try {
    const state = store.state.serviceRequest;
    requests.value = state?.serviceRequests || [];
  } catch (error) {
    console.error('Failed to load service requests:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
};

const handleNew = async () => {
  await router.push('/service-requests/new');
};
</script>

<style scoped>
.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
