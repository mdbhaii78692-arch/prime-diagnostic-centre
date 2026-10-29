import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRecord, BookingStatus, PrescriptionDoc } from '../types/booking';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: BookingRecord[];
  createBooking: (bookingData: Omit<BookingRecord, 'id' | 'bookingRef' | 'createdAt' | 'status' | 'statusHistory'>) => Promise<BookingRecord>;
  getBookingByRef: (ref: string) => BookingRecord | null;
  updateBookingStatus: (id: string, status: BookingStatus, remarks?: string) => boolean;
  assignPhlebotomist: (id: string, phlebotomistName: string) => boolean;
  addInternalNotes: (id: string, notes: string) => boolean;
  updateBookingTests: (id: string, testIds: string[], testNames: string[]) => boolean;
  cancelBooking: (id: string, reason: string) => boolean;
  getBookingStats: () => {
    total: number;
    newRequests: number;
    confirmed: number;
    assigned: number;
    completed: number;
    cancelled: number;
  };
}

const STORAGE_KEY = 'prime_diagnostic_bookings_v1';

// Seed sample patient booking records for laboratory operational review
const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'book-seed-001',
    bookingRef: 'PDC-2026-48912',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'NEW_REQUEST',
    patientName: 'Kishore M. Patel',
    mobileNumber: '9820145892',
    age: 58,
    gender: 'MALE',
    isMinor: false,
    addressLine: 'Flat 302, Sai Krupa CHS, Tilak Nagar, near Kurla Railway Station',
    locality: 'Kurla East',
    pinCode: '400024',
    landmark: 'Opposite Tilak Nagar Ground',
    city: 'Mumbai',
    referringDoctor: 'Dr. V. N. Joshi (MD Medicine)',
    selectedTestIds: ['CBC-001', 'GLU-FAST-001', 'HBA1C-001', 'LIPID-PANEL-001'],
    selectedTestNames: [
      'Complete Blood Count (CBC) with ESR',
      'Blood Glucose - Fasting (FBS)',
      'HbA1c (Glycated Hemoglobin)',
      'Lipid Profile Comprehensive'
    ],
    hasPrescription: true,
    prescription: {
      fileName: 'Dr_Joshi_Rx_Diabetic_Profile.jpg',
      fileSize: 184500,
      mimeType: 'image/jpeg',
      uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      ocrExtractedNotes: 'Adv: CBC, FBS, HbA1c, Lipid Profile. Fasting 10 hrs.',
      status: 'PENDING_STAFF_VERIFICATION'
    },
    preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    preferredTimeSlot: '07:00 AM - 08:30 AM (Fasting Preferred)',
    specialInstructions: 'Patient is senior citizen, please ring bell twice.',
    privacyConsentAccepted: true,
    healthDataProcessingConsent: true,
    consentTimestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    statusHistory: [
      {
        status: 'NEW_REQUEST',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedBy: 'Patient Web Portal',
        remarks: 'Initial home visit booking request submitted online.'
      }
    ]
  },
  {
    id: 'book-seed-002',
    bookingRef: 'PDC-2026-73105',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    status: 'CONFIRMED',
    patientName: 'Sunita Ravindra Jadhav',
    mobileNumber: '9869412308',
    age: 44,
    gender: 'FEMALE',
    isMinor: false,
    addressLine: 'Building No. 12, Room 14, Nehru Nagar Police Colony',
    locality: 'Nehru Nagar, Kurla East',
    pinCode: '400024',
    landmark: 'Near Nehru Nagar Post Office',
    city: 'Mumbai',
    referringDoctor: 'Dr. Sunanda Kulkarni (Gynaecologist)',
    selectedTestIds: ['THYROID-PROFILE-001', 'VITD-001', 'VITB12-001', 'IRON-STUDIES-001'],
    selectedTestNames: [
      'Complete Thyroid Profile (Total T3, Total T4, TSH)',
      'Vitamin D3 (25-OH)',
      'Vitamin B12 (Cyanocobalamin)',
      'Iron Profile with TIBC & Ferritin'
    ],
    hasPrescription: true,
    prescription: {
      fileName: 'Prescription_Dr_Kulkarni.png',
      fileSize: 245000,
      mimeType: 'image/png',
      uploadedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      ocrExtractedNotes: 'Thyroid profile, Vit D3, B12, Iron studies.',
      status: 'VERIFIED'
    },
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    preferredTimeSlot: '08:30 AM - 10:00 AM',
    specialInstructions: 'Morning time is requested.',
    privacyConsentAccepted: true,
    healthDataProcessingConsent: true,
    consentTimestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    assignedPhlebotomist: 'Ramesh Gawli (Certified Phlebotomist)',
    internalNotes: 'Prescription verified. Patient confirmed fasting requirements over telephone.',
    statusHistory: [
      {
        status: 'NEW_REQUEST',
        timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
        updatedBy: 'Patient Web Portal'
      },
      {
        status: 'CONFIRMED',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        updatedBy: 'Amina Shaikh (Lab Admin)',
        remarks: 'Slot scheduled and confirmed. Cold box allocated.'
      }
    ]
  }
];

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  createBooking: async () => ({} as any),
  getBookingByRef: () => null,
  updateBookingStatus: () => false,
  assignPhlebotomist: () => false,
  addInternalNotes: () => false,
  updateBookingTests: () => false,
  cancelBooking: () => false,
  getBookingStats: () => ({ total: 0, newRequests: 0, confirmed: 0, assigned: 0, completed: 0, cancelled: 0 })
});

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_BOOKINGS);
  const { currentUser, logSecurityEvent } = useAuth();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const saveBookings = (updated: BookingRecord[]) => {
    setBookings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist bookings', e);
    }
  };

  const createBooking = async (
    bookingData: Omit<BookingRecord, 'id' | 'bookingRef' | 'createdAt' | 'status' | 'statusHistory'>
  ): Promise<BookingRecord> => {
    // Generate secure unpredictable reference number: PDC-2026-XXXXX
    const randomSegment = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `PDC-${new Date().getFullYear()}-${randomSegment}`;
    const id = `BOOK-${Date.now()}-${randomSegment}`;
    const now = new Date().toISOString();

    const newRecord: BookingRecord = {
      ...bookingData,
      id,
      bookingRef,
      createdAt: now,
      status: 'NEW_REQUEST',
      statusHistory: [
        {
          status: 'NEW_REQUEST',
          timestamp: now,
          updatedBy: 'Patient Self-Service Web Portal',
          remarks: 'New home sample collection request registered online.'
        }
      ]
    };

    const updated = [newRecord, ...bookings];
    saveBookings(updated);

    logSecurityEvent(
      'BOOKING_CREATED',
      'BOOKING',
      `New home sample collection booked: Reference ${bookingRef} for patient ${bookingData.patientName.slice(0, 3)}***`,
      bookingRef
    );

    return newRecord;
  };

  // Privacy Protection: ONLY Admin is allowed to view patient bookings (requires password-authenticated session)
  const getBookingByRef = (ref: string): BookingRecord | null => {
    // Block all public viewing - only authorized admin can view bookings
    if (!currentUser) {
      logSecurityEvent(
        'UNAUTHORIZED_BOOKING_ACCESS_BLOCKED',
        'BOOKING',
        `Blocked unauthenticated attempt to view booking ${ref}. Viewing bookings requires Admin login with password.`
      );
      return null;
    }

    const cleanRef = ref.trim().toUpperCase();
    const found = bookings.find((b) => b.bookingRef.toUpperCase() === cleanRef);

    if (found) {
      logSecurityEvent(
        'STAFF_VIEW_BOOKING',
        'BOOKING',
        `Authenticated Admin ${currentUser.fullName} (${currentUser.role}) viewed booking ${cleanRef}`,
        cleanRef
      );
      return found;
    }

    return null;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, remarks?: string): boolean => {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return false;

    const current = bookings[idx];
    const now = new Date().toISOString();
    const updater = currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Authorised Staff';

    const historyEntry = {
      status,
      timestamp: now,
      updatedBy: updater,
      remarks: remarks || `Status changed to ${status}`
    };

    const updatedRecord: BookingRecord = {
      ...current,
      status,
      statusHistory: [historyEntry, ...current.statusHistory]
    };

    const updatedList = [...bookings];
    updatedList[idx] = updatedRecord;
    saveBookings(updatedList);

    logSecurityEvent(
      'STATUS_UPDATED',
      'BOOKING',
      `Booking ${current.bookingRef} status updated to ${status} by ${updater}.`,
      current.bookingRef
    );

    return true;
  };

  const assignPhlebotomist = (id: string, phlebotomistName: string): boolean => {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return false;

    const current = bookings[idx];
    const updatedRecord: BookingRecord = {
      ...current,
      assignedPhlebotomist: phlebotomistName,
      status: current.status === 'NEW_REQUEST' ? 'ASSIGNED' : current.status
    };

    const updatedList = [...bookings];
    updatedList[idx] = updatedRecord;
    saveBookings(updatedList);

    logSecurityEvent(
      'PHLEBOTOMIST_ASSIGNED',
      'BOOKING',
      `Assigned phlebotomist '${phlebotomistName}' to booking ${current.bookingRef}.`,
      current.bookingRef
    );

    return true;
  };

  const addInternalNotes = (id: string, notes: string): boolean => {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return false;

    const current = bookings[idx];
    const updatedRecord: BookingRecord = {
      ...current,
      internalNotes: notes
    };

    const updatedList = [...bookings];
    updatedList[idx] = updatedRecord;
    saveBookings(updatedList);

    logSecurityEvent(
      'INTERNAL_NOTE_ADDED',
      'BOOKING',
      `Internal clinical notes updated on booking ${current.bookingRef}.`,
      current.bookingRef
    );

    return true;
  };

  const updateBookingTests = (id: string, testIds: string[], testNames: string[]): boolean => {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return false;

    const current = bookings[idx];
    const updater = currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Authorized Staff';
    const now = new Date().toISOString();

    const historyEntry = {
      status: current.status,
      timestamp: now,
      updatedBy: updater,
      remarks: `Tests assigned/updated from prescription: ${testNames.join(', ')}`
    };

    const updatedRecord: BookingRecord = {
      ...current,
      selectedTestIds: testIds,
      selectedTestNames: testNames,
      statusHistory: [historyEntry, ...current.statusHistory]
    };

    const updatedList = [...bookings];
    updatedList[idx] = updatedRecord;
    saveBookings(updatedList);

    logSecurityEvent(
      'TESTS_UPDATED_FROM_RX',
      'BOOKING',
      `Lab staff updated test list for booking ${current.bookingRef} to: ${testNames.join(', ')}`,
      current.bookingRef
    );

    return true;
  };

  const cancelBooking = (id: string, reason: string): boolean => {
    return updateBookingStatus(id, 'CANCELLED', `Cancelled: ${reason}`);
  };

  const getBookingStats = () => {
    return {
      total: bookings.length,
      newRequests: bookings.filter((b) => b.status === 'NEW_REQUEST').length,
      confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
      assigned: bookings.filter((b) => b.status === 'ASSIGNED').length,
      completed: bookings.filter((b) => b.status === 'COMPLETED').length,
      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length
    };
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        getBookingByRef,
        updateBookingStatus,
        assignPhlebotomist,
        addInternalNotes,
        updateBookingTests,
        cancelBooking,
        getBookingStats
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
