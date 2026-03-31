<template>
  <AppLayout>
    <PageLayout title="Licenses & Credentials" subtitle="Track staff certifications and licenses">
      <template #actions>
        <Button label="Add License" variant="primary" @click="handleNew" />
      </template>

      <!-- Search & Filter -->
      <Card>
        <LicenseSearch @search="handleSearch" />
      </Card>

      <!-- Status Summary -->
      <Card title="License Status Summary">
        <div class="status-summary">
          <div class="status-item">
            <span class="status-label">Active</span>
            <span class="status-value active">{{ activeLicenses }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Expiring Soon (30 days)</span>
            <span class="status-value warning">{{ expiringLicenses }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Expired</span>
            <span class="status-value danger">{{ expiredLicenses }}</span>
          </div>
        </div>
      </Card>

      <!-- Results -->
      <Card :title="`All Licenses (${filteredLicenses.length})`">
        <div v-if="filteredLicenses.length" class="results-grid">
          <LicenseCard
            v-for="license in filteredLicenses"
            :key="license.id"
            :license="license"
          />
        </div>
        <EmptyState
          v-else
          icon="certificate"
          title="No Licenses Found"
          message="Add a new license or adjust your search criteria"
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
  LicenseSearch,
  LicenseCard,
  EmptyState
} from '@/components';

const router = useRouter();
const store = useStore();

const licenses = ref<any[]>([]);
const filters = ref<any>({});

const filteredLicenses = computed(() => {
  let filtered = [...licenses.value];

  if (filters.value.status) {
    filtered = filtered.filter(l => l.status === filters.value.status);
  }
  if (filters.value.type) {
    filtered = filtered.filter(l => l.licenseType === filters.value.type);
  }

  return filtered;
});

const activeLicenses = computed(() => {
  return licenses.value.filter(l => l.status === 'active').length;
});

const expiringLicenses = computed(() => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return licenses.value.filter(
    l => l.expirationDate && new Date(l.expirationDate) <= thirtyDaysFromNow && l.status === 'active'
  ).length;
});

const expiredLicenses = computed(() => {
  return licenses.value.filter(l => l.status === 'expired').length;
});

onMounted(async () => {
  await loadLicenses();
});

const loadLicenses = async () => {
  try {
    const state = store.state.license;
    licenses.value = state?.licenses || [];
  } catch (error) {
    console.error('Failed to load licenses:', error);
  }
};

const handleSearch = async (searchFilters: any) => {
  filters.value = searchFilters;
};

const handleNew = async () => {
  await router.push('/licenses/new');
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

.status-value.active {
  color: #28a745;
}

.status-value.warning {
  color: #ffc107;
}

.status-value.danger {
  color: #dc3545;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .status-summary {
    flex-direction: column;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
