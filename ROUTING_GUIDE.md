# Vue Router Installation & Configuration Guide

## Overview

The EdLink Ops Offline Inspection v2 application uses **Vue Router 4** for client-side routing. The router is fully configured with:

- ✅ **26 routes** covering all major features
- ✅ **Route guards** for authentication and authorization  
- ✅ **Type-safe navigation** helpers
- ✅ **Breadcrumb support**
- ✅ **Page title management**
- ✅ **Middleware system**

---

## File Structure

```
src/router/
├── index.ts          # Main router configuration (26 routes)
├── middleware.ts     # Route guards & middleware
├── utils.ts          # Navigation helpers & utilities
└── README.md         # This file
```

```
src/composables/
└── useRouter.ts      # Vue composables for router
```

---

## Quick Start

### 1. Basic Navigation (Options)

**Using the navigation helper class:**
```typescript
import { useNavigation } from '@/router/utils';

export default {
  setup() {
    const nav = useNavigation();

    return {
      goToDashboard: () => nav.toDashboard(),
      goToInspections: () => nav.toInspections(),
      viewInspection: (id) => nav.toInspectionDetail(id)
    };
  }
}
```

**Using composables (recommended in Composition API):**
```vue
<script setup lang="ts">
import { useNavigate } from '@/router/utils';
import { useAppRouter } from '@/composables/useRouter';

const nav = useNavigate();
const { breadcrumbs, pageTitle, isCurrentRoute } = useAppRouter();

const handleViewInspection = (id: string) => {
  nav.toInspectionDetail(id);
};
</script>
```

**Using router directly:**
```typescript
import { useRouter } from 'vue-router';

const router = useRouter();
router.push({ name: 'Inspections' });
```

---

## Routes

### Dashboard
- **Path**: `/`
- **Name**: `Dashboard`
- **Auth Required**: Yes
- **Component**: [Dashboard.vue](../pages/Dashboard.vue)

### Inspections
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/inspections` | `Inspections` | InspectionsPage.vue |
| Create | `/inspections/new` | `InspectionCreate` | InspectionDetail.vue |
| Detail | `/inspections/:id` | `InspectionDetail` | InspectionDetail.vue |

### Entities
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/entities` | `Entities` | EntitiesPage.vue |
| Create | `/entities/new` | `EntityCreate` | EntitiesPage.vue |
| Detail | `/entities/:id` | `EntityDetail` | EntitiesPage.vue |

### Licenses
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/licenses` | `Licenses` | LicensesPage.vue |
| Create | `/licenses/new` | `LicenseCreate` | LicensesPage.vue |
| Detail | `/licenses/:id` | `LicenseDetail` | LicensesPage.vue |

### Staff
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/staff` | `Staff` | StaffPage.vue |
| Create | `/staff/new` | `StaffCreate` | StaffPage.vue |
| Detail | `/staff/:id` | `StaffDetail` | StaffPage.vue |

### Action Requests
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/action-requests` | `ActionRequests` | ActionRequestsPage.vue |
| Create | `/action-requests/new` | `ActionRequestCreate` | ActionRequestsPage.vue |
| Detail | `/action-requests/:id` | `ActionRequestDetail` | ActionRequestsPage.vue |

### Service Requests
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/service-requests` | `ServiceRequests` | ServiceRequestsPage.vue |
| Create | `/service-requests/new` | `ServiceRequestCreate` | ServiceRequestsPage.vue |
| Detail | `/service-requests/:id` | `ServiceRequestDetail` | ServiceRequestsPage.vue |

### VOR Requests
| Route | Path | Name | Component |
|-------|------|------|-----------|
| List | `/vor-requests` | `VORRequests` | VORRequestsPage.vue |
| Create | `/vor-requests/new` | `VORRequestCreate` | VORRequestsPage.vue |
| Detail | `/vor-requests/:id` | `VORRequestDetail` | VORRequestsPage.vue |

### Sync
- **Path**: `/sync`
- **Name**: `Sync`
- **Auth Required**: Yes
- **Component**: Dashboard.vue (placeholder)

---

## Route Guards & Middleware

