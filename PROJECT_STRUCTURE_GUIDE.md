# PROJECT_STRUCTURE_GUIDE.md

# Complete Project Structure Guide

This document provides a complete overview of all files in the EdLink Offline Inspection application, their purpose, and how they relate to each other.

## Quick Overview

```
EdLinkOpsOfflineInspection_v2/
├── 📁 main/                    # Electron main process
├── 📁 src/                     # Vue application source code
├── 📁 prisma/                  # Database schema and migrations
├── 📁 public/                  # Static assets
├── 📄 Configuration Files      # Project configuration
└── 📄 Documentation           # Complete guides and references
```

---

## File Directory

### Root Configuration Files

| File | Purpose | Edit? |
|------|---------|-------|
| `package.json` | Dependencies, scripts, build config | ✏️ When adding dependencies |
| `tsconfig.json` | TypeScript compiler configuration | ⚠️ Rarely |
| `tsconfig.node.json` | TypeScript for build tools | ⚠️ Rarely |
| `vite.config.ts` | Vite build configuration | ✏️ If changing build output |
| `.env.example` | Environment template | ✏️ Add new variables |
| `.env` | Local environment (git ignored) | ✏️ Update API URLs |
| `.env.local` | Local dev overrides | ✏️ Development setup |
| `.gitignore` | Files to exclude from Git | ⚠️ Rarely |
| `README.md` | Getting started guide | ✏️ Keep updated |
| `SETUP_GUIDE.md` | Complete setup instructions | ✏️ When process changes |
| `IMPLEMENTATION.md` | Deep technical documentation | ✏️ When architecture changes |
| `ARCHITECTURE.md` | System design and patterns | ✏️ When design changes |
| `PROJECT_STRUCTURE_GUIDE.md` | This file | ✏️ When adding files |

---

## Main Process (`main/`)

Electron main process and IPC communication.

| File | Purpose | Key Exports |
|------|---------|-------------|
| `electron-main.ts` | App initialization, window management, menu | createWindow(), createApplicationMenu() |
| `preload.ts` | IPC bridge between main and renderer | electronAPI (context bridge) |

**How it works:**
1. `electron-main.ts` starts first
2. Creates Electron window pointing to Vue app
3. `preload.ts` enables safe IPC communication
4. Vue app runs in renderer process with access to electronAPI

**When to modify:**
- Add new Electron features (menus, dialogs)
- Add new IPC methods
- Change window configuration

---

## Source Code (`src/`)

### Core Entry Points

| File | Purpose |
|------|---------|
| `main.ts` | Vue app initialization, database setup |
| `App.vue` | Root component with layout |

### Pages (`src/pages/`)

Full-page components representing routes.

| File | Route | Purpose |
|------|-------|---------|
| `Dashboard.vue` | `/` | Overview with stats and recent inspections |
| `InspectionSearch.vue` | `/search` | Search and filter inspections |
| `InspectionDetail.vue` | `/inspection/:id` | View and edit inspection details |

**Component Structure:**
```vue
<template>
  <!-- HTML layout -->
</template>

<script lang="ts">
  // Logic, computed properties, methods
  // Vuex state and actions
  // Lifecycle hooks
</script>

<style scoped>
  /* Component-specific styles */
</style>
```

### Services (`src/services/`)

Business logic and data access.

#### `src/services/database/`

```
db-connection.ts
├─ DatabaseConnection class
├─ Singleton pattern
├─ Prisma initialization
└─ Transaction management

inspection.service.ts
├─ InspectionService class
├─ Search operations
├─ CRUD methods
└─ Stats aggregation

sync.service.ts
├─ SyncService class
├─ Bidirectional sync
├─ Queue management
└─ Conflict resolution
```

**When to add services:**
- New business domain (add new service file)
- New database entity (add method to existing service)
- New external API (create integration service)

### Store (`src/store/`)

Vuex state management.

#### `src/store/index.ts`
- Combines all modules
- Creates store instance

#### `src/store/modules/`

