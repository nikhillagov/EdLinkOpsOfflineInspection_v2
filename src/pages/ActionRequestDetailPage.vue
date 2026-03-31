<template>
  <AppLayout>
    <div class="action-request-detail-page">
      <!-- Header -->
      <DetailHeader
        :title="isEditing ? 'Edit Action Request' : (isCreating ? 'Create Action Request' : `Action #${action?.id || 'Details'}`)"
        :subtitle="isCreating ? 'Create a new action request' : (action?.status ? `Status: ${getStatusLabel(action.status)}` : '')"
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
            item-type="action request"
            @edit="startEdit"
            @save="saveAction"
            @cancel="cancelEdit"
            @delete="deleteAction"
            @back="goBack" />
        </template>
      </DetailHeader>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <Spinner />
        <p>Loading action request details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <Alert variant="danger" :title="`Error: ${error}`" closeable @close="error = null" />
      </div>

      <!-- Edit/Create Mode -->
      <div v-else-if="isEditing || isCreating" class="edit-section">
        <Card>
          <ActionItemForm
            :action="action"
            :isSubmitting="isSaving"
            @submit="onFormSubmit"
            @cancel="cancelEdit" />
        </Card>
      </div>

      <!-- View Mode -->
      <div v-else-if="action" class="view-section">
        <!-- Action Details -->
        <Card title="Action Request Details">
          <div class="info-grid">
            <div class="info-item">
              <label>Action Type</label>
              <p>{{ getActionTypeName(action.typeId) }}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p>
                <Badge :label="getStatusLabel(action.status || '0')" :variant="getStatusVariant(action.status || '0')" />
              </p>
            </div>
            <div class="info-item">
              <label>Priority</label>
              <p>
                <Badge :label="(action.priority || 'medium').toUpperCase()" :variant="getPriorityVariant(action.priority)" />
              </p>
            </div>
            <div class="info-item">
              <label>Due Date</label>
              <p>{{ formatDate(action.dueDate) }}</p>
            </div>
          </div>
        </Card>

        <!-- Assignment Info -->
        <Card title="Assignment Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Assigned To</label>
              <p>{{ action.assignedTo || 'Unassigned' }}</p>
            </div>
            <div class="info-item">
              <label>Department</label>
              <p>{{ action.department || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Completed Date</label>
              <p>{{ formatDate(action.completedDate) || 'Not completed' }}</p>
            </div>
          </div>
        </Card>

        <!-- Description -->
        <Card title="Description & Details">
          <div class="description-section">
            <h4>Description</h4>
            <p class="description-text">{{ action.description }}</p>
          </div>

          <div v-if="action.foundingBasis" class="description-section">
            <h4>Founding Basis / Reference</h4>
            <p class="description-text">{{ action.foundingBasis }}</p>
          </div>
        </Card>

        <!-- Internal Notes -->
        <Card v-if="action.notes" title="Internal Notes">
          <p class="notes-text">{{ action.notes }}</p>
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
import ActionItemForm from '@/components/forms/ActionItemForm.vue';
import { Card, Badge, Spinner, Alert } from '@/components';

interface ActionModel {
  id?: number | string;
  typeId: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  department?: string;
  description: string;
  foundingBasis?: string;
  notes?: string;
}

const router = useRouter();
const route = useRoute();
const nav = useNavigate();

const action = ref<Partial<ActionModel> | null>(null);
const originalAction = ref<Partial<ActionModel> | null>(null);
const isEditing = ref(false);
const isCreating = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { label: 'Dashboard', path: '/' },
  { label: 'Action Requests', path: '/action-requests' },
  { 
    label: isCreating.value ? 'Create' : `Action #${action.value?.id}`,
    path: route.fullPath
  }
]);

const statusBadge = computed(() => {
  if (!action.value?.status) return undefined;
  return {
    label: getStatusLabel(action.value.status),
    variant: getStatusVariant(action.value.status)
  };
});

const actionTypes: Record<string, string> = {
  '1': 'Correction Required',
  '2': 'Documentation',
  '3': 'Staff Training',
  '4': 'Equipment Upgrade',
  '5': 'Policy Review',
  '6': 'Other'
};

const getActionTypeName = (typeId: string | number | undefined): string => {
  if (!typeId) return 'N/A';
  return actionTypes[String(typeId)] || 'Unknown';
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    '0': 'Pending',
    '1': 'In Progress',
    '2': 'Completed',
    '3': 'Deferred'
  };
  return labels[status] || 'Unknown';
};

const getStatusVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
  const variants: Record<string, any> = {
    '0': 'secondary',
    '1': 'primary',
    '2': 'success',
    '3': 'warning'
  };
  return variants[status] || 'secondary';
};

const getPriorityVariant = (priority: string | undefined): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
  const variants: Record<string, any> = {
    low: 'secondary',
    medium: 'primary',
    high: 'warning',
    critical: 'danger'
  };
  return variants[priority] || 'secondary';
};

const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const loadAction = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const id = route.params.id as string;
    // TODO: Replace with actual API call
    // action.value = await actionService.getAction(id);

    if (!action.value) {
      error.value = 'Action request not found';
    } else {
      originalAction.value = JSON.parse(JSON.stringify(action.value));
    }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load action request';
  } finally {
    isLoading.value = false;
  }
};

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  if (originalAction.value) {
    action.value = JSON.parse(JSON.stringify(originalAction.value));
  }
  isEditing.value = false;
};

const onFormSubmit = async (formData: Partial<ActionModel>) => {
  await saveAction(formData);
};

const saveAction = async (formData?: Partial<ActionModel>) => {
  try {
    isSaving.value = true;
    error.value = null;

    const dataToSave = formData || action.value;
    if (!dataToSave) {
      throw new Error('No data to save');
    }

    // TODO: Replace with actual API call
    // if (isCreating.value) {
    //   const newAction = await actionService.createAction(dataToSave);
    //   action.value = newAction;
    // } else {
    //   await actionService.updateAction(dataToSave.id, dataToSave);
    // }

    originalAction.value = JSON.parse(JSON.stringify(dataToSave));
    isEditing.value = false;
    isCreating.value = false;

    console.log('Action request saved successfully');
  } catch (err) {
    error.value = (err as Error).message || 'Failed to save action request';
  } finally {
    isSaving.value = false;
  }
};

const deleteAction = async () => {
  try {
    isDeleting.value = true;
    error.value = null;

    if (!action.value?.id) {
      throw new Error('No action to delete');
    }

    // TODO: Replace with actual API call
    // await actionService.deleteAction(action.value.id);

    nav.toActionRequests();
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete action request';
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  if (route.path === '/action-requests/new') {
    isCreating.value = true;
    action.value = { status: '0', priority: 'medium' };
  } else {
    loadAction();
  }
});
</script>

<style scoped>
.action-request-detail-page {
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

.description-section {
  margin-bottom: 1.5rem;
}

.description-section:last-child {
  margin-bottom: 0;
}

.description-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.description-text,
.notes-text {
  margin: 0;
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
