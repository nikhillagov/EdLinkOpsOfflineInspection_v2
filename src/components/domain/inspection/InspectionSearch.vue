<template>
  <Card title="Search Inspections" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <TextInput
          v-model="filters.entityName"
          label="Entity Name"
          placeholder="Search by entity name..."
        />
        <TextInput
          v-model="filters.licenseNumber"
          label="License Number"
          placeholder="Enter license number..."
        />
        <Select
          v-model="filters.status"
          label="Status"
          placeholder="Select status..."
          :options="statusOptions"
        />
        <DatePicker
          v-model="filters.dateFrom"
          label="From Date"
        />
        <DatePicker
          v-model="filters.dateTo"
          label="To Date"
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
import DatePicker from '@/components/common/DatePicker.vue';
import Button from '@/components/common/Button.vue';

interface SearchFilters {
  entityName: string;
  licenseNumber: string;
  status: string;
  dateFrom: string;
  dateTo: string;
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
  entityName: '',
  licenseNumber: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

const statusOptions = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    entityName: '',
    licenseNumber: '',
    status: '',
    dateFrom: '',
    dateTo: ''
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
