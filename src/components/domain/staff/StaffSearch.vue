<template>
  <Card title="Search Staff" elevated>
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-grid">
        <TextInput
          v-model="filters.name"
          label="Staff Name"
          placeholder="Search by name..."
        />
        <TextInput
          v-model="filters.position"
          label="Position"
          placeholder="Search by position..."
        />
        <TextInput
          v-model="filters.email"
          label="Email"
          placeholder="Search by email..."
        />
        <Select
          v-model="filters.active"
          label="Status"
          placeholder="Select status..."
          :options="[
            { value: '', label: 'All' },
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]"
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
  name: string;
  position: string;
  email: string;
  active: string;
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
  position: '',
  email: '',
  active: ''
});

const handleSearch = () => {
  emit('search', filters.value);
};

const clearFilters = () => {
  filters.value = {
    name: '',
    position: '',
    email: '',
    active: ''
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
