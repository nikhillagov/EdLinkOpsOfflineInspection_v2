/**
 * Entity Models
 * Models for entities (centers, facilities, etc.)
 */

import type { Address, Person, Document Status, EntityStatus, EntityType } from '@/types/commonTypeDefinition';

export interface EntityModel {
  entityId: number;
  name: string;
  licenseNumber: string;
  licenseType: LicenseType;
  entityType: EntityType;
  status: EntityStatus;
  physicalAddress: Address;
  mailingAddress?: Address;
  phone: string;
  email: string;
  website?: string;
  owner?: Person;
  administrator?: Person;
  directorOfServices?: Person;
  documents: EntityDocument[];
  operatingHours?: OperatingHours;
  capacity?: Capacity;
  staff: CenterStaff[];
  ratings?: EntityRating;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export enum LicenseType {
  FAMILY_CHILD_CARE = 'FAMILY_CHILD_CARE',
  IN_HOME_CHILD_CARE = 'IN_HOME_CHILD_CARE',
  TYPE_1_CENTER = 'TYPE_1_CENTER',
  TYPE_2_CENTER = 'TYPE_2_CENTER',
  TYPE_3_CENTER = 'TYPE_3_CENTER',
  SCHOOL_BASED = 'SCHOOL_BASED'
}

export interface EntityDocument {
  documentId: number;
  entityId: number;
  documentType: string;
  name: string;
  uploadedDate: Date;
  expiryDate?: Date;
  filePath: string;
  uploadedBy: string;
  status: DocumentStatus;
}

export interface OperatingHours {
  operatingHoursId: number;
  entityId: number;
  mondayStart?: string;
  mondayEnd?: string;
  tuesdayStart?: string;
  tuesdayEnd?: string;
  wednesdayStart?: string;
  wednesdayEnd?: string;
  thursdayStart?: string;
  thursdayEnd?: string;
  fridayStart?: string;
  fridayEnd?: string;
  saturdayStart?: string;
  saturdayEnd?: string;
  sundayStart?: string;
  sundayEnd?: string;
  isOpenYear?: boolean;
  closedDays?: string;
  updatedAt: Date;
}

export interface Capacity {
  capacityId: number;
  entityId: number;
  infants: number;
  toddlers: number;
  preschool: number;
  schoolAge: number;
  total: number;
  lastUpdated: Date;
}

export interface CenterStaff {
  staffId: number;
  entityId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  ssn?: string;
  backgroundCheckStatus: BackgroundCheckStatus;
  backgroundCheckDate?: Date;
  backgroundCheckExpiry?: Date;
  degrees: Degree[];
  certifications: Certification[];
  status: StaffStatus;
  hireDate: Date;
  terminationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum BackgroundCheckStatus {
  PENDING = 'PENDING',
  CLEARED = 'CLEARED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}

export interface Degree {
  degreeId: number;
  staffId: number;
  type: DegreeType;
  field: string;
  institution: string;
  completionDate: Date;
  transcriptPath?: string;
}

export enum DegreeType {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORATE = 'DOCTORATE',
  OTHER = 'OTHER'
}

export interface Certification {
  certificationId: number;
  staffId: number;
  type: CertificationType;
  number?: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate?: Date;
  certificatePath?: string;
}

export enum CertificationType {
  CPR = 'CPR',
  FIRST_AID = 'FIRST_AID',
  CHILD_DEVELOPMENT = 'CHILD_DEVELOPMENT',
  DIRECTORS_CREDENTIAL = 'DIRECTORS_CREDENTIAL',
  TEACHER_CREDENTIAL = 'TEACHER_CREDENTIAL',
  OTHER = 'OTHER'
}

export interface EntityRating {
  ratingId: number;
  entityId: number;
  overallRating: number;
  complianceRating: number;
  qualityRating: number;
  safetyRating: number;
  lastEvaluationDate: Date;
  evaluationPath?: string;
}

export interface BusinessEntity {
  businessEntityId: number;
  entityId: number;
  businessName: string;
  businessType: BusinessType;
  dbaName?: string;
  federalEIN: string;
  stateID?: string;
  ownershipStructure: OwnershipStructure;
  businessAddress: Address;
  businessPhone: string;
  businessEmail: string;
}

export enum BusinessType {
  SOLE_PROPRIETOR = 'SOLE_PROPRIETOR',
  PARTNERSHIP = 'PARTNERSHIP',
  LLC = 'LLC',
  CORPORATION = 'CORPORATION',
  NON_PROFIT = 'NON_PROFIT'
}

export enum OwnershipStructure {
  INDIVIDUAL = 'INDIVIDUAL',
  PARTNERSHIP = 'PARTNERSHIP',
  LIMITED_LIABILITY = 'LIMITED_LIABILITY',
  CORPORATION = 'CORPORATION'
}
