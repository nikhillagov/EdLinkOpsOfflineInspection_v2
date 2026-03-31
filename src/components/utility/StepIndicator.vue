<template>
  <div class="step-indicator">
    <div class="steps-list">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="getStepClass(index)"
      >
        <div class="step-marker">
          {{ index + 1 }}
        </div>
        <div class="step-label">{{ step }}</div>
      </div>
    </div>
    <div class="steps-progress" :style="{ width: progressPercentage + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  steps: string[];
  currentStep: number;
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  if (props.steps.length <= 1) return 0;
  return ((props.currentStep) / (props.steps.length - 1)) * 100;
});

const getStepClass = (index: number) => {
  if (index < props.currentStep) return 'completed';
  if (index === props.currentStep) return 'active';
  return 'pending';
};
</script>

<style scoped>
.step-indicator {
  position: relative;
  margin-bottom: 20px;
}

.steps-list {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  text-align: center;
}

.step-marker {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid #ddd;
  background-color: white;
  transition: all 0.2s;
}

.step.active .step-marker {
  border-color: #007bff;
  background-color: #007bff;
  color: white;
}

.step.completed .step-marker {
  border-color: #28a745;
  background-color: #28a745;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.step.active .step-label {
  color: #007bff;
}

.step.completed .step-label {
  color: #28a745;
}

.steps-progress {
  position: absolute;
  height: 2px;
  background-color: #28a745;
  bottom: 17px;
  left: 0;
  transition: width 0.3s ease;
  z-index: 1;
}
</style>
