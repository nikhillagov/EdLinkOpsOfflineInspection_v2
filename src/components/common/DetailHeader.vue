<template>
  <div class="detail-header">
    <div class="header-top">
      <button class="back-button" @click="goBack" title="Go back">
        ← Back
      </button>
      <h1 class="detail-title">{{ title }}</h1>
      <div class="header-actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div v-if="subtitle" class="header-subtitle">
      {{ subtitle }}
    </div>

    <div v-if="breadcrumbs && breadcrumbs.length" class="breadcrumbs">
      <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
        <router-link :to="crumb.path" class="breadcrumb-link">
          {{ crumb.label }}
        </router-link>
        <span v-if="idx < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </template>
    </div>

    <div v-if="status" class="header-status">
      <Badge :label="status.label" :variant="status.variant" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Badge from './Badge.vue';

interface Breadcrumb {
  label: string;
  path: string;
}

interface StatusInfo {
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
}

defineProps<{
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  status?: StatusInfo;
}>();

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.back-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary, #f3f4f6);
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: var(--bg-tertiary, #e5e7eb);
}

.detail-title {
  flex: 1;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary, #1f2937);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 0.5rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.breadcrumb-link {
  color: var(--primary, #3b82f6);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-secondary, #6b7280);
}

.header-status {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
