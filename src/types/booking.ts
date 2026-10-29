export type BookingStatus =
  | 'NEW_REQUEST'
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'SAMPLE_COLLECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'UNABLE_TO_FULFIL';

export interface PrescriptionDoc {
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl?: string;
  uploadedAt: string;
  ocrExtractedNotes?: string;
  status: 'PENDING_STAFF_VERIFICATION' | 'VERIFIED' | 'REJECTED';
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  timestamp: string;
  updatedBy: string;
  remarks?: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string; // e.g. PDC-2026-84920
  createdAt: string;
  status: BookingStatus;
  
  // Patient details
  patientName: string;
  mobileNumber: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  isMinor: boolean;
  guardianName?: string;
  guardianRelationship?: string;
  
  // Address details
  addressLine: string;
  locality: string;
  pinCode: string;
  landmark?: string;
  city: string; // Mumbai
  
  // Medical & Booking details
  bookingType?: 'PRESCRIPTION_ONLY' | 'CATALOGUE_TESTS';
  referringDoctor: string;
  selectedTestIds: string[];
  selectedTestNames: string[];
  hasPrescription: boolean;
  prescription?: PrescriptionDoc;
  
  // Appointment schedule
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string;
  specialInstructions?: string;
  
  // Consent
  privacyConsentAccepted: boolean;
  healthDataProcessingConsent: boolean;
  consentTimestamp: string;
  
  // Administrative fields
  assignedPhlebotomist?: string;
  internalNotes?: string;
  cancellationReason?: string;
  statusHistory: StatusHistoryEntry[];
}

export interface BookingFilters {
  status?: BookingStatus | 'ALL';
  searchTerm?: string;
  date?: string;
}
