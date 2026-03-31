<template>
  <Card title="Search Action Requests" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <Select
          v-model="filters.type"
          label="Request Type"
          placeholder="Select type..."
          :options="requestTypes"
        />
        <TextInput
          v-model="filters.entityName"
          label="Entity Name"
          placeholder="Search by entity..."
        />
        <Select
          v-model="filters.status"
          label="Status"
          placeholder="Select status..."
          :options="statusOptions"
        />
        <Select
          v-model="filters.priority"
          label="Priority"
          placeholder="Select priority..."
          :options="priorityOptions"
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
  type: string;
  entityName: string;
  status: string;
  priority: string;
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
  type: '',
  entityName: '',
  status: '',
  priority: '',
  dateFrom: '',
  dateTo: ''
});

const requestTypes = [
  { value: '', label: 'All Types' },
  { value: 'Violation', label: 'Violation' },
  { value: 'Inspection', label: 'Inspection' },
  { value: 'Enforcement', label: 'Enforcement' }
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Overdue', label: 'Overdue' }
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    type: '',
    entityName: '',
    status: '',
    priority: '',
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
