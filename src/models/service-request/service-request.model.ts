/**
 * Service Request Models
 * Models for service requests, applications, and submissions
 */

import type { StatusCode } from '@/types/commonTypeDefinition';

export interface ServiceRequest {
  serviceRequestId: number;
  entityId: number;
  requestType: ServiceRequestType;
  status: ServiceRequestStatus;
  submittedDate: Date;
  submittedBy: string;
  approvedDate?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  requiredDocuments: ServiceRequestDocument[];
  children?: Child[];
  staff?: StaffMember[];
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export enum ServiceRequestType {
  ENROLLMENT = 'ENROLLMENT',
  CHANGE_OF_INFORMATION = 'CHANGE_OF_INFORMATION',
  RATE_CHANGE = 'RATE_CHANGE',
  CAPACITY_CHANGE = 'CAPACITY_CHANGE',
  HOURS_CHANGE = 'HOURS_CHANGE',
  DIRECTOR_CHANGE = 'DIRECTOR_CHANGE',
  FACILITY_CHANGE = 'FACILITY_CHANGE',
  PROGRAM_CHANGE = 'PROGRAM_CHANGE',
  OTHER = 'OTHER'
}

export enum ServiceRequestStatus {
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INFORMATION_REQUESTED = 'INFORMATION_REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface ServiceRequestDocument {
  documentId: number;
  serviceRequestId: number;
  documentType: string;
  documentName: string;
  uploadedDate: Date;
  uploadedBy: string;
  filePath: string;
  status: DocumentStatus;
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Child {
  childId: number;
  serviceRequestId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: string;
  parentGuardian: string;
  enrollmentDate?: Date;
  withdrawalDate?: Date;
  specialNeeds?: string;
  allergies?: string;
  medicalConditions?: string;
}

export interface StaffMember {
  staffMemberId: number;
  serviceRequestId: number;
  firstName: string;
  lastName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  qualifications: string;
}

export interface PendingApplication {
  applicationId: number;
  entityId: number;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  submittedDate: Date;
  estimatedCompletionDate?: Date;
  progressPercentage: number;
  currentStep: number;
  totalSteps: number;
  steps: ApplicationStep[];
  documents: ApplicationDocument[];
}

export enum ApplicationType {
  INITIAL_LICENSE = 'INITIAL_LICENSE',
  LICENSE_RENEWAL = 'LICENSE_RENEWAL',
  CAPACITY_INCREASE = 'CAPACITY_INCREASE',
  FACILITY_EXPANSION = 'FACILITY_EXPANSION',
  PROGRAM_EXPANSION = 'PROGRAM_EXPANSION'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INFORMATION_REQUESTED = 'INFORMATION_REQUESTED',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface ApplicationStep {
  stepId: number;
  applicationId: number;
  stepNumber: number;
  stepName: string;
  description: string;
  status: StepStatus;
  completedDate?: Date;
  remarks?: string;
}

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  BLOCKED = 'BLOCKED'
}

export interface ApplicationDocument {
  documentId: number;
  applicationId: number;
  documentType: string;
  documentName: string;
  uploadedDate: Date;
  filePath: string;
  status: DocumentStatus;
  remarks?: string;
}

export interface EnrollmentWorksheet {
  worksheetId: number;
  serviceRequestId: number;
  completedDate: Date;
  totalCapacity: number;
  infantCapacity: number;
  toddlerCapacity: number;
  preschoolCapacity: number;
  schoolAgeCapacity: number;
  enrolledInfants: number;
  enrolledToddlers: number;
  enrolledPreschool: number;
  enrolledSchoolAge: number;
  approvedBy?: string;
  remarks?: string;
}

export interface ChildRecord {
  childRecordId: number;
  worksheetId: number;
  childName: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  ageGroup: AgeGroup;
  parentGuardian: string;
  remarks?: string;
}

export enum AgeGroup {
  INFANT = 'INFANT',
  TODDLER = 'TODDLER',
  PRESCHOOL = 'PRESCHOOL',
  SCHOOL_AGE = 'SCHOOL_AGE'
}