```
inspection.ts
├─ State: inspections, currentInspection, stats, filters
├─ Mutations: setInspections, setCurrentInspection, setStats
├─ Getters: allInspections, stats, isLoading
└─ Actions: searchInspections, getInspectionDetail, loadDashboardData

sync.ts
├─ State: isOnline, syncStatus, pendingSyncCount, lastSyncTime
├─ Mutations: setOnlineStatus, setSyncStatus, setPendingSyncCount
├─ Getters: isOnline, isSyncing, syncStatus
└─ Actions: initializeSync, performManualSync, setAutoSync
```

**Data flow:**
```
Component → Action → Service → Database
                ↓
         Mutation → State Change
                ↓
         Getter computes value
                ↓
         Reactive binding updates template
```

### Router (`src/router/`)

```
index.ts
├─ Route definitions
├─ Page component imports
├─ Meta information
└─ Navigation guards
```

**Routes:**
- `/` → Dashboard
- `/search` → InspectionSearch
- `/inspection/:id` → InspectionDetail

### Utilities (`src/utils/`)

Helper functions and classes.

```
logger.ts
├─ Logger class
├─ createLogger() factory
├─ debug, info, warn, error methods
└─ Log storage and retrieval
```

**When to add utilities:**
- Date formatting
- String utilities
- Validation helpers
- Common calculations

### Type Definitions

```
types.d.ts          # Global type declarations
shims-vue.d.ts      # Vue module augmentation (if using)
```

---

## Database (`prisma/`)

### `schema.prisma`

The single source of truth for database structure.

**Tables defined:**
```prisma
- Entity              (Facilities/Centers)
- ActionRequest       (Inspection requests)  
- AllInspectionScheduling (Scheduling metadata)
- InspectionScheduling    (Action inspections)
- ActionItem              (Individual tasks)
- ActionItemData          (Task data)
- SyncOperation           (Pending changes queue)
- SyncMetadata            (Sync history)
- OfflineSession          (User sessions)
```

**How Prisma works:**
```
schema.prisma
    ↓
prisma generate    (creates client)
    ↓
prisma/client      (generated code in node_modules)
    ↓
MyService imports PrismaClient
    ↓
Use in TypeScript with full intellisense
```

**When to modify:**
- Add new table: Add model block
- Update fields: Modify field definitions
- Create migration: Run `npm run db:migrate`

---

## Public Assets (`public/`)

Static files served as-is.

| File | Purpose |
|------|---------|
| `index.html` | HTML entry point for Vue app |
| `favicon.ico` | Application icon |

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Quick start and overview |
| `SETUP_GUIDE.md` | Step-by-step setup instructions |
| `IMPLEMENTATION.md` | Deep technical documentation |
| `ARCHITECTURE.md` | System design and patterns |
| `PROJECT_STRUCTURE_GUIDE.md` | **This file** |

---

## File Dependencies

### Service Layer Dependencies

```
db-connection.ts
    ↓
inspection.service.ts ─→ DatabaseConnection
sync.service.ts       ─→ DatabaseConnection
```

### Store Dependencies

```
inspection module ─→ inspection.service.ts
sync module       ─→ sync.service.ts
```

### Page Dependencies

```
Dashboard.vue          ─→ inspection module
InspectionSearch.vue  ─→ inspection module
InspectionDetail.vue  ─→ inspection module
All pages             ─→ sync module
All pages             ─→ router
All pages             ─→ App.vue (parent)
```

### Database Dependencies

```
All services ─→ Prisma schema
    ↓
Prisma generates client from schema
```

---

## Adding New Features

### Scenario: Add License Verification Feature

1. **Add database table** (`prisma/schema.prisma`)
```prisma
model LicenseVerification {
  id Int @id @default(autoincrement())
  entityId Int
  verificationDate DateTime
  status String
}
```

2. **Create migration**
```bash
npm run db:migrate
# Name: add_license_verification
```

3. **Create service** (`src/services/database/license.service.ts`)
```typescript
class LicenseService {
  verifyLicense(entityId) { ... }
  updateVerification(entityId, status) { ... }
}
```

4. **Add store module** (`src/store/modules/license.ts`)
```typescript
// State, getters, mutations, actions for license
```

