<template>
  <div class="tabs">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { 'tab-active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined
});

const emit = defineEmits<{
  'update:modelValue': [id: string];
}>();

const activeTab = ref(props.modelValue || (props.tabs.length > 0 ? props.tabs[0].id : ''));

const updateActiveTab = (id: string) => {
  activeTab.value = id;
  emit('update:modelValue', id);
};
</script>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #333;
}

.tab-active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tabs-content {
  padding: 16px 0;
}
</style>
