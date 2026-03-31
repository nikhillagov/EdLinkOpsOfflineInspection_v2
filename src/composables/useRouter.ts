/**
 * Router Composable
 * Provides clean API for router access in components
 */

import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Router, RouteLocationRaw } from 'vue-router';
import { RouteNavigator, RouteName, generateBreadcrumbs } from './utils';

/**
 * Composable for router functionality
 */
export function useAppRouter() {
  const router = useRouter();
  const route = useRoute();
  const navigator = new RouteNavigator();

  // Computed properties
  const currentRouteName = computed(() => route.name);
  const currentPath = computed(() => route.path);
  const currentParams = computed(() => route.params);
  const currentQuery = computed(() => route.query);
  const pageTitle = computed(() => route.meta.title as string || 'Page');
  const breadcrumbs = computed(() => generateBreadcrumbs());

  /**
   * Check if current route is active
   */
  const isCurrentRoute = (name: RouteName) => {
    return route.name === name;
  };

  /**
   * Check if route path matches
   */
  const isPathActive = (path: string) => {
    return route.path.startsWith(path);
  };

  /**
   * Navigate with error handling
   */
  const navigate = async (location: RouteLocationRaw) => {
    try {
      await router.push(location);
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    }
  };

  /**
   * Go to previous page
   */
  const goBack = () => {
    router.back();
  };

  /**
   * Get route parameter by name
   */
  const getRouteParam = (key: string): string | undefined => {
    const value = route.params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  /**
   * Get query parameter by name
   */
  const getQueryParam = (key: string): string | undefined => {
    const value = route.query[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    router,
    route,
    navigator,
    // Computed
    currentRouteName,
    currentPath,
    currentParams,
    currentQuery,
    pageTitle,
    breadcrumbs,
    // Methods
    isCurrentRoute,
    isPathActive,
    navigate,
    goBack,
    getRouteParam,
    getQueryParam
  };
}

/**
 * Composable for navigation utilities
 * Shorter version for common navigation tasks
 */
export function useNavigate() {
  return new RouteNavigator();
}

/**
 * Composable for breadcrumb generation
 */
export function useBreadcrumbs() {
  return computed(() => generateBreadcrumbs());
}
