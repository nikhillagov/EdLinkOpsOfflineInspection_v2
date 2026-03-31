# Component Architecture & Usage Guide

## Overview

This guide documents the complete component library for EdLink Ops Offline Inspection v2. Components are organized into three logical layers:

1. **Common Components** - Reusable UI building blocks
2. **Domain Components** - Entity-specific features
3. **Utility Components** - Workflow patterns and dialogs

---

## 1. Common Components (`src/components/common/`)

Reusable, minimal UI components that form the foundation of the application.

### Form Components

#### TextInput
```vue
<TextInput
  v-model="formData.name"
  label="Full Name"
  placeholder="Enter your name"
  :required="true"
  :error="errors.name"
/>
```
Props: `modelValue`, `label`, `placeholder`, `type`, `required`, `disabled`, `error`, `maxLength`

#### TextArea
```vue
<TextArea
  v-model="formData.description"
  label="Description"
  placeholder="Enter details..."
  :rows="4"
/>
```
Props: `modelValue`, `label`, `placeholder`, `rows`, `required`, `disabled`, `error`

#### Select
```vue
<Select
  v-model="formData.status"
  label="Status"
  :options="statusOptions"
  option-label="label"
  option-value="value"
/>
```
Props: `modelValue`, `label`, `options`, `optionLabel`, `optionValue`, `required`, `disabled`, `error`

#### DatePicker
```vue
<DatePicker
  v-model="formData.inspectionDate"
  label="Inspection Date"
  :min-date="minDate"
  :max-date="maxDate"
/>
```
Props: `modelValue`, `label`, `minDate`, `maxDate`, `required`, `disabled`, `error`

#### Checkbox
```vue
<Checkbox
  v-model="formData.agreed"
  label="I agree to the terms"
/>
```
Props: `modelValue`, `label`, `disabled`

#### Radio
```vue
<Radio
  v-model="formData.inspectionType"
  :options="typeOptions"
  label="Inspection Type"
/>
```
Props: `modelValue`, `options`, `label`, `disabled`

#### MultiSelect
```vue
<MultiSelect
  v-model="formData.certifications"
  label="Certifications"
  :options="certOptions"
  placeholder="Select certifications..."
/>
```
Props: `modelValue`, `label`, `options`, `placeholder`, `required`, `disabled`

#### FileUpload
```vue
<FileUpload
  @file-selected="handleFileSelect"
  label="Upload Document"
  accept=".pdf,.docx"
  max-size="5242880"
/>
```
Props: `label`, `accept`, `maxSize`, `disabled`
Emits: `fileSelected(file)`

### Layout Components

#### Button
```vue
<Button
  label="Save"
  variant="primary"
  size="md"
  @click="handleSave"
/>
```
Props: `label`, `variant` (primary|secondary|danger|success|warning|info), `size` (sm|md|lg), `disabled`, `loading`
Slots: `default`

#### Card
```vue
<Card title="Details" subtitle="Inspection information">
  <p>Content here</p>
</Card>
```
Props: `title`, `subtitle`
Slots: `default`, `header`, `footer`

#### Badge
```vue
<Badge label="Active" variant="success" />
```
Props: `label`, `variant` (success|warning|danger|info|default)

#### Breadcrumb
```vue
<Breadcrumb :items="breadcrumbItems" />
```
Props: `items` (Array of {label, href})

#### Tabs
```vue
<Tabs :tabs="tabItems" v-model="activeTab">
  <template #tab1>Content 1</template>
  <template #tab2>Content 2</template>
</Tabs>
```
Props: `tabs` (Array of {id, label}), `modelValue`

#### DataTable
```vue
<DataTable
  :columns="columns"
  :data="tableData"
  :selectable="true"
  @row-click="handleRowClick"
/>
```
Props: `columns`, `data`, `selectable`, `pagination`, `sortable`
Emits: `rowClick`, `selectionChange`

### Feedback Components

#### Alert
```vue
<Alert
  type="success"
  title="Operation Successful"
  message="The record was saved successfully"
  :dismissible="true"
/>
```
Props: `type` (success|warning|error|info), `title`, `message`, `dismissible`

#### Spinner
```vue
<Spinner size="lg" text="Loading..." />
```
Props: `size` (sm|md|lg), `text`

#### EmptyState
```vue
<EmptyState
  icon="inbox"
  title="No Results"
  message="No inspections found matching your criteria"
/>
```
Props: `icon`, `title`, `message`

