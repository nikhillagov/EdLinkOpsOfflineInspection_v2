/**
 * Action Request Models
 * Models for action requests and licensing actions
 */

import type { StatusCode, Priority } from '@/types/commonTypeDefinition';

export interface ActionRequest {
  actionRequestId: number;
  parentActionRequestId?: number;
  entityId: number;
  requestType: ActionRequestType;
  actionRequestStatus: ActionRequestStatus;
  priority: Priority;
  createdDate: Date;
  requestedBy: string;
  assignedTo?: string;
  dueDate: Date;
  completionDate?: Date;
  description: string;
  notes?: string;
  documents: ActionRequestDocument[];
  inspections: ActionRequestInspection[];
  actionItems: ActionRequestActionItem[];
  childActionRequests?: ActionRequest[];
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export enum ActionRequestType {
  INITIAL_LICENSE = 'INITIAL_LICENSE',
  LICENSE_RENEWAL = 'LICENSE_RENEWAL',
  LICENSE_MODIFICATION = 'LICENSE_MODIFICATION',
  COMPLAINT = 'COMPLAINT',
  INCIDENT = 'INCIDENT',
  FOLLOW_UP = 'FOLLOW_UP',
  VIOLATION = 'VIOLATION',
  ENFORCEMENT = 'ENFORCEMENT',
  BACKGROUND_CHECK = 'BACKGROUND_CHECK',
  DOCUMENT_REVIEW = 'DOCUMENT_REVIEW'
}

export enum ActionRequestStatus {
  RECEIVED = 'RECEIVED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PENDING_RESPONSE = 'PENDING_RESPONSE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface ActionRequestDocument {
  documentId: number;
  actionRequestId: number;
  documentName: string;
  documentType: string;
  uploadedDate: Date;
  uploadedBy: string;
  filePath: string;
  status: DocumentRequestStatus;
}

export enum DocumentRequestStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface ActionRequestInspection {
  allInspectionSchedulingId: number;
  actionRequestId: number;
  scheduledDate: Date;
  inspectionType: string;
  status: string;
}

export interface ActionRequestActionItem {
  actionItemId: number;
  actionRequestId: number;
  actionItemTypeName: string;
  progressStatusId: number;
  dueDate?: Date;
  description?: string;
}

export interface LicenseReview {
  licenseReviewId: number;
  actionRequestId: number;
  reviewDate: Date;
  reviewedBy: string;
  reviewStatus: ReviewStatus;
  findings: string;
  recommendation: ReviewRecommendation;
  recommendedDueDate?: Date;
}

export enum ReviewStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  REJECTED = 'REJECTED'
}

export enum ReviewRecommendation {
  APPROVE = 'APPROVE',
  APPROVE_CONDITIONALLY = 'APPROVE_CONDITIONALLY',
  DENY = 'DENY',
  REQUEST_MORE_INFO = 'REQUEST_MORE_INFO',
  REFER = 'REFER'
}

export interface Violation {
  violationId: number;
  actionRequestId: number;
  entityId: number;
  violationDate: Date;
  regulationNumber: string;
  description: string;
  severity: ViolationSeverity;
  correctionRequired: boolean;
  correctionDeadline?: Date;
  status: ViolationStatus;
  enforcementAction?: string;
}

export enum ViolationSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  SERIOUS = 'SERIOUS',
  CRITICAL = 'CRITICAL'
}

export enum ViolationStatus {
  OPEN = 'OPEN',
  CORRECTED = 'CORRECTED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED',
  WAIVED = 'WAIVED'
}

export interface EnforcementAction {
  enforcementId: number;
  actionRequestId: number;
  actionType: EnforcementActionType;
  actionDate: Date;
  description: string;
  approvedBy: string;
  status: EnforcementStatus;
  enforcementDetails?: string;
}

export enum EnforcementActionType {
  WARNING = 'WARNING',
  CITATION = 'CITATION',
  FINE = 'FINE',
  LICENSE_SUSPENSION = 'LICENSE_SUSPENSION',
  LICENSE_REVOCATION = 'LICENSE_REVOCATION',
  CLOSURE_ORDER = 'CLOSURE_ORDER'
}

export enum EnforcementStatus {
  ISSUED = 'ISSUED',
  APPEALED = 'APPEALED',
  UPHELD = 'UPHELD',
  OVERTURNED = 'OVERTURNED',
  RESOLVED = 'RESOLVED'
}