### Authentication Guard
Checks if user is authenticated before accessing protected routes.

```typescript
requiresAuth: true  // In route meta
```

### Role-Based Access Control
Restrict routes to specific user roles.

```typescript
meta: {
  title: 'Admin Panel',
  requiredRole: 'admin'
}
```

### Unsaved Changes Guard
Warn users before navigating away from modified forms.

```typescript
meta: {
  title: 'Edit Inspection',
  hasUnsavedChanges: true
}
```

### Data Loading Guard
Auto-load required data before displaying page.

```typescript
meta: {
  title: 'Inspection Details',
  requiresData: 'inspection'
}
```

---

## Composables & Utilities

### useAppRouter()
Complete router functionality composable.

```typescript
const {
  router,           // Vue Router instance
  route,            // Current route
  navigator,        // RouteNavigator instance
  currentRouteName, // Computed: current route name
  currentPath,      // Computed: current path
  currentParams,    // Computed: route parameters
  currentQuery,     // Computed: query parameters
  pageTitle,        // Computed: page title from meta
  breadcrumbs,      // Computed: breadcrumb trail
  isCurrentRoute,   // Method: check if route is current
  isPathActive,     // Method: check if path is active
  navigate,         // Method: navigate to location
  goBack,           // Method: go back
  getRouteParam,    // Method: get route param by key
  getQueryParam     // Method: get query param by key
} = useAppRouter();
```

### useNavigate()
Shorthand for RouteNavigator - for quick navigation.

```typescript
const nav = useNavigate();
nav.toInspections();
nav.toInspectionDetail('123');
nav.toDashboard();
```

### useBreadcrumbs()
Auto-generated breadcrumb trail.

```typescript
const breadcrumbs = useBreadcrumbs();
// [
//   { label: 'Dashboard', path: '/' },
//   { label: 'Inspections', path: '/inspections' },
//   { label: 'Details', path: '/inspections/123' }
// ]
```

---

## Route Names Enum

For type-safe navigation:

```typescript
import { RouteName } from '@/router/utils';

const nav = useNavigate();
nav.navigateTo(RouteName.InspectionDetail, { id: '123' });
```

Available names:
- `RouteName.Dashboard`
- `RouteName.Inspections`
- `RouteName.InspectionCreate`
- `RouteName.InspectionDetail`
- `RouteName.Entities`
- `RouteName.EntityCreate`
- `RouteName.EntityDetail`
- ... and more for all routes

---

## Route Paths Constants

Pre-built path strings:

```typescript
import { ROUTE_PATHS } from '@/router/utils';

ROUTE_PATHS.dashboard           // '/'
ROUTE_PATHS.inspections         // '/inspections'
ROUTE_PATHS.inspectionNew       // '/inspections/new'
ROUTE_PATHS.inspectionDetail(1) // '/inspections/1'
```

---

## Examples

### Example 1: Navigate from Component
```vue
<script setup lang="ts">
import { useNavigate } from '@/router/utils';

const nav = useNavigate();

const handleViewInspection = (id: number) => {
  nav.toInspectionDetail(id);
};
</script>

<template>
  <button @click="handleViewInspection(inspection.id)">
    View Details
  </button>
</template>
```

### Example 2: Conditional Navigation
```vue
<script setup lang="ts">
import { useAppRouter } from '@/composables/useRouter';

const { isCurrentRoute, navigate } = useAppRouter();

const handleNavigate = async () => {
  const success = await navigate({
    name: 'InspectionDetail',
    params: { id: '123' }
  });
  
  if (success) {
    console.log('Navigation successful');
  }
};
</script>

<template>
  <div v-if="isCurrentRoute(RouteName.Inspections)">
    You are on the inspections page
  </div>
</template>
```

### Example 3: Use Breadcrumbs
```vue
<script setup lang="ts">
import { useAppRouter } from '@/composables/useRouter';
import { Breadcrumb } from '@/components';

const { breadcrumbs } = useAppRouter();
</script>

<template>
  <AppLayout :breadcrumb-items="breadcrumbs">
    <!-- Content -->
  </AppLayout>
</template>
```