#### Divider
```vue
<Divider />
```

#### Tooltip
```vue
<Tooltip text="This is a helpful tip">
  <span>Hover me</span>
</Tooltip>
```
Props: `text`, `position` (top|bottom|left|right)

### Navigation Components

#### SearchBox
```vue
<SearchBox
  v-model="searchQuery"
  placeholder="Search inspections..."
  @search="handleSearch"
/>
```
Props: `modelValue`, `placeholder`
Emits: `search`, `clear`

#### Pagination
```vue
<Pagination
  :current-page="currentPage"
  :total-pages="totalPages"
  @page-change="handlePageChange"
/>
```
Props: `currentPage`, `totalPages`, `pageSize`
Emits: `pageChange`

#### Modal
```vue
<Modal
  title="Confirm Action"
  :visible="showModal"
  @close="showModal = false"
>
  <p>Are you sure?</p>
</Modal>
```
Props: `title`, `visible`, `size` (sm|md|lg)
Emits: `close`
Slots: `default`, `header`, `footer`

---

## 2. Domain Components (`src/components/domain/`)

Entity-specific components organized by feature area.

### Inspection Components

#### InspectionCard
Displays a single inspection with status, dates, and action buttons.
```vue
<InspectionCard
  :inspection="inspection"
  @view="handleView"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

#### InspectionSearch
Filter form for searching inspections by multiple criteria.
```vue
<InspectionSearch @search="handleSearch" />
```

#### InspectionDetails
Detailed view with sub-sections for findings, actions, and history.
```vue
<InspectionDetails :inspection="inspection" />
```

### Entity Components

#### EntityCard
Displays organization/entity with status and key information.
```vue
<EntityCard
  :entity="entity"
  @view="handleView"
  @edit="handleEdit"
/>
```

#### EntitySearch
Search/filter form for entities.
```vue
<EntitySearch @search="handleSearch" />
```

### Action Request Components

#### ActionRequestCard
Shows action item with priority, assignee, and due date.
```vue
<ActionRequestCard
  :action-request="actionRequest"
  @complete="handleComplete"
/>
```

#### ActionRequestSearch
Filter form with type, priority, status, and date range.
```vue
<ActionRequestSearch @search="handleSearch" />
```

### Service Request Components

#### ServiceRequestCard
Displays service request with type, status, and details.
```vue
<ServiceRequestCard
  :service-request="serviceRequest"
  @approve="handleApprove"
/>
```

#### ServiceRequestSearch
Search form with type, entity, status, and date filters.
```vue
<ServiceRequestSearch @search="handleSearch" />
```

### VOR (Verification of Records) Components

#### VORRequestCard
Shows VOR request with findings summary.
```vue
<VORRequestCard :vor-request="vorRequest" />
```

### License Components

#### LicenseCard
Displays credential/license with expiration status.
```vue
<LicenseCard :license="license" />
```

#### LicenseSearch
Filter credentials by number, entity, type, and status.
```vue
<LicenseSearch @search="handleSearch" />
```

### Staff Components

#### StaffCard
Shows staff member with certifications and status.
```vue
<StaffCard :staff-member="staffMember" />
```

#### StaffSearch
Search staff by name, position, email, and status.
```vue
<StaffSearch @search="handleSearch" />
```

### Document Components

#### DocumentCard
Displays document with file size, type, and download/view actions.
```vue
<DocumentCard :document="document" />
```

#### DocumentSearch
Search documents by type, status, and verification state.
```vue
<DocumentSearch @search="handleSearch" />
```

---

## 3. Utility Components (`src/components/utility/`)

Workflow patterns, dialogs, and higher-level UI utilities.

### Dialog Components

#### ConfirmationModal
Reusable confirmation dialog with custom titles and messages.
```vue
<ConfirmationModal
  title="Delete Inspection?"
  message="This action cannot be undone."
  :visible="showConfirm"
  @confirm="handleConfirm"
  @cancel="showConfirm = false"
/>
```

### Form Utilities

#### FormWrapper
Container for forms with automatic error handling and submission.
```vue
<FormWrapper
  :loading="isSubmitting"
  :errors="formErrors"
  @submit="handleFormSubmit"
>
  <TextInput v-model="form.name" label="Name" />
  <TextInput v-model="form.email" label="Email" />
  <template #actions>
    <Button label="Save" type="submit" />
  </template>
