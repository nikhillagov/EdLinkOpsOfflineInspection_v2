<template>
  <AppLayout>
    <PageLayout title="Entities" subtitle="Manage organizations and entities">
      <template #actions>
        <Button label="New Entity" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <EntitySearch @search="handleSearch" />
      </Card>

      <!-- Results -->
      <Card :title="`Results (${filteredEntities.length})`">
        <div v-if="filteredEntities.length" class="results-grid">
          <EntityCard
            v-for="entity in filteredEntities"
            :key="entity.id"
            :entity="entity"
            @click="handleViewEntity(entity)"
          />
        </div>
        <EmptyState
          v-else
          icon="building"
          title="No Entities Found"
          message="Create a new entity or adjust your search criteria"
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
  EntitySearch,
  EntityCard,
  EmptyState
} from '@/components';
import type { Entity } from '@/types/commonTypeDefinition';

const router = useRouter();
const store = useStore();

const entities = ref<Entity[]>([]);
const filters = ref<any>({});

const filteredEntities = computed(() => {
  let filtered = [...entities.value];

  if (filters.value.status) {
    filtered = filtered.filter(e => e.status === filters.value.status);
  }
  if (filters.value.type) {
    filtered = filtered.filter(e => e.entityType === filters.value.type);
  }

  return filtered;
});

onMounted(async () => {
  await loadEntities();
});

const loadEntities = async () => {
  try {
    const state = store.state.entity;
    entities.value = state?.entities || [];
  } catch (error) {
    console.error('Failed to load entities:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
};

const handleNew = async () => {
  await router.push('/entities/new');
};

const handleViewEntity = async (entity: Entity) => {
  await router.push(`/entities/${entity.id}`);
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
