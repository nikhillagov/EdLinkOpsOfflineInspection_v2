/**
 * Router Utilities & Type-Safe Navigation Helpers
 * Provides strongly-typed route navigation and URL building
 */

import { useRouter, useRoute } from 'vue-router';
import type { Router, RouteLocationRaw, RouteRecordName } from 'vue-router';

/**
 * Route name enum for type-safe navigation
 */
export enum RouteName {
  Dashboard = 'Dashboard',
  Inspections = 'Inspections',
  InspectionCreate = 'InspectionCreate',
  InspectionDetail = 'InspectionDetail',
  Entities = 'Entities',
  EntityCreate = 'EntityCreate',
  EntityDetail = 'EntityDetail',
  Licenses = 'Licenses',
  LicenseCreate = 'LicenseCreate',
  LicenseDetail = 'LicenseDetail',
  Staff = 'Staff',
  StaffCreate = 'StaffCreate',
  StaffDetail = 'StaffDetail',
  ActionRequests = 'ActionRequests',
  ActionRequestCreate = 'ActionRequestCreate',
  ActionRequestDetail = 'ActionRequestDetail',
  ServiceRequests = 'ServiceRequests',
  ServiceRequestCreate = 'ServiceRequestCreate',
  ServiceRequestDetail = 'ServiceRequestDetail',
  VORRequests = 'VORRequests',
  VORRequestCreate = 'VORRequestCreate',
  VORRequestDetail = 'VORRequestDetail',
  Sync = 'Sync',
  NotFound = 'NotFound'
}

/**
 * Route path map for quick reference
 */
export const ROUTE_PATHS = {
  dashboard: '/',
  inspections: '/inspections',
  inspectionNew: '/inspections/new',
  inspectionDetail: (id: string | number) => `/inspections/${id}`,
  entities: '/entities',
  entityNew: '/entities/new',
  entityDetail: (id: string | number) => `/entities/${id}`,
  licenses: '/licenses',
  licenseNew: '/licenses/new',
  licenseDetail: (id: string | number) => `/licenses/${id}`,
  staff: '/staff',
  staffNew: '/staff/new',
  staffDetail: (id: string | number) => `/staff/${id}`,
  actionRequests: '/action-requests',
  actionRequestNew: '/action-requests/new',
  actionRequestDetail: (id: string | number) => `/action-requests/${id}`,
  serviceRequests: '/service-requests',
  serviceRequestNew: '/service-requests/new',
  serviceRequestDetail: (id: string | number) => `/service-requests/${id}`,
  vorRequests: '/vor-requests',
  vorRequestNew: '/vor-requests/new',
  vorRequestDetail: (id: string | number) => `/vor-requests/${id}`,
  sync: '/sync'
} as const;

/**
 * Breadcrumb Helper
 * Generates breadcrumb trail from current route
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
}

export function generateBreadcrumbs(): BreadcrumbItem[] {
  const router = useRouter();
  const route = useRoute();
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' }
  ];

  // Map route names to breadcrumb labels
  const labelMap: Record<string, string> = {
    Dashboard: 'Dashboard',
    Inspections: 'Inspections',
    InspectionDetail: 'Details',
    Entities: 'Entities',
    EntityDetail: 'Details',
    Licenses: 'Licenses',
    LicenseDetail: 'Details',
    Staff: 'Staff',
    StaffDetail: 'Details',
    ActionRequests: 'Action Items',
    ActionRequestDetail: 'Details',
    ServiceRequests: 'Service Requests',
    ServiceRequestDetail: 'Details',
    VORRequests: 'VOR Requests',
    VORRequestDetail: 'Details'
  };

  // Don't add dashboard twice
  if (route.name !== 'Dashboard' && route.name !== 'NotFound') {
    const label = labelMap[route.name as string] || route.meta.title || route.name as string;
    breadcrumbs.push({
      label,
      path: route.path
    });
  }

  return breadcrumbs;
}

/**
 * Navigation Helper Class
 * Provides type-safe navigation throughout the app
 */
export class RouteNavigator {
  private router: Router;

  constructor() {
    this.router = useRouter();
  }

  /**
   * Navigate to dashboard
   */
  toDashboard() {
    return this.router.push({ name: RouteName.Dashboard });
  }

  /**
   * Navigate to inspections list
   */
  toInspections() {
    return this.router.push({ name: RouteName.Inspections });
  }

