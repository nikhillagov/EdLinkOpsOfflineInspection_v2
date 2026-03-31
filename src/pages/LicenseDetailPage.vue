<template>
  <AppLayout>
    <div class="license-detail-page">
      <!-- Header -->
      <DetailHeader
        :title="isEditing ? 'Edit License' : (isCreating ? 'Add License' : license?.licenseNumber || 'License Details')"
        :subtitle="isCreating ? 'Add a new license or credential' : (license?.status ? `Status: ${license.status}` : '')"
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
            item-type="license"
            @edit="startEdit"
            @save="saveLicense"
            @cancel="cancelEdit"
            @delete="deleteLicense"
            @back="goBack" />
        </template>
      </DetailHeader>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <Spinner />
        <p>Loading license details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <Alert variant="danger" :title="`Error: ${error}`" closeable @close="error = null" />
      </div>

      <!-- Edit/Create Mode -->
      <div v-else-if="isEditing || isCreating" class="edit-section">
        <Card>
          <LicenseForm
            :license="license"
            :isSubmitting="isSaving"
            @submit="onFormSubmit"
            @cancel="cancelEdit" />
        </Card>
      </div>

      <!-- View Mode -->
      <div v-else-if="license" class="view-section">
        <!-- License Information -->
        <Card title="License Information">
          <div class="info-grid">
            <div class="info-item">
              <label>License Number</label>
              <p>{{ license.licenseNumber }}</p>
            </div>
            <div class="info-item">
              <label>License Type</label>
              <p>{{ license.licenseType || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p>
                <Badge :label="license.status || 'Unknown'" :variant="getStatusVariant(license.status)" />
              </p>
            </div>
            <div class="info-item">
              <label>Issuing Authority</label>
              <p>{{ license.issuingAuthority || 'N/A' }}</p>
            </div>
          </div>
        </Card>

        <!-- Dates -->
        <Card title="Validity Dates">
          <div class="info-grid">
            <div class="info-item">
              <label>Effective Date</label>
              <p>{{ formatDate(license.effectiveDate) }}</p>
            </div>
            <div class="info-item">
              <label>Expiration Date</label>
              <p :class="{ 'text-warning': isExpiringSoon, 'text-danger': isExpired }">
                {{ formatDate(license.expirationDate) }}
                <span v-if="isExpired" class="badge-danger">Expired</span>
                <span v-else-if="isExpiringSoon" class="badge-warning">Expiring Soon</span>
              </p>
            </div>
          </div>
        </Card>

        <!-- Holder Information -->
        <Card title="Holder Information">
          <div class="info-grid">
            <div class="info-item">
              <label>Holder Name</label>
              <p>{{ license.holderName || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>
                <a v-if="license.holderEmail" :href="`mailto:${license.holderEmail}`">{{ license.holderEmail }}</a>
                <span v-else>N/A</span>
              </p>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <p>
                <a v-if="license.holderPhone" :href="`tel:${license.holderPhone}`">{{ license.holderPhone }}</a>
                <span v-else>N/A</span>
              </p>
            </div>
          </div>
        </Card>

        <!-- Notes -->
        <Card v-if="license.notes" title="Notes">
          <p class="notes-text">{{ license.notes }}</p>
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
import LicenseForm from '@/components/forms/LicenseForm.vue';
import { Card, Badge, Spinner, Alert } from '@/components';

interface LicenseModel {
  id?: number | string;
  licenseNumber: string;
  licenseType: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  holderName?: string;
  holderEmail?: string;
  holderPhone?: string;
  issuingAuthority?: string;
  notes?: string;
}

const router = useRouter();
const route = useRoute();
const nav = useNavigate();

const license = ref<Partial<LicenseModel> | null>(null);
const originalLicense = ref<Partial<LicenseModel> | null>(null);
const isEditing = ref(false);
const isCreating = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { label: 'Dashboard', path: '/' },
  { label: 'Licenses', path: '/licenses' },
  { 
    label: isCreating.value ? 'Create' : (license.value?.licenseNumber || 'Details'),
    path: route.fullPath
  }
]);

const statusBadge = computed(() => {
  if (!license.value?.status) return undefined;
  return {
    label: license.value.status.charAt(0).toUpperCase() + license.value.status.slice(1),
    variant: getStatusVariant(license.value.status)
  };
});

const isExpired = computed(() => {
  if (!license.value?.expirationDate) return false;
  return new Date(license.value.expirationDate) < new Date();
});

const isExpiringSoon = computed(() => {
  if (!license.value?.expirationDate || isExpired.value) return false;
  const expirationDate = new Date(license.value.expirationDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expirationDate <= thirtyDaysFromNow;
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
    valid: 'success',
    expired: 'danger',
    suspended: 'warning',
    revoked: 'danger',
    pending: 'secondary'
  };
  return variants[status] || 'secondary';
};

const loadLicense = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const id = route.params.id as string;
    // TODO: Replace with actual API call
    // license.value = await licenseService.getLicense(id);

    if (!license.value) {
      error.value = 'License not found';
    } else {
      originalLicense.value = JSON.parse(JSON.stringify(license.value));
    }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load license';
  } finally {
    isLoading.value = false;
  }
};

const startEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  if (originalLicense.value) {
    license.value = JSON.parse(JSON.stringify(originalLicense.value));
  }
  isEditing.value = false;
};

const onFormSubmit = async (formData: Partial<LicenseModel>) => {
  await saveLicense(formData);
};

const saveLicense = async (formData?: Partial<LicenseModel>) => {
  try {
    isSaving.value = true;
    error.value = null;

    const dataToSave = formData || license.value;
    if (!dataToSave) {
      throw new Error('No data to save');
    }

    // TODO: Replace with actual API call
    // if (isCreating.value) {
    //   const newLicense = await licenseService.createLicense(dataToSave);
    //   license.value = newLicense;
    // } else {
    //   await licenseService.updateLicense(dataToSave.id, dataToSave);
    // }

    originalLicense.value = JSON.parse(JSON.stringify(dataToSave));
    isEditing.value = false;
    isCreating.value = false;

    console.log('License saved successfully');
  } catch (err) {
    error.value = (err as Error).message || 'Failed to save license';
  } finally {
    isSaving.value = false;
  }
};

const deleteLicense = async () => {
  try {
    isDeleting.value = true;
    error.value = null;

    if (!license.value?.id) {
      throw new Error('No license to delete');
    }

    // TODO: Replace with actual API call
    // await licenseService.deleteLicense(license.value.id);

    nav.toLicenses();
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete license';
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  if (route.path === '/licenses/new') {
    isCreating.value = true;
    license.value = { status: 'valid' };
  } else {
    loadLicense();
  }
});
</script>

<style scoped>
.license-detail-page {
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

.text-warning {
  color: var(--warning, #f59e0b);
}

.text-danger {
  color: var(--danger, #ef4444);
}

.badge-warning,
.badge-danger {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.badge-warning {
  background-color: var(--warning, #f59e0b);
}

.badge-danger {
  background-color: var(--danger, #ef4444);
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
