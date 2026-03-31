/**
 * Inspection Models
 * Models for inspections, observations, findings, etc.
 */

import type { Priority, StatusCode } from '@/types/commonTypeDefinition';

export interface Inspection {
  inspectionId: number;
  actionRequestId: number;
  allInspectionSchedulingId: number;
  inspectionType: InspectionType;
  inspectionStatus: InspectionStatus;
  priority: Priority;
  assignedToUser?: string;
  assignedToUserId?: number;
  dueDate: Date;
  startDate?: Date;
  completionDate?: Date;
  requestedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  observations: Observation[];
  findings: Finding[];
  correctionOrders: CorrectionOrder[];
  deficiencies: Deficiency[];
  actionItems: ActionItem[];
  notes: Note[];
}

export enum InspectionType {
  INITIAL = 'INITIAL',
  ANNUAL = 'ANNUAL',
  COMPLAINT = 'COMPLAINT',
  INCIDENT = 'INCIDENT',
  FOLLOW_UP = 'FOLLOW_UP',
  UNANNOUNCED = 'UNANNOUNCED',
  OTHER = 'OTHER'
}

export enum InspectionStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  PENDING_REVIEW = 3,
  APPROVED = 4,
  REJECTED = 5,
  CANCELLED = 6
}

export interface Observation {
  observationId: number;
  inspectionId: number;
  regulationNumber: string;
  regulationDescription: string;
  observationCategory: ObservationCategory;
  observationType: ObservationType;
  observation: string;
  isCompliant: boolean;
  evidenceNotes?: string;
  photoPaths?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ObservationCategory {
  CHILD_DEVELOPMENT = 'CHILD_DEVELOPMENT',
  HEALTH_AND_SAFETY = 'HEALTH_AND_SAFETY',
  STAFF_QUALIFICATIONS = 'STAFF_QUALIFICATIONS',
  ENVIRONMENT = 'ENVIRONMENT',
  NUTRITION = 'NUTRITION',
  COMMUNICATION = 'COMMUNICATION',
  ADMINISTRATION = 'ADMINISTRATION',
  OTHER = 'OTHER'
}

export enum ObservationType {
  STRENGTH = 'STRENGTH',
  NEUTRAL = 'NEUTRAL',
  CONCERN = 'CONCERN',
  VIOLATION = 'VIOLATION'
}

export interface Finding {
  findingId: number;
  inspectionId: number;
  regulationNumber: string;
  findingType: FindingType;
  severity: FindingSeverity;
  description: string;
  correctionRequired: boolean;
  timelineForCorrection?: Date;
  status: FindingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum FindingType {
  TECHNICAL = 'TECHNICAL',
  REGULATORY = 'REGULATORY',
  ADMINISTRATIVE = 'ADMINISTRATIVE'
}

export enum FindingSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  SERIOUS = 'SERIOUS',
  CRITICAL = 'CRITICAL'
}

export enum FindingStatus {
  OPEN = 'OPEN',
  CORRECTED = 'CORRECTED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED'
}

export interface DeficiencyReport {
  deficiencyId: number;
  inspectionId: number;
  category: DeficiencyCategory;
  ruleNumber: string;
  description: string;
  severity: DeficiencySeverity;
  correctionRequired: boolean;
  correctionDeadline?: Date;
  correctionVerified: boolean;
  correctionVerifiedDate?: Date;
  correctionVerifiedBy?: string;
  status: DeficiencyStatus;
}

export interface Deficiency {
  deficiencyId: number;
  inspectionId: number;
  regulationNumber: string;
  description: string;
  severity: DeficiencySeverity;
  correctionRequired: boolean;
  correctionDeadline?: Date;
  status: DeficiencyStatus;
}

export enum DeficiencyCategory {
  SERIOUS = 'SERIOUS',
  MODERATE = 'MODERATE',
  MINOR = 'MINOR'
}

export enum DeficiencySeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum DeficiencyStatus {
  OPEN = 'OPEN',
  CORRECTED = 'CORRECTED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED',
  WAIVED = 'WAIVED'
}

export interface CorrectionOrder {
  correctionId: number;
  inspectionId: number;
  orderNumber: string;
  issuedDate: Date;
  dueDate: Date;
  correctionRequirements: string;
  completionVerified: boolean;
  completionVerifiedDate?: Date;
  completionVerifiedBy?: string;
  status: CorrectionOrderStatus;
}

export enum CorrectionOrderStatus {
  ISSUED = 'ISSUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED'
}

export interface ActionItem {
  actionItemId: number;
  inspectionId: number;
  actionItemTypeName: string;
  progressStatusId: number;
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  description?: string;
  actionItemData: ActionItemData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItemData {
  actionItemDataId: number;
  actionItemId?: number;
  actionItemProgressId?: number;
  field: string;
  data: string;
  dataType?: string;
}

export interface Note {
  noteId: number;
  inspectionId: number;
  content: string;
  noteType: NoteType;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum NoteType {
  GENERAL = 'GENERAL',
  INTERNAL = 'INTERNAL',
  FINDING = 'FINDING',
  CORRECTION = 'CORRECTION'
}

export interface InspectionSchedule {
  allInspectionSchedulingId: number;
  actionRequestId: number;
  entityId: number;
  scheduledDate: Date;
  inspectionType: InspectionType;
  inspectionStatus: InspectionStatus;
  priority: Priority;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