  /**
   * Navigate to create inspection
   */
  toCreateInspection() {
    return this.router.push({ name: RouteName.InspectionCreate });
  }

  /**
   * Navigate to inspection details
   */
  toInspectionDetail(id: string | number) {
    return this.router.push({ name: RouteName.InspectionDetail, params: { id } });
  }

  /**
   * Navigate to entities list
   */
  toEntities() {
    return this.router.push({ name: RouteName.Entities });
  }

  /**
   * Navigate to create entity
   */
  toCreateEntity() {
    return this.router.push({ name: RouteName.EntityCreate });
  }

  /**
   * Navigate to entity details
   */
  toEntityDetail(id: string | number) {
    return this.router.push({ name: RouteName.EntityDetail, params: { id } });
  }

  /**
   * Navigate to licenses list
   */
  toLicenses() {
    return this.router.push({ name: RouteName.Licenses });
  }

  /**
   * Navigate to create license
   */
  toCreateLicense() {
    return this.router.push({ name: RouteName.LicenseCreate });
  }

  /**
   * Navigate to license details
   */
  toLicenseDetail(id: string | number) {
    return this.router.push({ name: RouteName.LicenseDetail, params: { id } });
  }

  /**
   * Navigate to staff list
   */
  toStaff() {
    return this.router.push({ name: RouteName.Staff });
  }

  /**
   * Navigate to create staff
   */
  toCreateStaff() {
    return this.router.push({ name: RouteName.StaffCreate });
  }

  /**
   * Navigate to staff details
   */
  toStaffDetail(id: string | number) {
    return this.router.push({ name: RouteName.StaffDetail, params: { id } });
  }

  /**
   * Navigate to action requests list
   */
  toActionRequests() {
    return this.router.push({ name: RouteName.ActionRequests });
  }

  /**
   * Navigate to create action request
   */
  toCreateActionRequest() {
    return this.router.push({ name: RouteName.ActionRequestCreate });
  }

  /**
   * Navigate to action request details
   */
  toActionRequestDetail(id: string | number) {
    return this.router.push({ name: RouteName.ActionRequestDetail, params: { id } });
  }

  /**
   * Navigate to service requests list
   */
  toServiceRequests() {
    return this.router.push({ name: RouteName.ServiceRequests });
  }

  /**
   * Navigate to create service request
   */
  toCreateServiceRequest() {
    return this.router.push({ name: RouteName.ServiceRequestCreate });
  }

  /**
   * Navigate to service request details
   */
  toServiceRequestDetail(id: string | number) {
    return this.router.push({ name: RouteName.ServiceRequestDetail, params: { id } });
  }

  /**
   * Navigate to VOR requests list
   */
  toVORRequests() {
    return this.router.push({ name: RouteName.VORRequests });
  }

  /**
   * Navigate to create VOR request
   */
  toCreateVORRequest() {
    return this.router.push({ name: RouteName.VORRequestCreate });
  }

  /**
   * Navigate to VOR request details
   */
  toVORRequestDetail(id: string | number) {
    return this.router.push({ name: RouteName.VORRequestDetail, params: { id } });
  }

  /**
   * Navigate to sync page
   */
  toSync() {
    return this.router.push({ name: RouteName.Sync });
  }

  /**
   * Go back to previous page
   */
  goBack() {
    return this.router.back();
  }

  /**
   * Generic navigation by name and params
   */
  navigateTo(name: RouteName, params?: Record<string, any>, query?: Record<string, any>) {
    return this.router.push({
      name,
      params,
      query
    });
  }
}

/**
 * Vue Composable for route navigation
 * Usage: const nav = useNavigation()
 */
export function useNavigation() {
  return new RouteNavigator();
}

/**
 * Vue Composable for router information
 */
export function useRouterInfo() {
  const router = useRouter();
  const route = useRoute();

  return {
    router,
    route,
    currentRouteName: () => route.name,
    currentPath: () => route.path,
    currentParams: () => route.params,
    currentQuery: () => route.query,
    isActiveRoute: (name: RouteName) => route.name === name,
    canGoBack: () => router.options.history.state.position !== undefined
  };
}

/**
 * Check if a link should be considered active
 */
export function isActiveLink(path: string): boolean {
  const route = useRoute();
  return route.path.startsWith(path);
}

/**
 * Alias for useNavigation — provided for backward compatibility
 */
export const useNavigate = useNavigation;
