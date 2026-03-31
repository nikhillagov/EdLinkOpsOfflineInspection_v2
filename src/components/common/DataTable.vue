<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :style="getColumnStyle(column)">
            <div class="table-header-cell">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable" class="sort-icon" @click="toggleSort(column.key)">
                ▼
              </span>
            </div>
          </th>
          <th v-if="hasActions" class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + (hasActions ? 1 : 0)" class="empty-state">
            No data found
          </td>
        </tr>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="column in columns" :key="column.key" :style="getColumnStyle(column)">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="hasActions" class="actions-cell">
            <slot name="actions" :row="row"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface Props {
  columns: Column[];
  rows: any[];
  hasActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasActions: false
});

const sortColumn = ref<string>();
const sortDirection = ref<'asc' | 'desc'>('asc');

const toggleSort = (columnKey: string) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = 'asc';
  }
};

const getColumnStyle = (column: Column) => {
  return {
    width: column.width || 'auto'
  };
};
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background-color: white;
}

.data-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  user-select: none;
}

.table-header-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  font-size: 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.sort-icon:hover {
  opacity: 1;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 12px;
}

.actions-column {
  width: 100px;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