</FormWrapper>
```

#### FilterPanel
Reusable filter UI wrapper with apply/clear actions.
```vue
<FilterPanel @apply="handleApplyFilters" @clear="handleClearFilters">
  <Select v-model="filters.status" label="Status" :options="statusOptions" />
  <DatePicker v-model="filters.startDate" label="From" />
</FilterPanel>
```

### Information Display

#### InfoBox
Status/information panels with variants.
```vue
<InfoBox
  variant="warning"
  title="License Expiring"
  message="This license expires in 30 days"
/>
```
Variants: `info`, `success`, `warning`, `error`

#### StatCards
Dashboard statistics grid with icons and trends.
```vue
<StatCards :stats="statsData" />
```

#### Timeline
Activity/event timeline with status markers.
```vue
<Timeline :events="timelineEvents" />
```

### Progress Components

#### ProgressBar
Progress indicator with label and percentage.
```vue
<ProgressBar
  :model-value="75"
  label="Inspection Complete"
  variant="success"
  :show-value="true"
/>
```

#### StepIndicator
Multi-step wizard indicator.
```vue
<StepIndicator
  :steps="['Personal Info', 'Address', 'Review', 'Confirm']"
  :current-step="2"
/>
```

### User Display

#### Avatar
User avatar with initials.
```vue
<Avatar
  name="John Doe"
  size="md"
  background-color="#007bff"
/>
```

---

## Component Usage Patterns

### 1. Form Handling
```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { TextInput, Button, FormWrapper } from '@/components';

const form = reactive({
  name: '',
  email: ''
});

const handleSubmit = async () => {
  // Submit logic
};
</script>

<template>
  <FormWrapper @submit="handleSubmit">
    <TextInput v-model="form.name" label="Name" />
    <TextInput v-model="form.email" label="Email" type="email" />
  </FormWrapper>
</template>
```

### 2. Data Display with Actions
```vue
<Card title="Inspections">
  <DataTable
    :columns="columns"
    :data="inspections"
    @row-click="handleRowClick"
  />
</Card>
```

### 3. Search & Filter
```vue
<div class="search-container">
  <InspectionSearch @search="handleSearch" />
  <div class="results">
    <InspectionCard
      v-for="inspection in results"
      :key="inspection.id"
      :inspection="inspection"
    />
  </div>
</div>
```

### 4. Modal + Confirmation
```vue
<Button label="Delete" @click="showConfirm = true" />

<ConfirmationModal
  title="Delete Inspection?"
  :visible="showConfirm"
  @confirm="handleDelete"
  @cancel="showConfirm = false"
/>
```

---

## TypeScript Integration

All components are fully typed with TypeScript. Import type definitions:

```typescript
import type {
  Inspection,
  Entity,
  ActionRequest,
  ServiceRequest
} from '@/types/commonTypeDefinition';

interface Props {
  inspection: Inspection;
  onUpdate: (inspection: Inspection) => void;
}
```

---

## Styling Guidelines

- **Colors**: Blue (#007bff), Green (#28a745), Red (#dc3545), Yellow (#ffc107)
- **Spacing**: 8px base unit (8, 16, 24, 32, 40, 48px)
- **Typography**: 12px (small), 14px (base), 16px (large), 18px (title)
- **Shadows**: `0 2px 4px rgba(0,0,0,0.1)` for cards

---

## Import Examples

```typescript
// Single component
import { Button } from '@/components';

// Multiple components
import { Card, DataTable, Badge } from '@/components';

// All components
import * as Components from '@/components';

// Domain components
import { InspectionCard, InspectionSearch } from '@/components';

// Utility components
import { ConfirmationModal, FormWrapper } from '@/components';
```

---

## Best Practices

1. **Keep components composable** - Combine simple components for complex UIs
2. **Use slots for flexibility** - Allow consumers to customize content
3. **Prop validation** - Always validate required props
4. **Event naming** - Use clear, action-based event names (onDelete, onApprove)
5. **TypeScript types** - Export and use interfaces for props
6. **Consistent spacing** - Use 8px-based spacing system
7. **Accessibility** - Use semantic HTML and ARIA labels

---

## Migration from Old Components

Map old components to new patterns:

| Old Component | New Pattern |
|---|---|
| CustomTable | DataTable + Card |
| ModalDialog | Modal + ConfirmationModal |
| FormSection | FormWrapper + form inputs |
| StatusBadge | Badge |
| LoadingSpinner | Spinner |
| FilterUI | FilterPanel |
| TimelineView | Timeline |
| ProgressUI | ProgressBar |

---

---End of Component Documentation---
