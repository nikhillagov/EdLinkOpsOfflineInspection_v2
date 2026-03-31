<template>
  <Card title="Search Licenses" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <TextInput
          v-model="filters.licenseNumber"
          label="License Number"
          placeholder="Enter license number..."
        />
        <TextInput
          v-model="filters.entityName"
          label="Entity Name"
          placeholder="Search by entity..."
        />
        <Select
          v-model="filters.type"
          label="License Type"
          placeholder="Select type..."
          :options="licenseTypes"
        />
        <Select
          v-model="filters.status"
          label="Status"
          placeholder="Select status..."
          :options="statusOptions"
        />
      </div>

      <div class="search-actions">
        <Button
          label="Search"
          variant="primary"
          :loading="loading"
          type="submit"
        />
        <Button
          label="Clear"
          variant="secondary"
          @click="clearFilters"
        />
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import TextInput from '@/components/common/TextInput.vue';
import Select from '@/components/common/Select.vue';
import Button from '@/components/common/Button.vue';

interface SearchFilters {
  licenseNumber: string;
  entityName: string;
  type: string;
  status: string;
}

interface Props {
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  search: [filters: SearchFilters];
}>();

const filters = ref<SearchFilters>({
  licenseNumber: '',
  entityName: '',
  type: '',
  status: ''
});

const licenseTypes = [
  { value: '', label: 'All Types' },
  { value: 'Center', label: 'Center' },
  { value: 'Family', label: 'Family Home' },
  { value: 'Group', label: 'Group Home' },
  { value: 'School', label: 'School' }
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Revoked', label: 'Revoked' },
  { value: 'Pending', label: 'Pending' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    licenseNumber: '',
    entityName: '',
    type: '',
    status: ''
  };
};
</script>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.search-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}
</style>
