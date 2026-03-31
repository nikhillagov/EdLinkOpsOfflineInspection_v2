<template>
  <AppLayout>
    <PageLayout title="Staff" subtitle="Manage staff members and their information">
      <template #actions>
        <Button label="Add Staff" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <StaffSearch @search="handleSearch" />
      </Card>

      <!-- Results -->
      <Card :title="`Staff Members (${filteredStaff.length})`">
        <div v-if="filteredStaff.length" class="results-grid">
          <StaffCard
            v-for="staff in filteredStaff"
            :key="staff.id"
            :staff-member="staff"
            @click="handleViewStaff(staff)"
          />
        </div>
        <EmptyState
          v-else
          icon="users"
          title="No Staff Found"
          message="Add staff members or adjust your search criteria"
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
  StaffSearch,
  StaffCard,
  EmptyState
} from '@/components';

const router = useRouter();
const store = useStore();

const staff = ref<any[]>([]);
const filters = ref<any>({});

const filteredStaff = computed(() => {
  let filtered = [...staff.value];

  if (filters.value.status) {
    filtered = filtered.filter(s => s.status === filters.value.status);
  }
  if (filters.value.position) {
    filtered = filtered.filter(s => s.position === filters.value.position);
  }

  return filtered;
});

onMounted(async () => {
  await loadStaff();
});

const loadStaff = async () => {
  try {
    const state = store.state.user;
    staff.value = state?.users || [];
  } catch (error) {
    console.error('Failed to load staff:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
};

const handleNew = async () => {
  await router.push('/staff/new');
};

const handleViewStaff = async (staffMember: any) => {
  await router.push(`/staff/${staffMember.id}`);
};
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
