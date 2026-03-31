/**
 * Route Middleware & Guards
 * Centralized route protection and validation logic
 */

import type { Router, RouteLocationNormalized } from 'vue-router';
import type { Store } from 'vuex';

/**
 * Auth Guard Middleware
 * Checks if user is authenticated before accessing protected routes
 */
export function useAuthGuard(store: Store<any>) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized): boolean => {
    const requiresAuth = to.meta.requiresAuth !== false;
    const isAuthenticated = store.state.auth?.isAuthenticated || false;

    if (requiresAuth && !isAuthenticated) {
      console.warn(`Access denied to ${to.path} - user not authenticated`);
      // Redirect to login when implemented
      // return '/login';
      return false;
    }

    return true;
  };
}

/**
 * Role-Based Access Control Guard
 * Checks if user has required role for a route
 */
export function useRoleGuard(store: Store<any>) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized): boolean => {
    const requiredRole = to.meta.requiredRole as string | undefined;
    const userRole = store.state.auth?.user?.role || null;

    if (requiredRole && userRole !== requiredRole) {
      console.warn(`Access denied to ${to.path} - insufficient permissions`);
      return false;
    }

    return true;
  };
}

/**
 * Data Loading Guard
 * Ensures required data is loaded before navigation
 */
export async function useDataGuard(store: Store<any>) {
  return async (to: RouteLocationNormalized): Promise<boolean> => {
    const dataKey = to.meta.requiresData as string | undefined;

    if (dataKey) {
      try {
        // Dispatch action to load data if needed
        await store.dispatch(`${dataKey}/load`);
        return true;
      } catch (error) {
        console.error(`Failed to load data for ${to.path}:`, error);
        return false;
      }
    }

    return true;
  };
}

/**
 * Unsaved Changes Guard
 * Warns user before leaving page with unsaved changes
 */
export function useUnsavedChangesGuard() {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | string => {
    const hasUnsavedChanges = from.meta.hasUnsavedChanges || false;

    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Do you want to leave?');
      if (!confirmed) {
        return false; // Prevent navigation
      }
    }

    return true;
  };
}

/**
 * Scroll Position Guard
 * Resets scroll position on route change unless specified otherwise
 */
export function useScrollGuard() {
  return (to: RouteLocationNormalized) => {
    const noScroll = to.meta.noScroll || false;

    if (!noScroll) {
      window.scrollTo(0, 0);
    }
  };
}

/**
 * Route Name Validation Guard
 * Ensures route names are valid and consistent
 */
export function validateRouteNames(router: Router): void {
  const routeNames = new Set<string>();
  const duplicates: string[] = [];

  router.getRoutes().forEach((route) => {
    if (route.name) {
      const name = route.name as string;
      if (routeNames.has(name)) {
        duplicates.push(name);
      }
      routeNames.add(name);
    }
  });

  if (duplicates.length > 0) {
    console.error('Duplicate route names detected:', duplicates);
  }
}

/**
 * Route Meta Validator
 * Ensures all routes have required meta properties
 */
export function validateRouteMeta(router: Router): void {
  router.getRoutes().forEach((route) => {
    if (route.path !== '/:pathMatch(.*)*') {
      if (!route.meta?.title) {
        console.warn(`Route ${route.path} missing title in meta`);
      }

      if (route.meta?.requiresAuth === undefined) {
        console.warn(`Route ${route.path} missing requiresAuth in meta`);
      }
    }
  });
}

/**
 * Setup all middleware guards
 */
export function setupRouterMiddleware(router: Router, store: Store<any>): void {
  // Before each navigation
  router.beforeEach(async (to, from, next) => {
    // Check auth
    const authGuard = useAuthGuard(store);
    if (!authGuard(to, from)) {
      // Redirect to login if auth required but not authenticated
      next('/login');
      return;
    }

    // Check role-based access
    const roleGuard = useRoleGuard(store);
    if (!roleGuard(to, from)) {
      next('/'); // Redirect to home on permission denied
      return;
    }

    // Load required data
    const isDataLoaded = await useDataGuard(store)(to);
    if (!isDataLoaded) {
      next('/'); // Redirect on data load failure
      return;
    }

    // Check for unsaved changes
    const unsavedGuard = useUnsavedChangesGuard();
    if (!unsavedGuard(to, from)) {
      return; // Prevent navigation
    }

    next();
  });

  // After each navigation
  router.afterEach((to) => {
    // Handle scroll
    useScrollGuard()(to);
  });

  // Validate routes on init
  if (import.meta.env.DEV) {
    validateRouteNames(router);
    validateRouteMeta(router);
  }
}
