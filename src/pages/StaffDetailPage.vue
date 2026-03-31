<template>
  <AppLayout>
    <div class="staff-detail-page">
      <!-- Header -->
      <DetailHeader
        :title="isEditing ? 'Edit Staff Member' : (isCreating ? 'Add Staff Member' : `${staff?.firstName} ${staff?.lastName}` || 'Staff Details')"
        :subtitle="isCreating ? 'Add a new staff member' : (staff?.position ? `Position: ${staff.position}` : '')"
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
            item-type="staff member"
            @edit="startEdit"
            @save="saveStaff"
            @cancel="cancelEdit"
            @delete="deleteStaff"
            @back="goBack" />
        </template>
      </DetailHeader>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <Spinner />
        <p>Loading staff details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <Alert variant="danger" :title="`Error: ${error}`" closeable @close="error = null" />
      </div>

      <!-- Edit/Create Mode -->
      <div v-else-if="isEditing || isCreating" class="edit-section">
        <Card>
          <StaffForm
            :staff="staff"
            :isSubmitting="isSaving"
            @submit="onFormSubmit"
            @cancel="cancelEdit" />
        </Card>
      </div>

      <!-- View Mode -->
      <div v-else-if="staff" class="view-section">
        <!-- Personal Information -->
        <Card title="Personal Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Full Name</label>
              <p>{{ `${staff.firstName} ${staff.lastName}` }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>
                <a :href="`mailto:${staff.email}`">{{ staff.email }}</a>
              </p>
            </div>
            <div class="info-item">
              <label>Phone Number</label>
              <p>
                <a v-if="staff.phone" :href="`tel:${staff.phone}`">{{ staff.phone }}</a>
                <span v-else>N/A</span>
              </p>
            </div>
            <div class="info-item">
              <label>Date of Birth</label>
              <p>{{ formatDate(staff.dateOfBirth) }}</p>
            </div>
          </div>
        </Card>

        <!-- Employment Information -->
        <Card title="Employment Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Position/Title</label>
              <p>{{ staff.position }}</p>
            </div>
            <div class="info-item">
              <label>Department</label>
              <p>{{ staff.department || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Start Date</label>
              <p>{{ formatDate(staff.startDate) }}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p>
                <Badge :label="staff.status || 'Unknown'" :variant="getStatusVariant(staff.status)" />
              </p>
            </div>
          </div>
        </Card>

        <!-- Role & Permissions -->
        <Card v-if="staff.role" title="Access & Permissions">
          <div class="info-grid">
            <div class="info-item">
              <label>Permission Level</label>
              <p>
                <Badge :label="getRoleLabel(staff.role)" :variant="getRoleVariant(staff.role)" />
              </p>
            </div>
            <div class="info-item">
              <label>Badge/ID Number</label>
              <p>{{ staff.badgeNumber || 'N/A' }}</p>
            </div>
          </div>
        </Card>

        <!-- Notes -->
        <Card v-if="staff.notes" title="Notes">
          <p class="notes-text">{{ staff.notes }}</p>
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
import StaffForm from '@/components/forms/StaffForm.vue';
import { Card, Badge, Spinner, Alert } from '@/components';

interface StaffModel {
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  position: string;
  department?: string;
  status: string;
  startDate?: string;
  role?: string;
  badgeNumber?: string;
  ssn?: string;
  notes?: string;
}

const router = useRouter();
const route = useRoute();
const nav = useNavigate();

const staff = ref<Partial<StaffModel> | null>(null);
const originalStaff = ref<Partial<StaffModel> | null>(null);
const isEditing = ref(false);
const isCreating = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { label: 'Dashboard', path: '/' },
  { label: 'Staff', path: '/staff' },
  { 
    label: isCreating.value ? 'Create' : (`${staff.value?.firstName} ${staff.value?.lastName}` || 'Details'),
    path: route.fullPath
  }
]);

const statusBadge = computed(() => {
  if (!staff.value?.status) return undefined;
  return {
    label: staff.value.status.charAt(0).toUpperCase() + staff.value.status.slice(1),
    variant: getStatusVariant(staff.value.status)
  };
});

const formatDate = (date: string | undefined): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
  const variants: Record<string, any> = {
    active: 'success',
    inactive: 'secondary',
    'on-leave': 'warning',
    terminated: 'danger'
  };
  return variants[status] || 'secondary';
};

const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    viewer: 'Viewer',
    editor: 'Editor',
    admin: 'Administrator',
    inspector: 'Inspector'
  };
  return labels[role] || role;
};

const getRoleVariant = (role: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
  const variants: Record<string, any> = {
    viewer: 'secondary',
    editor: 'primary',
    admin: 'danger',
    inspector: 'warning'
  };
  return variants[role] || 'secondary';
};

const loadStaff = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const id = route.params.id as string;
    // TODO: Replace with actual API call
    // staff.value = await staffService.getStaff(id);

    if (!staff.value) {
      error.value = 'Staff member not found';
    } else {
      originalStaff.value = JSON.parse(JSON.stringify(staff.value));
    }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load staff';
  } finally {
    isLoading.value = false;
  }
};

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  if (originalStaff.value) {
    staff.value = JSON.parse(JSON.stringify(originalStaff.value));
  }
  isEditing.value = false;
};

const onFormSubmit = async (formData: Partial<StaffModel>) => {
  await saveStaff(formData);
};

const saveStaff = async (formData?: Partial<StaffModel>) => {
  try {
    isSaving.value = true;
    error.value = null;

    const dataToSave = formData || staff.value;
    if (!dataToSave) {
      throw new Error('No data to save');
    }

    // TODO: Replace with actual API call
    // if (isCreating.value) {
    //   const newStaff = await staffService.createStaff(dataToSave);
    //   staff.value = newStaff;
    // } else {
    //   await staffService.updateStaff(dataToSave.id, dataToSave);
    // }

    originalStaff.value = JSON.parse(JSON.stringify(dataToSave));
    isEditing.value = false;
    isCreating.value = false;

    console.log('Staff member saved successfully');
  } catch (err) {
    error.value = (err as Error).message || 'Failed to save staff';
  } finally {
    isSaving.value = false;
  }
};

const deleteStaff = async () => {
  try {
    isDeleting.value = true;
    error.value = null;

    if (!staff.value?.id) {
      throw new Error('No staff to delete');
    }

    // TODO: Replace with actual API call
    // await staffService.deleteStaff(staff.value.id);

    nav.toStaff();
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete staff';
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  if (route.path === '/staff/new') {
    isCreating.value = true;
    staff.value = { status: 'active', role: 'viewer' };
  } else {
    loadStaff();
  }
});
</script>

<style scoped>
.staff-detail-page {
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
