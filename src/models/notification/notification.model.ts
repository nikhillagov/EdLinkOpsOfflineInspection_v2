/**
 * Notification Models
 * Models for notifications, alerts, and messages
 */

import type { NotificationType, NotificationStatus } from '@/types/commonTypeDefinition';

export interface NotificationModel {
  notificationId: number;
  userId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  actionUrl?: string;
  entityType?: string;
  entityId?: number;
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
  expiresAt?: Date;
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface UserNotificationPreference {
  preferenceId: number;
  userId: number;
  notificationType: NotificationType;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  frequencyPreference: NotificationFrequency;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  updatedAt: Date;
}

export enum NotificationFrequency {
  IMMEDIATE = 'IMMEDIATE',
  DAILY_DIGEST = 'DAILY_DIGEST',
  WEEKLY_DIGEST = 'WEEKLY_DIGEST',
  MONTHLY_DIGEST = 'MONTHLY_DIGEST',
  NEVER = 'NEVER'
}

export interface MessageThread {
  threadId: number;
  subject: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Message {
  messageId: number;
  threadId: number;
  senderId: number;
  senderName: string;
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  readAt?: Date;
}

export interface Attachment {
  attachmentId: number;
  messageId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  uploadedAt: Date;
}

export interface Alert {
  alertId: number;
  userId: number;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedEntity?: string;
  affectedEntityId?: number;
  actionRequired: boolean;
  dueDate?: Date;
  status: AlertStatus;
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

export enum AlertType {
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED',
  COMPLIANCE_ISSUE = 'COMPLIANCE_ISSUE',
  INCIDENT_REPORTED = 'INCIDENT_REPORTED',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  INSPECTION_SCHEDULED = 'INSPECTION_SCHEDULED',
  VIOLATION_ISSUED = 'VIOLATION_ISSUED',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED'
}

export interface EventRule {
  ruleId: number;
  name: string;
  description: string;
  eventType: EventType;
  triggerCondition: string;
  action: EventAction;
  recipients: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventType {
  DOCUMENT_EXPIRY = 'DOCUMENT_EXPIRY',
  DEADLINE_NEAR = 'DEADLINE_NEAR',
  STATUS_CHANGE = 'STATUS_CHANGE',
  COMPLIANCE_VIOLATION = 'COMPLIANCE_VIOLATION',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  CUSTOM = 'CUSTOM'
}

export enum EventAction {
  SEND_EMAIL = 'SEND_EMAIL',
  SEND_SMS = 'SEND_SMS',
  CREATE_NOTIFICATION = 'CREATE_NOTIFICATION',
  CREATE_ALERT = 'CREATE_ALERT',
  ESCALATE = 'ESCALATE',
  CUSTOM_ACTION = 'CUSTOM_ACTION'
}

export interface RecentAction {
  actionId: number;
  userId: number;
  userName: string;
  actionType: string;
  description: string;
  entityType?: string;
  entityId?: number;
  timestamp: Date;
}
