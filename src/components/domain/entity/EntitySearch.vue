<template>
  <Card title="Search Entities" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <TextInput
          v-model="filters.licenseeName"
          label="Licensee Name"
          placeholder="Search by licensee name..."
        />
        <TextInput
          v-model="filters.facilityName"
          label="Facility Name"
          placeholder="Search by facility name..."
        />
        <TextInput
          v-model="filters.licenseNumber"
          label="License Number"
          placeholder="Enter license number..."
        />
        <TextInput
          v-model="filters.parish"
          label="Parish"
          placeholder="Search by parish..."
        />
        <Select
          v-model="filters.licenseType"
          label="License Type"
          placeholder="Select license type..."
          :options="licenseTypeOptions"
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
  licenseeName: string;
  facilityName: string;
  licenseNumber: string;
  parish: string;
  licenseType: string;
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
  licenseeName: '',
  facilityName: '',
  licenseNumber: '',
  parish: '',
  licenseType: ''
});

const licenseTypeOptions = [
  { value: 'Child Care Center', label: 'Child Care Center' },
  { value: 'Family Child Care Home', label: 'Family Child Care Home' },
  { value: 'Group Family Child Care Home', label: 'Group Family Child Care Home' },
  { value: 'School', label: 'School' }
];

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    licenseeName: '',
    facilityName: '',
    licenseNumber: '',
    parish: '',
    licenseType: ''
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
