import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CalendarPlus, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  UploadCloud,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { getMasterCatalogue } from '../../data/catalogueDatabase';
import { TestRecord } from '../../types/test';
import { PrescriptionDoc, BookingRecord } from '../../types/booking';
import { PrescriptionUploader } from '../Common/PrescriptionUploader';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingWorkflowProps {
  initialSelectedTests?: TestRecord[];
  initialBookingMode?: 'PRESCRIPTION_ONLY' | 'CATALOGUE_TESTS';
  onCancel: () => void;
}

export const BookingWorkflow: React.FC<BookingWorkflowProps> = ({
  initialSelectedTests = [],
  initialBookingMode,
  onCancel
}) => {
  const { language, t } = useLanguage();
  const { createBooking } = useBooking();

  // Booking mode: either uploading prescription directly (fastest, no test picking) or manually choosing tests
  const [bookingMode, setBookingMode] = useState<'PRESCRIPTION_ONLY' | 'CATALOGUE_TESTS'>(
    initialBookingMode || (initialSelectedTests.length > 0 ? 'CATALOGUE_TESTS' : 'PRESCRIPTION_ONLY')
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  // Step 1: Tests or Prescription
  const [selectedTests, setSelectedTests] = useState<TestRecord[]>(initialSelectedTests);
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [prescriptionDoc, setPrescriptionDoc] = useState<PrescriptionDoc | undefined>();
  const [doctorName, setDoctorName] = useState('');

  // Step 2: Patient
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'>('MALE');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');

  // Step 3: Address
  const [addressLine, setAddressLine] = useState('');
  const [locality, setLocality] = useState('Nehru Nagar, Kurla East');
  const [pinCode, setPinCode] = useState('400024');
  const [landmark, setLandmark] = useState('');

  // Step 4: Schedule
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [preferredDate, setPreferredDate] = useState(tomorrowStr);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 AM - 08:30 AM (Fasting Preferred)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step Consent
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const allCatalogue = React.useMemo(() => getMasterCatalogue(), []);

  const searchResults = React.useMemo(() => {
    if (!testSearchQuery.trim()) return [];
    const q = testSearchQuery.toLowerCase();
    return allCatalogue
      .filter((t) => t.homeCollectionAvailable && (t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [allCatalogue, testSearchQuery]);

  const isMinor = typeof age === 'number' && age < 18;

  // Total steps depending on mode:
  // PRESCRIPTION_ONLY: 5 steps (1. Prescription, 2. Patient, 3. Address, 4. Schedule, 5. Review & Submit)
  // CATALOGUE_TESTS: 6 steps (1. Tests, 2. Patient, 3. Address, 4. Schedule, 5. Rx/Doctor, 6. Review & Submit)
  const totalSteps = bookingMode === 'PRESCRIPTION_ONLY' ? 5 : 6;
  const reviewStepNumber = totalSteps;

  const handleAddTest = (test: TestRecord) => {
    if (!selectedTests.some((t) => t.id === test.id)) {
      setSelectedTests([...selectedTests, test]);
    }
    setTestSearchQuery('');
  };

  const handleRemoveTest = (id: string) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== id));
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);

    // Step 1 Validation
    if (currentStep === 1) {
      if (bookingMode === 'PRESCRIPTION_ONLY') {
        if (!prescriptionDoc) {
          setErrorMsg(
            language === 'hi'
              ? 'कृपया आगे बढ़ने के लिए डॉक्टर की पर्ची की फोटो या स्कैन अपलोड करें।'
              : 'Please upload a photo or scan of your doctor prescription to proceed.'
          );
          return false;
        }
        return true;
      } else {
        if (selectedTests.length === 0) {
          setErrorMsg(
            language === 'hi'
              ? 'कृपया होम विजिट के लिए कम से कम एक टेस्ट चुनें।'
              : 'Please select at least one diagnostic test for home collection.'
          );
          return false;
        }
        return true;
      }
    }

    // Step 2 Validation (Patient details)
    if (currentStep === 2) {
      if (!patientName.trim()) {
        setErrorMsg(language === 'hi' ? 'कृपया मरीज का नाम दर्ज करें।' : 'Please enter patient full name.');
        return false;
      }
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        setErrorMsg(
          language === 'hi'
            ? 'कृपया एक वैध 10-अंकों का भारतीय मोबाइल नंबर दर्ज करें।'
            : 'Please enter a valid 10-digit Indian mobile number.'
        );
        return false;
      }
      if (!age || age < 0 || age > 125) {
        setErrorMsg(language === 'hi' ? 'कृपया एक वैध उम्र दर्ज करें।' : 'Please enter a valid age.');
        return false;
      }
      if (isMinor && !guardianName.trim()) {
        setErrorMsg(
          language === 'hi'
            ? '18 वर्ष से कम उम्र के मरीज के लिए अभिभावक का नाम अनिवार्य है।'
            : 'Guardian name is required for patients under 18 years.'
        );
        return false;
      }
      return true;
    }

    // Step 3 Validation (Address)
    if (currentStep === 3) {
      if (!addressLine.trim() || addressLine.trim().length < 6) {
        setErrorMsg(
          language === 'hi'
            ? 'कृपया पूरा घर का पता दर्ज करें।'
            : 'Please enter a complete residential address.'
        );
        return false;
      }
      if (!pinCode || !/^\d{6}$/.test(pinCode.trim())) {
        setErrorMsg(
          language === 'hi'
            ? 'कृपया 6 अंकों का वैध पिन कोड दर्ज करें।'
            : 'Please enter a valid 6-digit PIN code.'
        );
        return false;
      }
      return true;
    }

    // Step 4 Validation (Schedule)
    if (currentStep === 4) {
      if (!preferredDate) {
        setErrorMsg(language === 'hi' ? 'कृपया विजिट की तारीख चुनें।' : 'Please select a preferred visit date.');
        return false;
      }
      if (!preferredTimeSlot.trim()) {
        setErrorMsg(language === 'hi' ? 'कृपया अपनी पसंद का समय लिखें।' : 'Please enter your preferred visit time.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!dpdpConsent || !privacyConsent) {
      setErrorMsg(
        language === 'hi'
          ? 'आगे बढ़ने के लिए कृपया स्वास्थ्य डेटा प्रसंस्करण और गोपनीयता सहमति स्वीकार करें।'
          : 'Please accept health data processing and privacy consent to proceed.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '');

      // Determine test labels based on booking mode
      const isRxOnly = bookingMode === 'PRESCRIPTION_ONLY';
      const testIds = isRxOnly
        ? ['RX-UPLOAD-PENDING']
        : selectedTests.map((t) => t.id);

      const testNames = isRxOnly
        ? [
            language === 'hi'
              ? 'अपलोड की गई डॉक्टर पर्ची अनुसार (लैब स्टाफ द्वारा टेस्ट सत्यापित किए जाएंगे)'
              : 'As per Uploaded Doctor Prescription (To be reviewed & registered by Lab Staff)'
          ]
        : selectedTests.map((t) => t.name);

      const newBooking = await createBooking({
        bookingType: bookingMode,
        patientName: patientName.trim(),
        mobileNumber: cleanMobile,
        age: Number(age),
        gender,
        isMinor,
        guardianName: isMinor ? guardianName.trim() : undefined,
        guardianRelationship: isMinor ? guardianRelation.trim() : undefined,
        addressLine: addressLine.trim(),
        locality: locality.trim(),
        pinCode: pinCode.trim(),
        landmark: landmark.trim() || undefined,
        city: 'Mumbai',
        referringDoctor: doctorName.trim() || (isRxOnly ? 'As per Prescription' : 'Self-Referral'),
        selectedTestIds: testIds,
        selectedTestNames: testNames,
        hasPrescription: !!prescriptionDoc,
        prescription: prescriptionDoc,
        preferredDate,
        preferredTimeSlot,
        specialInstructions: specialInstructions.trim() || undefined,
        privacyConsentAccepted: privacyConsent,
        healthDataProcessingConsent: dpdpConsent,
        consentTimestamp: new Date().toISOString()
      });

      setConfirmedBooking(newBooking);
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <BookingConfirmation
        booking={confirmedBooking}
        onBookAnother={() => {
          setConfirmedBooking(null);
          setCurrentStep(1);
          setSelectedTests([]);
          setPrescriptionDoc(undefined);
          setPatientName('');
          setMobileNumber('');
        }}
        onDone={onCancel}
      />
    );
  }

  const timeSlots = [
    '06:30 AM - 08:00 AM (Fasting Preferred)',
    '08:00 AM - 09:30 AM (Fasting Preferred)',
    '09:30 AM - 11:00 AM',
    '11:00 AM - 12:30 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Cancel & Title */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'रद्द करें' : 'Back to Centre'}</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Card Frame */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('bookingTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('bookingSubtitle')}
            </p>
          </div>

          {/* MODE SELECTOR (Only shown on Step 1) */}
          {currentStep === 1 && (
            <div className="mb-6 p-1.5 bg-slate-100 rounded-2xl flex flex-col sm:flex-row items-stretch gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBookingMode('PRESCRIPTION_ONLY');
                  setErrorMsg(null);
                }}
                className={`flex-1 p-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  bookingMode === 'PRESCRIPTION_ONLY'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span>{language === 'hi' ? 'पर्ची अपलोड करें (टेस्ट चुनने की जरूरत नहीं)' : 'Upload Prescription (No test search)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingMode('CATALOGUE_TESTS');
                  setErrorMsg(null);
                }}
                className={`flex-1 p-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  bookingMode === 'CATALOGUE_TESTS'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>{language === 'hi' ? 'कैटलॉग से टेस्ट खुद चुनें' : 'Select Tests from Catalogue'}</span>
              </button>
            </div>
          )}

          {/* STEP 1 (PRESCRIPTION_ONLY MODE) */}
          {currentStep === 1 && bookingMode === 'PRESCRIPTION_ONLY' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>{language === 'hi' ? 'सरल एवं सुविधाजनक बुकिंग' : 'Fast & Easy Booking via Prescription'}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {language === 'hi'
                    ? 'आपको 2,500+ कैटलॉग में कोई भी टेस्ट खोजने या नाम टाइप करने की आवश्यकता नहीं है। बस अपने डॉक्टर की पर्ची की साफ फोटो अपलोड करें। हमारी लैब टीम पर्ची देखकर सभी टेस्ट स्वयं दर्ज करेगी और आपको फोन पर पूरी जानकारी देगी।'
                    : 'You do not need to search or select tests from the catalogue. Simply upload your doctor prescription photo. Our laboratory staff and pathologist will review the prescribed tests, arrange vacutainers, and confirm your home visit.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  {language === 'hi' ? 'डॉक्टर की पर्ची अपलोड करें (फोटो या पीडीएफ) *' : 'Upload Doctor Prescription (Photo or PDF) *'}
                </label>
                <PrescriptionUploader
                  prescription={prescriptionDoc}
                  onChange={setPrescriptionDoc}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {language === 'hi' ? 'डॉक्टर या क्लिनिक का नाम (वैकल्पिक)' : "Doctor's Name / Clinic (Optional)"}
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder={language === 'hi' ? 'जैसे डॉ. जोशी, कुर्ला क्लिनिक (या पर्ची में लिखा नाम)' : "e.g. Dr. Joshi, Kurla Clinic (or as in Rx)"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 1 (CATALOGUE_TESTS MODE) */}
          {currentStep === 1 && bookingMode === 'CATALOGUE_TESTS' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepSelectTests')}
              </h2>

              {/* Selected Tests List */}
              {selectedTests.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    {language === 'hi' ? 'चयनित टेस्ट (' + selectedTests.length + ')' : 'Selected Diagnostic Tests (' + selectedTests.length + '):'}
                  </label>
                  <div className="space-y-2">
                    {selectedTests.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                      >
                        <div className="truncate mr-2">
                          <p className="font-bold text-slate-900 truncate">{t.name}</p>
                          <p className="text-teal-800 text-[11px] truncate">{t.nameHindi}</p>
                          <span className="text-slate-500 text-[11px]">
                            {t.category} · {t.specimenType}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTest(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                          title="Remove test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {language === 'hi'
                    ? 'कृपया नीचे दी गई सूची से कम से कम एक टेस्ट जोड़ें।'
                    : 'Please search and add at least one test to proceed.'}
                </div>
              )}

              {/* Search and add more tests */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-800 block">
                  {language === 'hi' ? 'कैटलॉग से अतिरिक्त टेस्ट जोड़ें:' : 'Search & Add Additional Tests:'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={testSearchQuery}
                    onChange={(e) => setTestSearchQuery(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'टेस्ट का नाम या कोड टाइप करें (जैसे CBC, TSH, LFT, लिपिड)...'
                        : 'Type test name or code (e.g. CBC, Lipid, HbA1c, Vitamin D)...'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Dropdown search results */}
                {searchResults.length > 0 && (
                  <div className="border border-slate-200 rounded-xl bg-white shadow-lg overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddTest(item)}
                        className="p-2.5 hover:bg-teal-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </div>
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          + Add
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PATIENT DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepPatientInfo')}
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldPatientName')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rajesh S. Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('fieldMobile')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    maxLength={10}
                    placeholder="e.g. 9820145892"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    10-digit Indian mobile number for visit call coordination.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('fieldAge')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    min={0}
                    max={125}
                    placeholder="e.g. 45"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldGender')} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none bg-white"
                >
                  <option value="MALE">{t('genderMale')}</option>
                  <option value="FEMALE">{t('genderFemale')}</option>
                  <option value="OTHER">{t('genderOther')}</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              {/* Minor Warning / Guardian Fields */}
              {isMinor && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <p className="text-xs font-semibold text-amber-900">
                    {t('fieldMinorNotice')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        {t('fieldGuardianName')} *
                      </label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Parent / Guardian Name"
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                        {t('fieldGuardianRelation')}
                      </label>
                      <input
                        type="text"
                        value={guardianRelation}
                        onChange={(e) => setGuardianRelation(e.target.value)}
                        placeholder="e.g. Mother, Father"
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ADDRESS & LOCALITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepAddress')}
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldAddress')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 302, Sai Krupa CHS, 4th Floor, Station Road"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('fieldLocality')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Nehru Nagar, Kurla East"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('fieldPinCode')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    maxLength={6}
                    placeholder="e.g. 400024"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldLandmark')}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Shiv Sena Shakha / Nehru Nagar Post Office"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepSchedule')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('fieldPreferredDate')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={tomorrowStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Appointments are requested from tomorrow onward.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-800">
                      {language === 'hi' ? 'अपनी पसंद का समय लिखें (Custom Time)' : 'Enter Preferred Time'} <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                      {language === 'hi' ? 'खुद टाइप करें' : 'Type own time'}
                    </span>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 w-4 h-4 text-teal-700" />
                    <input
                      type="text"
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      placeholder={
                        language === 'hi'
                          ? 'उदा. सुबह 06:45 बजे, 07:30 AM (फास्टिंग), 10:15 AM, या दोपहर 3:00 बजे'
                          : 'e.g. 06:45 AM, 07:30 AM (Fasting), 10:15 AM, or 04:00 PM'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none bg-white font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'ऊपर कोई भी समय लिखें, या नीचे दिए गए सुझावों में से चुनें:'
                      : 'Type any convenient time above, or click a quick suggestion:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      '06:30 AM (Early)',
                      '07:15 AM (Fasting)',
                      '08:00 AM (Fasting)',
                      '09:00 AM',
                      '10:30 AM',
                      '02:30 PM',
                      '05:00 PM'
                    ].map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreferredTimeSlot(slot)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                          preferredTimeSlot === slot
                            ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldInstructions')}
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice; elderly patient needing gentle handling"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5 (ONLY FOR CATALOGUE_TESTS MODE: Prescription & Doctor) */}
          {currentStep === 5 && bookingMode === 'CATALOGUE_TESTS' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepPrescription')}
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t('fieldDoctorName')}
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Joshi, Kurla Clinic (or Self-Monitoring)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t('fieldPrescriptionUpload')}
                </label>
                <PrescriptionUploader
                  prescription={prescriptionDoc}
                  onChange={setPrescriptionDoc}
                />
              </div>
            </div>
          )}

          {/* FINAL STEP: REVIEW & STATUTORY CONSENT (Step 5 for PRESCRIPTION_ONLY, Step 6 for CATALOGUE_TESTS) */}
          {currentStep === reviewStepNumber && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('stepReview')}
              </h2>

              {/* Review summary box */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-5 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Booking Mode:</span>
                  <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {bookingMode === 'PRESCRIPTION_ONLY'
                      ? (language === 'hi' ? 'डॉक्टर की पर्ची अपलोड (पर्ची अनुसार टेस्ट)' : 'Doctor Prescription Upload (No manual test picking)')
                      : (language === 'hi' ? 'कैटलॉग टेस्ट चयन' : 'Manual Test Selection')}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Patient:</span>
                  <span className="font-bold text-slate-800">{patientName} ({age} yrs, {gender})</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Mobile:</span>
                  <span className="font-medium text-slate-800 font-mono">{mobileNumber}</span>
                </div>

                <div className="flex items-start justify-between pb-2 border-b border-slate-200 gap-4">
                  <span className="font-semibold text-slate-900 shrink-0">Address:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {addressLine}, {locality}, PIN {pinCode}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Schedule:</span>
                  <span className="font-medium text-slate-800">{preferredDate} · {preferredTimeSlot}</span>
                </div>

                {/* Tests summary */}
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">
                    {language === 'hi' ? 'जांच (Tests):' : 'Tests to be collected:'}
                  </span>
                  {bookingMode === 'PRESCRIPTION_ONLY' ? (
                    <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200 text-teal-950 font-medium">
                      <p className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                        <span>{language === 'hi' ? 'अपलोड की गई डॉक्टर पर्ची अनुसार' : 'As per Uploaded Doctor Prescription'}</span>
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {language === 'hi'
                          ? 'हमारा लैब स्टाफ आपकी पर्ची का निरीक्षण करके सभी आवश्यक टेस्ट जोड़ देगा और फोन पर पुष्टि करेगा।'
                          : 'Our pathologist will review the prescription, identify all tests, and confirm preparation with you.'}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {selectedTests.map((t) => (
                        <li key={t.id} className="flex items-center gap-1.5 font-medium text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          <span>{t.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {prescriptionDoc && (
                  <div className="pt-2 border-t border-slate-200 text-emerald-800 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Prescription Attached: {prescriptionDoc.fileName}</span>
                  </div>
                )}
              </div>

              {/* DPDP Act 2023 Statutory Consents */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3 text-xs text-slate-700">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300 mt-0.5"
                  />
                  <span className="leading-relaxed">
                    {t('consentDPDPA')}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300 mt-0.5"
                  />
                  <span className="leading-relaxed">
                    {t('consentTerms')}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btnBack')}</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < reviewStepNumber ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <span>{t('btnNext')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="py-3 px-8 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-teal-100" />
                <span>{isSubmitting ? 'Registering...' : t('btnSubmitBooking')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
