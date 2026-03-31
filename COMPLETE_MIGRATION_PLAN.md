# Complete Migration Plan: All Components, Views, Models

## Overview
Migrating **350+ files** from old app to new v2 app with proper organization.

---

## Migration Strategy

### Phase 1: Setup Structure (This Phase)
- [ ] Create all directory folders in src/
- [ ] Create index.ts files for module exports
- [ ] Create base models and types

### Phase 2: Models & Types
- [ ] Migrate all models from src/models/
- [ ] Migrate all types from src/types/
- [ ] Create interfaces for all domain objects

### Phase 3: Services  
- [ ] Migrate all services from src/services/
- [ ] Adapt services for Prisma instead of API calls
- [ ] Update auth and user services

### Phase 4: Store (Vuex)
- [ ] Create modules for each domain (entity, staff, document, etc.)
- [ ] Implement state, getters, mutations, actions
- [ ] Create comprehensive store index

### Phase 5: Shared/Common Components
- [ ] Migrate common components (buttons, tables, notifications, etc.)
- [ ] Create shared modal components
- [ ] Create utility UI components

### Phase 6: Domain-Specific Components
- [ ] Entity components (AdditionalNamesContainer, CenterOwner, etc.)
- [ ] License components
- [ ] WP (Working Platform) components
- [ ] VOR (Verification Operation Report) components
- [ ] Search components
- [ ] Document upload components

### Phase 7: Pages/Views
- [ ] Migrate all views to pages/
- [ ] Entity management views
- [ ] Staff management views
- [ ] WP views (action items, inspection, etc.)
- [ ] Search views
- [ ] Help and account settings views

### Phase 8: Router Updates
- [ ] Update router to include all new pages
- [ ] Create route guards for auth
- [ ] Set up nested routing for complex views

### Phase 9: Testing & Verification
- [ ] Verify all imports work
- [ ] Check for missing dependencies
- [ ] Test navigation
- [ ] Validate data flow

---

## Directory Structure (Target)

```
src/
├── components/
│   ├── common/
│   │   ├── Audit/
│   │   ├── Tables/
│   │   ├── Notifications/
│   │   ├── Modals/
│   │   └── Shared/
│   ├── Application/
│   ├── Entity/
│   ├── License/
│   ├── WP/
│   │   ├── ActionItems/
│   │   ├── Inspection/
│   │   └── Dashboard/
│   ├── VOR/
│   ├── Search/
│   ├── CriticalIncident/
│   └── Wizard/
├── pages/
│   ├── Entity/
│   │   ├── EntityDashboard.vue
│   │   ├── EntityInformation.vue
│   │   ├── HealthAndSafety.vue
│   │   ├── LicensedCapacity.vue
│   │   ├── RatesAndFees.vue
│   │   └── ...
│   ├── StaffMgmt/
│   ├── WP/
│   │   ├── Inspection/
│   │   ├── ActionItems/
│   │   ├── CriticalIncident/
│   │   └── ServiceRequest/
│   ├── CaseMgmt/
│   ├── Search/
│   ├── Help/
│   └── ...
├── models/
│   ├── entity/
│   ├── staff/
│   ├── document/
│   ├── inspection/
│   ├── action-request/
│   ├── service-request/
│   ├── notification/
│   ├── vor/
│   └── common/
├── services/
│   ├── entity.service.ts
│   ├── staff.service.ts
│   ├── document.service.ts
│   ├── inspection.service.ts
│   ├── action-request.service.ts
│   ├── service-request.service.ts
│   ├── notification.service.ts
│   ├── user.service.ts
│   ├── auth.service.ts
│   └── base.service.ts
├── store/
│   ├── modules/
│   │   ├── entity.ts
│   │   ├── staff.ts
│   │   ├── document.ts
│   │   ├── inspection.ts
│   │   ├── action-request.ts
│   │   ├── service-request.ts
│   │   ├── notification.ts
│   │   ├── user.ts
│   │   ├── auth.ts
│   │   ├── app.ts
│   │   └── ui.ts
│   └── index.ts
├── types/
│   ├── commonTypeDefinition.ts
│   ├── vue-global.d.ts
│   └── third-party.d.ts
└── router/
    └── index.ts (updated with all routes)
```

---

## File Count Summary

| Category | Old App | v2 (Target) |
|----------|---------|------------|
| Components | ~200 | 200 |
| Pages/Views | ~130 | 130 |
| Models/Types | 24 | 24 |
| Services | 10 | 12+ |
| Store | 5 | 10+ |
| **Total** | **~370** | **~370** |

---

## Implementation Order

1. **Core Models** (24 files) - First
2. **Base Services** (3 files) - Second  
3. **Vuex Store** (10+ modules) - Third
4. **Common Components** (30 files) - Fourth
5. **Domain Components** (150+ files) - Fifth
6. **Pages/Views** (130 files) - Sixth
7. **Router Configuration** - Seventh

---

## Notes

- All components will be converted to Vue 3 composition API where beneficial
- TypeScript will be used throughout
- Vuetify components will be used for UI components
- Database operations will use Prisma instead of API calls
- Services will handle Prisma queries directly

---

## Status

- [ ] Not Started
- [ ] In Progress
- [ ] Completed
