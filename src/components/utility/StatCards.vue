<template>
  <div class="stats-grid">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="stat-card"
    >
      <div class="stat-icon" :style="{ color: stat.color }">
        {{ stat.icon }}
      </div>
      <div class="stat-content">
        <p class="stat-label">{{ stat.label }}</p>
        <h3 class="stat-value">{{ stat.value }}</h3>
        <span v-if="stat.trend" :class="['stat-trend', { negative: stat.trend < 0 }]">
          {{ stat.trend > 0 ? '▲' : '▼' }} {{ Math.abs(stat.trend) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: number;
}

interface Props {
  stats: StatCard[];
}

defineProps<Props>();
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-trend {
  font-size: 12px;
  color: #28a745;
  font-weight: 500;
}

.stat-trend.negative {
  color: #dc3545;
}
</style>
