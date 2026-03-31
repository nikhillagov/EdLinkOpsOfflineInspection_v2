<template>
  <Card title="Search Documents" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <TextInput
          v-model="filters.name"
          label="Document Name"
          placeholder="Search by name..."
        />
        <Select
          v-model="filters.type"
          label="Document Type"
          placeholder="Select type..."
          :options="documentTypes"
        />
        <Select
          v-model="filters.status"
          label="Status"
          placeholder="Select status..."
          :options="statusOptions"
        />
        <Checkbox
          v-model="filters.verified"
          label="Verified Only"
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
import Checkbox from '@/components/common/Checkbox.vue';
import Button from '@/components/common/Button.vue';

interface SearchFilters {
  name: string;
  type: string;
  status: string;
  verified: boolean;
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
  name: '',
  type: '',
  status: '',
  verified: false
});

const documentTypes = [
  { value: '', label: 'All Types' },
  { value: 'License', label: 'License' },
  { value: 'Certificate', label: 'Certificate' },
  { value: 'Training', label: 'Training Record' },
  { value: 'Background Check', label: 'Background Check' },
  { value: 'Other', label: 'Other' }
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Pending Review', label: 'Pending Review' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Archived', label: 'Archived' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    name: '',
    type: '',
    status: '',
    verified: false
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