5. **Create page** (`src/pages/LicenseVerification.vue`)
```vue
<!-- UI for license verification -->
```

6. **Add route** (`src/router/index.ts`)
```typescript
{
  path: '/license/:id',
  name: 'LicenseVerification',
  component: () => import('../pages/LicenseVerification.vue')
}
```

7. **Add navigation link** (`src/App.vue`)
```vue
<router-link to="/license/123">Verify License</router-link>
```

---

## Code Organization by Concern

### If working on searching functionality:
- `src/pages/InspectionSearch.vue` - UI
- `src/store/modules/inspection.ts` - State (searchCriteria)
- `src/services/database/inspection.service.ts` - Database query
- `prisma/schema.prisma` - Ensure proper indexes

### If working on synchronization:
- `src/pages/Dashboard.vue` - Sync status display
- `src/store/modules/sync.ts` - Sync state
- `src/services/database/sync.service.ts` - Sync logic
- `prisma/schema.prisma` - SyncOperation table

### If working on offline support:
- `src/services/database/sync.service.ts` - Queue logic
- `src/store/modules/sync.ts` - Online/offline state
- `src/pages/*.vue` - Loading/error states
- `src/utils/logger.ts` - Detailed logging

### If working on database:
- `prisma/schema.prisma` - Schema definition
- `prisma/migrations/` - Migration files (auto-generated)
- `src/services/database/db-connection.ts` - Connection management
- `src/services/database/*.service.ts` - Data access

---

## Common Tasks

### Add a new page
1. Create `src/pages/YourPage.vue`
2. Add route in `src/router/index.ts`
3. Add navigation link in `src/App.vue`
4. Import store modules if needed

### Add a new API endpoint
1. Create endpoint-specific service
2. Add method to appropriate service
3. Create store action that calls service
4. Use action in component

### Add a new database table
1. Add model to `prisma/schema.prisma`
2. Run `npm run db:migrate` and name it
3. Create service class to query it
4. Use in components

### Handle new sync scenario
1. Add logic to `sync.service.ts`
2. Update queue/conflict handling
3. Add test cases
4. Update Sync module state if needed

### Debug an issue
1. Check browser console (DevTools)
2. Check Electron main console
3. Review logs using logger utility
4. Check database with `npm run db:studio`
5. Add `logger.debug()` statements

---

## Building & Deployment

### Development Build
```bash
npm run electron:dev
```
- Starts Vite dev server
- Hot reload enabled
- DevTools open
- Development mode features

### Production Build
```bash
npm run build
```
- Optimized Vue build
- Compiled Electron main
- Generated installer
- Packaged application

### Key Build Output
```
dist-electron/
├── EdLink Offline Inspection Setup 2.0.0.exe    (Installer)
└── EdLink Offline Inspection 2.0.0.exe          (Portable)
```

---

## File Sizes (Typical)

| Component | Size |
|-----------|------|
| Installer | ~150 MB |
| Portable EXE | ~120 MB |
| App running | ~200-300 MB RAM |
| SQLite database (1000 inspections) | ~50 MB |
| Node modules | ~500 MB |

---

## Version Control

### Should be committed
- `src/` - All source code
- `main/` - Electron code
- `prisma/schema.prisma` - Database definition
- `prisma/migrations/` - Database migration files
- `public/` - Static assets
- `*.config.*` - Configuration files
- `*.md` - Documentation
- `package.json` - Dependencies

### Should NOT be committed (in `.gitignore`)
- `node_modules/` - Too large
- `.env` - Contains secrets
- `.env.local` - Local config
- `dist/` - Generated
- `dist-electron/` - Generated
- `*.db` - Database file
- `*.log` - Log files

---

## Summary

The project follows a clear layered architecture:

```
View Layer              (Pages + Components)
         ↓
State Management Layer  (Vuex Store)
         ↓
Business Logic Layer    (Services)
         ↓
Data Access Layer       (Prisma ORM)
         ↓
Persistence Layer       (SQLite Database)
```

Each layer has clear responsibilities and minimal coupling, making the codebase maintainable, testable, and extensible.

---

**Last Updated**: March 13, 2026  
**Version**: 2.0.0
