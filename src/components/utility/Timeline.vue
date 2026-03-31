<template>
  <div class="timeline">
    <div
      v-for="(event, index) in events"
      :key="index"
      class="timeline-item"
    >
      <div class="timeline-marker" :class="`marker-${event.status}`">
        {{ event.icon || '●' }}
      </div>
      <div class="timeline-content">
        <div class="content-header">
          <h5 class="event-title">{{ event.title }}</h5>
          <span class="event-date">{{ formatDate(event.date) }}</span>
        </div>
        <p v-if="event.description" class="event-description">
          {{ event.description }}
        </p>
        <p v-if="event.actor" class="event-actor">
          by {{ event.actor }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineEvent {
  title: string;
  date: Date | string;
  description?: string;
  actor?: string;
  status?: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  icon?: string;
}

interface Props {
  events: TimelineEvent[];
}

defineProps<Props>();

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.timeline-item {
  display: flex;
  gap: 12px;
  position: relative;
}

.timeline-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background-color: white;
}

.marker-completed {
  background-color: #28a745;
  color: white;
}

.marker-in-progress {
  background-color: #007bff;
  color: white;
}

.marker-pending {
  background-color: #ffc107;
  color: white;
}

.marker-cancelled {
  background-color: #6c757d;
  color: white;
}

.timeline-content {
  flex: 1;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 2px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.event-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.event-date {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.event-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.event-actor {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
