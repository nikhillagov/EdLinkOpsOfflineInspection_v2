<template>
  <Card title="Search Service Requests" elevated>
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
        <DatePicker
          v-model="filters.submissionDateFrom"
          label="From Submission Date"
        />
        <DatePicker
          v-model="filters.submissionDateTo"
          label="To Submission Date"
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
  submissionDateFrom: string;
  submissionDateTo: string;
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
  submissionDateFrom: '',
  submissionDateTo: ''
});

const requestTypes = [
  { value: '', label: 'All Types' },
  { value: 'Licensing', label: 'Licensing' },
  { value: 'Renewal', label: 'Renewal' },
  { value: 'Amendment', label: 'Amendment' },
  { value: 'Other', label: 'Other' }
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Completed', label: 'Completed' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    type: '',
    entityName: '',
    status: '',
    submissionDateFrom: '',
    submissionDateTo: ''
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
