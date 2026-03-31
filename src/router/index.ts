/**
 * Vue Router Configuration
 * Centralized routing for EdLink Ops Offline Inspection v2
 * Features: Protected routes, auth guards, meta titles
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import type { Router } from 'vue-router';
import store from '@/store';

// Page Components (Phase 3)
import Dashboard from '@/pages/Dashboard.vue';
import InspectionsPage from '@/pages/InspectionsPage.vue';
import InspectionDetail from '@/pages/InspectionDetail.vue';
import EntitiesPage from '@/pages/EntitiesPage.vue';
import ActionRequestsPage from '@/pages/ActionRequestsPage.vue';
import ServiceRequestsPage from '@/pages/ServiceRequestsPage.vue';
import VORRequestsPage from '@/pages/VORRequestsPage.vue';
import LicensesPage from '@/pages/LicensesPage.vue';
import StaffPage from '@/pages/StaffPage.vue';

// Detail Page Components (Phase 4.2)
import EntityDetailPage from '@/pages/EntityDetailPage.vue';
import LicenseDetailPage from '@/pages/LicenseDetailPage.vue';
import StaffDetailPage from '@/pages/StaffDetailPage.vue';
import ActionRequestDetailPage from '@/pages/ActionRequestDetailPage.vue';

// Auth Pages (Placeholder - to be created in Phase 4.3)
// import LoginPage from '@/pages/LoginPage.vue';

/**
 * Route Meta Type Extension
 */
declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    requiresAuth?: boolean;
    layout?: 'app' | 'blank';
  }
}

/**
 * Route Definitions
 * Organized by feature area for maintainability
 */
const routes: RouteRecordRaw[] = [
  // ===== AUTH ROUTES (Phase 4.3) =====
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
      layout: 'blank'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/ForgotPasswordPage.vue'),
    meta: {
      title: 'Forgot Password',
      requiresAuth: false,
      layout: 'blank'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/pages/ResetPasswordPage.vue'),
    meta: {
      title: 'Reset Password',
      requiresAuth: false,
      layout: 'blank'
    }
  },

  // ===== DASHBOARD ROUTES =====
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== INSPECTION ROUTES =====
  {
    path: '/inspections',
    name: 'Inspections',
    component: InspectionsPage,
    meta: {
      title: 'Inspections',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/inspections/new',
    name: 'InspectionCreate',
    component: InspectionDetail,
    meta: {
      title: 'Create Inspection',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/inspections/:id',
    name: 'InspectionDetail',
    component: InspectionDetail,
    props: true,
    meta: {
      title: 'Inspection Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== ENTITY ROUTES =====
  {
    path: '/entities',
    name: 'Entities',
    component: EntitiesPage,
    meta: {
      title: 'Entities',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/entities/new',
    name: 'EntityCreate',
    component: EntityDetailPage,
    meta: {
      title: 'Create Entity',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/entities/:id',
    name: 'EntityDetail',
    component: EntityDetailPage,
    props: true,
    meta: {
      title: 'Entity Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== LICENSE ROUTES =====
  {
    path: '/licenses',
    name: 'Licenses',
    component: LicensesPage,
    meta: {
      title: 'Licenses & Credentials',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/licenses/new',
    name: 'LicenseCreate',
    component: LicenseDetailPage,
    meta: {
      title: 'Add License',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/licenses/:id',
    name: 'LicenseDetail',
    component: LicenseDetailPage,
    props: true,
    meta: {
      title: 'License Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== STAFF ROUTES =====
  {
    path: '/staff',
    name: 'Staff',
    component: StaffPage,
    meta: {
      title: 'Staff',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/staff/new',
    name: 'StaffCreate',
    component: StaffDetailPage,
    meta: {
      title: 'Add Staff',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/staff/:id',
    name: 'StaffDetail',
    component: StaffDetailPage,
    props: true,
    meta: {
      title: 'Staff Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== ACTION REQUEST ROUTES =====
  {
    path: '/action-requests',
    name: 'ActionRequests',
    component: ActionRequestsPage,
    meta: {
      title: 'Action Items',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/action-requests/new',
    name: 'ActionRequestCreate',
    component: ActionRequestDetailPage,
    meta: {
      title: 'Create Action',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/action-requests/:id',
    name: 'ActionRequestDetail',
    component: ActionRequestDetailPage,
    props: true,
    meta: {
      title: 'Action Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== SERVICE REQUEST ROUTES =====
  {
    path: '/service-requests',
    name: 'ServiceRequests',
    component: ServiceRequestsPage,
    meta: {
      title: 'Service Requests',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/service-requests/new',
    name: 'ServiceRequestCreate',
    component: ServiceRequestsPage,
    meta: {
      title: 'Create Service Request',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/service-requests/:id',
    name: 'ServiceRequestDetail',
    component: ServiceRequestsPage,
    props: true,
    meta: {
      title: 'Service Request Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== VOR REQUEST ROUTES =====
  {
    path: '/vor-requests',
    name: 'VORRequests',
    component: VORRequestsPage,
    meta: {
      title: 'VOR Requests',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/vor-requests/new',
    name: 'VORRequestCreate',
    component: VORRequestsPage,
    meta: {
      title: 'Create VOR Request',
      requiresAuth: true,
      layout: 'app'
    }
  },
  {
    path: '/vor-requests/:id',
    name: 'VORRequestDetail',
    component: VORRequestsPage,
    props: true,
    meta: {
      title: 'VOR Request Details',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== SYNC ROUTE =====
  {
    path: '/sync',
    name: 'Sync',
    component: Dashboard, // Placeholder - to be replaced with SyncPage
    meta: {
      title: 'Data Synchronization',
      requiresAuth: true,
      layout: 'app'
    }
  },

  // ===== CATCH-ALL & 404 =====
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Dashboard, // Placeholder - to be replaced with NotFoundPage
    meta: {
      title: 'Not Found',
      layout: 'blank'
    }
  }
];

/**
 * Create Router Instance
 */
const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  strict: true,
  sensitive: true
});

/**
 * Global Navigation Guard
 * Handles:
 * - Page title updates
 * - Auth verification
 * - Route validation
 */
router.beforeEach((to, from, next) => {
  // Update page title
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} | EdLink Offline Inspection`;
  }

  // Check if route requires auth
  const requiresAuth = to.meta.requiresAuth !== false;
  
  if (requiresAuth) {
    // Check auth status from store
    const isAuthenticated = store.state.auth?.isAuthenticated || false;

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  } else {
    // For auth routes, redirect to dashboard if already authenticated
    if (
      (to.name === 'Login' || to.name === 'ForgotPassword' || to.name === 'ResetPassword') &&
      to.query.token === undefined
    ) {
      const isAuthenticated = store.state.auth?.isAuthenticated || false;

      if (isAuthenticated) {
        next({ name: 'Dashboard' });
        return;
      }
    }
  }

  next();
});

/**
 * After Navigation Hook
 */
router.afterEach((to) => {
  // Reset scroll position on route change
  window.scrollTo(0, 0);
});

/**
 * Error Handling
 */
router.onError((error) => {
  console.error('Router error:', error);
});

export default router;
