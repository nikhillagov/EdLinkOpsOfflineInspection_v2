<template>
  <AppLayout>
    <PageLayout title="Inspections" subtitle="Manage and track all inspections">
      <template #actions>
        <Button label="New Inspection" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <InspectionSearch @search="handleSearch" />
      </Card>

      <!-- Results -->
      <Card :title="`Results (${filteredInspections.length})`">
        <div v-if="filteredInspections.length" class="results-grid">
          <InspectionCard
            v-for="inspection in filteredInspections"
            :key="inspection.allInspectionSchedulingId"
            :inspection="inspection"
            @view="handleViewInspection(inspection)"
          />
        </div>
        <EmptyState
          v-else
          icon="inbox"
          title="No Inspections Found"
          message="Create a new inspection or adjust your search criteria"
        />
      </Card>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-wrapper">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </PageLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  AppLayout,
  PageLayout,
  Card,
  Button,
  InspectionSearch,
  InspectionCard,
  EmptyState,
  Pagination
} from '@/components';

const router = useRouter();
const store = useStore();
const route = useRoute();

const inspections = ref<Inspection[]>([]);
const filters = ref<any>({});
const currentPage = ref(1);
const pageSize = ref(10);

const filteredInspections = computed(() => {
  let filtered = [...inspections.value];

  if (filters.value.status) {
    filtered = filtered.filter(i => i.inspectionStatus === filters.value.status);
  }
  if (filters.value.entityName) {
    filtered = filtered.filter(i =>
      i.entityName?.toLowerCase().includes(filters.value.entityName.toLowerCase())
    );
  }
  if (filters.value.type) {
    filtered = filtered.filter(i => i.inspectionType === filters.value.type);
  }

  return filtered.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const totalPages = computed(() => {
  return Math.ceil(inspections.value.length / pageSize.value);
});

onMounted(async () => {
  await loadInspections();
  if (route.query.status) {
    filters.value = { status: route.query.status as string };
  }
});

const loadInspections = async () => {
  try {
    await store.dispatch('inspection/searchInspections', {});
    inspections.value = store.state.inspection?.inspections || [];
  } catch (error) {
    console.error('Failed to load inspections:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
  currentPage.value = 1;
};

const handleNew = async () => {
  await router.push('/inspections/new');
};

const handleViewInspection = async (inspection: any) => {
  await router.push(`/inspections/${inspection.allInspectionSchedulingId}`);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
