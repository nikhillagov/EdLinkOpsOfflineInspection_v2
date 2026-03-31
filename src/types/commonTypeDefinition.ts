/**
 * Common Type Definitions
 * Shared interfaces and types used throughout the application
 */

// ============ Generic Types ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchCriteria {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PageState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// ============ User & Authentication ============

export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLoginDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SPECIALIST = 'SPECIALIST',
  INSPECTOR = 'INSPECTOR',
  VIEWER = 'VIEWER',
  USER = 'USER'
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

// ============ Entity Related ============

export interface Entity {
  entityId: number;
  name: string;
  licenseNumber: string;
  type: EntityType;
  status: EntityStatus;
  address: Address;
  phone: string;
  email: string;
  owner?: Person;
  createdAt: Date;
  updatedAt: Date;
}

export enum EntityType {
  CENTER = 'CENTER',
  FAMILY_HOME = 'FAMILY_HOME',
  IN_HOME = 'IN_HOME',
  SCHOOL = 'SCHOOL'
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
}

// ============ Document Related ============

export interface DocumentFile {
  documentId: number;
  name: string;
  type: DocumentType;
  size: number;
  uploadDate: Date;
  uploadedBy: User;
  expiryDate?: Date;
  status: DocumentStatus;
  filePath: string;
  mimeType: string;
}

export enum DocumentType {
  LICENSE = 'LICENSE',
  CERTIFICATION = 'CERTIFICATION',
  BACKGROUND_CHECK = 'BACKGROUND_CHECK',
  DEGREE = 'DEGREE',
  INSPECTION_REPORT = 'INSPECTION_REPORT',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// ============ Notification Related ============

export interface Notification {
  notificationId: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  ALERT = 'ALERT'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

// ============ Audit Related ============

export interface AuditLog {
  auditId: number;
  userId: number;
  action: AuditAction;
  entityType: string;
  entityId: number;
  changes: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT'
}

// ============ Workflow Related ============

export interface WorkflowStep {
  stepId: number;
  name: string;
  description: string;
  order: number;
  status: StepStatus;
  completedAt?: Date;
  completedBy?: User;
}

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  REJECTED = 'REJECTED'
}

// ============ Time Related ============

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface DateFilter {
  dateFrom?: Date;
  dateTo?: Date;
}

// ============ Common Enums ============

export enum StatusCode {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