### Example 4: Type-Safe Navigation
```typescript
import { useNavigate, RouteName } from '@/router/utils';

const nav = useNavigate();

// All of these have TypeScript autocomplete:
nav.toDashboard();
nav.toInspections();
nav.toInspectionDetail('123');
nav.toEntities();
nav.toStaff();
// ... etc
```

---

## Route Parameters

### Get Route Parameters
```typescript
const { getRouteParam } = useAppRouter();

const inspectionId = getRouteParam('id');
const entityId = getRouteParam('entityId');
```

### Get Query Parameters
```typescript
const { getQueryParam } = useAppRouter();

const searchQuery = getQueryParam('q');
const sortBy = getQueryParam('sort');
```

### Access Direct from Route
```typescript
const route = useRoute();

route.params.id          // '123'
route.query.q            // 'search term'
route.meta.title         // 'Page Title'
```

---

## Middleware & Guards

### Setup in main.ts
Middleware is automatically set up in main.ts:

```typescript
import { setupRouterMiddleware } from './router/middleware';

setupRouterMiddleware(router, store);
```

### Available Middleware Functions

**Auth Guard**
```typescript
const authGuard = useAuthGuard(store);
const isAllowed = authGuard(to, from);
```

**Role Guard**
```typescript
const roleGuard = useRoleGuard(store);
const hasPermission = roleGuard(to, from);
```

**Unsaved Changes Guard**
```typescript
const unsavedGuard = useUnsavedChangesGuard();
const canNavigate = unsavedGuard(to, from);
```

**Scroll Position Guard**
```typescript
const scrollGuard = useScrollGuard();
scrollGuard(to);  // Resets scroll
```

---

## Best Practices

### 1. Use Type-Safe Navigation
```typescript
// ✅ Good
const nav = useNavigate();
nav.toInspectionDetail(id);

// ❌ Avoid
router.push(`/inspections/${id}`);
```

### 2. Use Route Names for Links
```vue
<!-- ✅ Good -->
<router-link :to="{ name: 'Inspections' }">View All</router-link>

<!-- ❌ Avoid -->
<router-link to="/inspections">View All</router-link>
```

### 3. Handle Navigation Errors
```typescript
const nav = useNavigate();
try {
  await nav.toInspectionDetail(id);
} catch (error) {
  console.error('Navigation failed:', error);
}
```

### 4. Use Breadcrumbs
Always use computed breadcrumbs instead of hardcoding:
```typescript
const { breadcrumbs } = useAppRouter();
```

### 5. Check Current Route
```typescript
const { isCurrentRoute, isPathActive } = useAppRouter();

if (isCurrentRoute(RouteName.Inspections)) {
  // Do something
}

if (isPathActive('/inspections')) {
  // Do something
}
```

---

## Roadmap

### Phase 4.2: Auth Pages
- [ ] Login page component
- [ ] Auth route guard implementation
- [ ] Protected route checking

### Phase 4.3: Detail Pages
- [ ] InspectionDetailPage component
- [ ] EntityDetailPage component
- [ ] Form handling & validation
- [ ] Nested detail routes

### Phase 4.4: Advanced Features
- [ ] Lazy loading routes
- [ ] Route transitions
- [ ] Scroll behavior management
- [ ] Deep link handling

---

## Troubleshooting

### Route Not Found
Check that the route is defined in `src/router/index.ts` and component is imported.

### Navigation Not Working
Ensure `router.isReady()` is awaited in main.ts before mounting.

### Guards Not Running
Verify `setupRouterMiddleware(router, store)` is called in main.ts.

### Type Errors
Update imports to use routes from `@/router/utils` and composables from `@/composables/useRouter.ts`.

---

## Statistics

- **Total Routes**: 26
- **Main Pages**: 8
- **Create/Edit Routes**: 9
- **Protected Routes**: 25 (requiresAuth: true)
- **Middleware Functions**: 6
- **Composables**: 3
- **Type-Safe Helpers**: 50+

---

**Status**: ✅ Routing Complete | Ready for Phase 4.2 (Detail Pages)
