/**
 * Router Package Exports (src/router/index exports)
 * Centralized exports for all router functionality within the router package
 */

// Route utilities and helpers
export { RouteName, ROUTE_PATHS, RouteNavigator, useNavigation, useRouterInfo, generateBreadcrumbs, isActiveLink } from './utils';

// Router types
export type { BreadcrumbItem } from './utils';

// Middleware and guards
export {
  useAuthGuard,
  useRoleGuard,
  useDataGuard,
  useUnsavedChangesGuard,
  useScrollGuard,
  validateRouteNames,
  validateRouteMeta,
  setupRouterMiddleware
} from './middleware';
