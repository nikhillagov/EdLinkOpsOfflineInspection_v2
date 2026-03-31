<template>
  <AppLayout>
    <div class="entity-detail-page">
      <!-- Header -->
      <DetailHeader
        :title="isEditing ? 'Edit Entity' : (isCreating ? 'Create Entity' : entity?.name || 'Entity Details')"
        :subtitle="isCreating ? 'Add a new entity to the system' : (entity?.status ? `Status: ${entity.status}` : '')"
        :breadcrumbs="breadcrumbs"
        :status="statusBadge">
        <template #actions>
          <DetailActions
            :isEditing="isEditing"
            :disabled="isLoading || isSaving"
            :isSaving="isSaving"
            :isDeleting="isDeleting"
            :showEdit="!isCreating && !isEditing"
            :showSave="isEditing"
            :showCancel="isEditing"
            :showDelete="!isCreating && !isEditing"
            :showBack="!isEditing && !isCreating"
            item-type="entity"
            @edit="startEdit"
            @save="saveEntity"
            @cancel="cancelEdit"
            @delete="deleteEntity"
            @back="goBack" />
        </template>
      </DetailHeader>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <Spinner />
        <p>Loading entity details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <Alert variant="danger" :title="`Error: ${error}`" closeable @close="error = null" />
      </div>

      <!-- Empty State (Create Mode) -->
      <div v-else-if="!entity && !isEditing && !isCreating" class="empty-state">
        <Card>
          <EmptyState
            icon="building"
            title="Entity Not Found"
            message="The entity you're looking for doesn't exist."
            @action="goBack" />
        </Card>
      </div>

      <!-- Content -->
      <div v-else-if="isEditing || isCreating" class="edit-section">
        <Card>
          <EntityForm
            :entity="entity"
            :isSubmitting="isSaving"
            @submit="onFormSubmit"
            @cancel="cancelEdit" />
        </Card>
      </div>

      <!-- View Mode -->
      <div v-else-if="entity" class="view-section">
        <!-- Basic Information -->
        <Card title="Basic Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Entity Name</label>
              <p>{{ entity.name }}</p>
            </div>
            <div class="info-item">
              <label>Entity Type</label>
              <p>{{ entity.entityType || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>License Number</label>
              <p>{{ entity.licenseNumber || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p>
                <Badge :label="entity.status || 'Unknown'" :variant="getStatusVariant(entity.status)" />
              </p>
            </div>
          </div>
        </Card>

        <!-- Address Information -->
        <Card title="Address Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Street Address</label>
              <p>{{ entity.address || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>City</label>
              <p>{{ entity.physicalAddressCity || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Parish</label>
              <p>{{ entity.parish || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>ZIP Code</label>
              <p>{{ entity.zip || 'N/A' }}</p>
            </div>
          </div>
        </Card>

        <!-- Contact Information -->
        <Card title="Contact Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Contact Person</label>
              <p>{{ entity.contactPerson || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>
                <a v-if="entity.email" :href="`mailto:${entity.email}`">{{ entity.email }}</a>
                <span v-else>N/A</span>
              </p>
            </div>
            <div class="info-item">
              <label>Phone Number</label>
              <p>
                <a v-if="entity.phone" :href="`tel:${entity.phone}`">{{ entity.phone }}</a>
                <span v-else>N/A</span>
              </p>
            </div>
          </div>
        </Card>

        <!-- Additional Information -->
        <Card v-if="entity.notes" title="Notes">
          <p class="notes-text">{{ entity.notes }}</p>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNavigate } from '@/router/utils';
import AppLayout from '@/layouts/AppLayout.vue';
import DetailHeader from '@/components/common/DetailHeader.vue';
import DetailActions from '@/components/common/DetailActions.vue';
import EntityForm from '@/components/forms/EntityForm.vue';
import { Card, Badge, Spinner, Alert, EmptyState } from '@/components';
import type { EntityModel } from '@/models/entity/entity.model';

const router = useRouter();
const route = useRoute();
const nav = useNavigate();

const entity = ref<Partial<EntityModel> | null>(null);
const originalEntity = ref<Partial<EntityModel> | null>(null);
const isEditing = ref(false);
const isCreating = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { label: 'Dashboard', path: '/' },
  { label: 'Entities', path: '/entities' },
  { 
    label: isCreating.value ? 'Create' : (entity.value?.name || 'Details'),
    path: route.fullPath
  }
]);

const statusBadge = computed(() => {
  if (!entity.value?.status) return undefined;
  return {
    label: entity.value.status.charAt(0).toUpperCase() + entity.value.status.slice(1),
    variant: getStatusVariant(entity.value.status)
  };
});

const getStatusVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
  const variants: Record<string, any> = {
    active: 'success',
    inactive: 'secondary',
    suspended: 'warning'
  };
  return variants[status] || 'secondary';
};

const loadEntity = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const id = route.params.id as string;
    // TODO: Replace with actual API call
    // entity.value = await entityService.getEntity(id);
    
    if (!entity.value) {
      error.value = 'Entity not found';
    } else {
      originalEntity.value = JSON.parse(JSON.stringify(entity.value));
    }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load entity';
  } finally {
    isLoading.value = false;
  }
};

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  if (originalEntity.value) {
    entity.value = JSON.parse(JSON.stringify(originalEntity.value));
  }
  isEditing.value = false;
};

const onFormSubmit = async (formData: Partial<EntityModel>) => {
  await saveEntity(formData);
};

const saveEntity = async (formData?: Partial<EntityModel>) => {
  try {
    isSaving.value = true;
    error.value = null;

    const dataToSave = formData || entity.value;
    if (!dataToSave) {
      throw new Error('No data to save');
    }

    // TODO: Replace with actual API call
    // if (isCreating.value) {
    //   const newEntity = await entityService.createEntity(dataToSave);
    //   entity.value = newEntity;
    // } else {
    //   await entityService.updateEntity(dataToSave.id, dataToSave);
    // }

    originalEntity.value = JSON.parse(JSON.stringify(dataToSave));
    isEditing.value = false;
    isCreating.value = false;

    // Show success (TODO: implement toast notification)
    console.log('Entity saved successfully');
  } catch (err) {
    error.value = (err as Error).message || 'Failed to save entity';
  } finally {
    isSaving.value = false;
  }
};

const deleteEntity = async () => {
  try {
    isDeleting.value = true;
    error.value = null;

    if (!entity.value?.id) {
      throw new Error('No entity to delete');
    }

    // TODO: Replace with actual API call
    // await entityService.deleteEntity(entity.value.id);

    // Navigate back after deletion
    nav.toEntities();
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete entity';
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  // Check if creating new entity
  if (route.path === '/entities/new') {
    isCreating.value = true;
    entity.value = {
      status: 'active'
    };
  } else {
    // Load existing entity
    loadEntity();
  }
});
</script>

<style scoped>
.entity-detail-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-state p {
  margin-top: 1rem;
  color: var(--text-secondary, #6b7280);
}

.view-section,
.edit-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  padding: 1rem;
  background-color: var(--bg-secondary, #f9fafb);
  border-radius: 0.375rem;
}

.info-item label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 0.5rem;
}

.info-item p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary, #1f2937);
}

.info-item a {
  color: var(--primary, #3b82f6);
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.notes-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: var(--text-secondary, #6b7280);
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
