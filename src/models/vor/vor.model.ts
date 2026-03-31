/**
 * VOR (Verification of Operations Request) Models
 * Models for verification operations and compliance reports
 */

export interface VORRequest {
  vorId: number;
  actionRequestId: number;
  entityId: number;
  requestDate: Date;
  vorType: VORType;
  status: VORStatus;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  assignedTo?: string;
  findings: VORFinding[];
  observations: VORObservation[];
  correctionOrders: VORCorrectionOrder[];
  signature?: VORSignature;
  summary?: VORSummary;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export enum VORType {
  INITIAL = 'INITIAL',
  ANNUAL = 'ANNUAL',
  FOLLOW_UP = 'FOLLOW_UP',
  COMPLAINT_BASED = 'COMPLAINT_BASED',
  INCIDENT_BASED = 'INCIDENT_BASED'
}

export enum VORStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  REPORT_GENERATED = 'REPORT_GENERATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED'
}

export interface VORFinding {
  findingId: number;
  vorId: number;
  regulationNumber: string;
  regulationDescription: string;
  findingType: VORFindingType;
  severity: VORSeverity;
  description: string;
  evidence: string;
  correctionRequired: boolean;
  timelineForCorrection?: Date;
  status: VORFindingStatus;
}

export enum VORFindingType {
  COMPLIANCE = 'COMPLIANCE',
  NON_COMPLIANCE = 'NON_COMPLIANCE',
  BEST_PRACTICE = 'BEST_PRACTICE',
  COMMENDATION = 'COMMENDATION'
}

export enum VORSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  SERIOUS = 'SERIOUS',
  CRITICAL = 'CRITICAL'
}

export enum VORFindingStatus {
  OPEN = 'OPEN',
  CORRECTED = 'CORRECTED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED'
}

export interface VORObservation {
  observationId: number;
  vorId: number;
  observationType: VORObservationType;
  description: string;
  timeObserved: Date;
  location: string;
  staffInvolved?: string[];
  childrenInvolved?: number;
  photoPaths?: string[];
  remarks?: string;
}

export enum VORObservationType {
  CHILD_INTERACTION = 'CHILD_INTERACTION',
  STAFF_CONDUCT = 'STAFF_CONDUCT',
  FACILITIES = 'FACILITIES',
  SAFETY = 'SAFETY',
  HEALTH = 'HEALTH',
  NUTRITION = 'NUTRITION',
  OTHER = 'OTHER'
}

export interface VORCorrectionOrder {
  correctionId: number;
  vorId: number;
  orderNumber: string;
  issuedDate: Date;
  dueDate: Date;
  correctionRequirements: string;
  status: CorrectionOrderStatus;
  completionVerified: boolean;
  completionVerifiedDate?: Date;
  completionVerifiedBy?: string;
}

export enum CorrectionOrderStatus {
  ISSUED = 'ISSUED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED'
}

export interface VORSignature {
  signatureId: number;
  vorId: number;
  signedBy: string;
  signedByTitle: string;
  signedDate: Date;
  signaturePath?: string;
  entityRepresentative?: string;
  representativeSignature?: string;
  representativeSignatureDate?: Date;
}

export interface VORSummary {
  summaryId: number;
  vorId: number;
  overallCompliance: ComplianceRating;
  majorFindings: number;
  minorFindings: number;
  commendations: number;
  totalCorrectionOrders: number;
  estimatedCorrectionCost?: number;
  summary: string;
  recommendations?: string;
  generateReportDate?: Date;
}

export enum ComplianceRating {
  FULLY_COMPLIANT = 'FULLY_COMPLIANT',
  SUBSTANTIALLY_COMPLIANT = 'SUBSTANTIALLY_COMPLIANT',
  NOT_COMPLIANT = 'NOT_COMPLIANT',
  UNABLE_TO_DETERMINE = 'UNABLE_TO_DETERMINE'
}

export interface InspectionObservationForm {
  formId: number;
  vorId: number;
  observationDate: Date;
  timeStart: string;
  timeEnd: string;
  areas: InspectionArea[];
  generalObservations: string;
  inspectorComments?: string;
}

export interface InspectionArea {
  areaId: number;
  formId: number;
  areaName: string;
  ruleNumbers: string[];
  observations: string;
  compliance: boolean;
  photos?: string[];
}

export interface RegulationDescription {
  regulationId: number;
  vorId: number;
  ruleNumber: string;
  ruleTitle: string;
  ruleDescription: string;
  applicabilityStatus: RuleApplicability;
  remarks?: string;
}

export enum RuleApplicability {
  APPLICABLE = 'APPLICABLE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PARTIALLY_APPLICABLE = 'PARTIALLY_APPLICABLE'
}
