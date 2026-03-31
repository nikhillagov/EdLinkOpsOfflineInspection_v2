<template>
  <AppLayout>
    <PageLayout title="Action Items" subtitle="Track corrective and preventive actions">
      <template #actions>
        <Button label="Create Action" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <ActionRequestSearch @search="handleSearch" />
      </Card>

      <!-- Status Tabs -->
      <Card>
        <Tabs :tabs="statusTabs" v-model="activeTab">
          <template #all>
            <div v-if="allActions.length" class="actions-list">
              <ActionRequestCard v-for="action in allActions" :key="action.id" :action-request="action" />
            </div>
            <EmptyState v-else icon="inbox" title="No Actions" message="Create a new action item" />
          </template>
          <template #pending>
            <div v-if="pendingActions.length" class="actions-list">
              <ActionRequestCard v-for="action in pendingActions" :key="action.id" :action-request="action" />
            </div>
            <EmptyState v-else icon="check" title="All Done" message="No pending actions" />
          </template>
          <template #overdue>
            <div v-if="overdueActions.length" class="actions-list">
              <ActionRequestCard v-for="action in overdueActions" :key="action.id" :action-request="action" />
            </div>
            <EmptyState v-else icon="check" title="None Overdue" message="All actions are on track" />
          </template>
        </Tabs>
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
  Tabs,
  ActionRequestSearch,
  ActionRequestCard,
  EmptyState
} from '@/components';
import type { ActionRequest } from '@/types/commonTypeDefinition';

const router = useRouter();
const store = useStore();

const actions = ref<ActionRequest[]>([]);
const filters = ref<any>({});
const activeTab = ref('all');

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'overdue', label: 'Overdue' }
];

const allActions = computed(() => {
  let filtered = [...actions.value];

  if (filters.value.actionType) {
    filtered = filtered.filter(a => a.actionType === filters.value.actionType);
  }
  if (filters.value.priority) {
    filtered = filtered.filter(a => a.priority === filters.value.priority);
  }

  return filtered;
});

const pendingActions = computed(() => {
  return allActions.value.filter(a => a.status === 'pending' || a.status === 'in-progress');
});

const overdueActions = computed(() => {
  const now = new Date();
  return allActions.value.filter(
    a => a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed'
  );
});

onMounted(async () => {
  await loadActions();
});

const loadActions = async () => {
  try {
    const state = store.state.actionRequest;
    actions.value = state?.actionRequests || [];
  } catch (error) {
    console.error('Failed to load action items:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
};

const handleNew = async () => {
  await router.push('/action-requests/new');
};
</script>

<style scoped>
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
