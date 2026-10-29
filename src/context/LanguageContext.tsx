import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brandName: 'PRIME DIAGNOSTIC CENTRE',
    tagline: 'Your Health, Our Priority',
    locationShort: 'Nehru Nagar, Kurla East, Mumbai',
    fullAddress: 'Shop No. 4, Building No. 40, Nehru Nagar, Kurla East, Mumbai, Maharashtra, India',
    primaryPhone: '7208627822',
    secondaryPhone: '7208088515',
    
    // Nav
    navHome: 'Home',
    navTests: 'All Tests',
    navPrepGuide: 'Test Preparation',
    navPackages: 'Health Checkups',
    navBookVisit: 'Book Home Visit',
    navTrackBooking: 'Track Booking',
    navAbout: 'About Us',
    navAdmin: 'Admin Portal (Password Required)',
    viewBookingsAdminOnly: 'View Bookings (Admin Only - Password Required)',
    
    // Hero
    heroHeading: 'Quality Diagnostics, Care at Your Doorstep',
    heroDescription: 'Explore diagnostic tests, understand test preparation requirements, and request home sample collection from Prime Diagnostic Centre.',
    heroBtnExplore: 'Explore All Tests',
    heroBtnBook: 'Book Home Visit',
    heroBtnCall: 'Call Laboratory',
    heroBadge: 'Trusted Diagnostic Laboratory in Kurla East',
    
    // Key Stats / USPs
    uspVerifiedTests: '2,500+ Diagnostic Tests',
    uspHomeCollection: 'Comfort of Your Home',
    uspColdChain: 'Certified Cold-Chain Sample Handling',
    uspNablProtocol: 'Strict NABL Quality Guidelines',
    
    // Categories
    sectionServicesTitle: 'Diagnostic Services & Specialisations',
    sectionServicesSubtitle: 'From routine blood investigations to advanced molecular biology, fully supervised by qualified laboratory specialists.',
    viewAllServices: 'View All Tests in This Category',
    homeCollectionBadge: 'Home Collection Available',
    facilityOnlyBadge: 'Lab Facility Only',
    
    // Popular Tests
    popularTestsTitle: 'Frequently Recommended Tests',
    popularTestsSubtitle: 'Common diagnostic investigations routinely prescribed by physicians.',
    
    // Health Checkup Packages
    packagesTitle: 'Preventative Health Screening Profiles',
    packagesSubtitle: 'Curated wellness packages to monitor vital parameters and detect early systemic changes.',
    packageParameters: 'Parameters Evaluated',
    packageTarget: 'Recommended For',
    packageSampleTypes: 'Specimen Types',
    packageIncludes: 'Tests Included',
    packageBookBtn: 'Request Home Visit for this Package',
    noPriceNotice: 'Contact laboratory for test registration and slot scheduling.',
    
    // How it works
    howItWorksTitle: 'How Home Sample Collection Works',
    howItWorksSubtitle: 'Professional phlebotomy service right at your doorstep in Kurla and surrounding Mumbai areas.',
    step1Title: 'Select Your Tests',
    step1Desc: 'Choose individual tests or comprehensive checkup profiles from our verified catalogue.',
    step2Title: 'Provide Patient Details',
    step2Desc: 'Enter address, preferred morning slot, and doctor name. Attach doctor prescription if available.',
    step3Title: 'Phlebotomist Visit',
    step3Desc: 'Trained, certified phlebotomist arrives with sterile vacuum tubes and maintains strict cold chain.',
    step4Title: 'Safe Laboratory Processing',
    step4Desc: 'Samples processed on precision automated analyzers adhering to stringent internal quality controls.',
    
    // Test Preparation Guide
    prepGuideTitle: 'Test Preparation Guide',
    prepGuideSubtitle: 'Search any diagnostic test to verify fasting requirements, medication precautions, and special instructions.',
    fastingRequiredLabel: 'Fasting Usually Required',
    fastingNotRequiredLabel: 'Fasting Usually Not Required',
    fastingDependsLabel: 'Fasting Depends on Doctor Instructions',
    fastingSpecialLabel: 'Special Collection Instructions',
    fastingConfirmLabel: 'Preparation Must Be Confirmed',
    questionFasting: 'Is fasting required for this test?',
    questionPurpose: 'Why is this test performed?',
    questionPreparation: 'What precautions should be taken before the test?',
    questionWater: 'Can the patient drink plain water during fasting?',
    waterAllowedText: 'Yes, plain drinking water is permitted to maintain normal hydration.',
    waterNotAllowedText: 'Strict nil by mouth. Confirm with the laboratory.',
    
    // Search & Catalogue
    searchPlaceholder: 'Search 2,500+ tests by name, abbreviation (CBC, TSH, HbA1c), Hindi name...',
    filterAllCategories: 'All Categories',
    filterAllFasting: 'All Fasting Statuses',
    filterAllSpecimens: 'All Specimen Types',
    filterHomeAvailable: 'Home Collection Only',
    showingResults: 'Showing {count} verified laboratory tests',
    viewDetailsBtn: 'View Test Details',
    bookThisTestBtn: 'Book Home Visit',
    noTestsFound: 'No diagnostic tests found matching your criteria. Try alternative medical terms or contact our laboratory desk.',
    
    // Booking Form
    bookingTitle: 'Book a Home Sample Collection',
    bookingSubtitle: 'Nehru Nagar, Kurla East & surrounding Mumbai regions. Trained phlebotomy staff with cold-chain protocol.',
    bookingMethodChoice: 'Choose Booking Method',
    methodPrescription: 'Upload Doctor Prescription (No need to select tests)',
    methodPrescriptionSub: 'Fastest way! Just upload a photo of your prescription. Our laboratory staff will review and arrange the prescribed tests.',
    methodManual: 'Select Tests from Catalogue',
    methodManualSub: 'Manually search and choose from our 2,500+ verified diagnostic test database.',
    btnUploadRxAndBook: 'Upload Prescription & Book Visit',
    rxOnlySummaryLabel: 'As per Uploaded Doctor Prescription (Lab Staff to Verify & Register Tests)',
    stepSelectTests: '1. Select Tests',
    stepPrescriptionFirst: '1. Prescription & Doctor',
    stepPatientInfo: '2. Patient Details',
    stepAddress: '3. Address & Area',
    stepSchedule: '4. Date & Slot',
    stepPrescription: '5. Prescription & Doctor',
    stepReview: '6. Review & Confirm',
    
    // Form fields
    fieldPatientName: 'Patient Full Name',
    fieldMobile: '10-Digit Mobile Number',
    fieldAge: 'Age (in Years)',
    fieldGender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other / Prefer not to say',
    fieldMinorNotice: 'For patients under 18 years, please enter parent or legal guardian details.',
    fieldGuardianName: 'Parent / Guardian Name',
    fieldGuardianRelation: 'Relationship to Minor',
    fieldAddress: 'Complete Residential Address (Flat / House No., Building Name, Street)',
    fieldLocality: 'Area / Locality in Mumbai',
    fieldPinCode: 'PIN Code (e.g. 400024)',
    fieldLandmark: 'Nearby Landmark',
    fieldDoctorName: 'Referring Doctor / Clinic Name (or Self-Referral)',
    fieldPreferredDate: 'Preferred Visit Date',
    fieldPreferredTime: 'Preferred Time Slot',
    fieldInstructions: 'Special Instructions / Landmark Guidance',
    fieldPrescriptionUpload: 'Upload Doctor Prescription (Optional / If Available)',
    prescriptionHelp: 'Supports clear photograph or scan (JPG, PNG, PDF up to 10MB). Stored securely and accessible only to authorised staff.',
    consentDPDPA: 'I consent to the collection and processing of health information by Prime Diagnostic Centre for sample collection and testing under the Digital Personal Data Protection Act, 2023.',
    consentTerms: 'I agree to the laboratory Privacy Policy and verify the entered details are accurate.',
    btnNext: 'Next Step',
    btnBack: 'Previous',
    btnSubmitBooking: 'Submit Home Visit Request',
    
    // Confirmation
    confirmationTitle: 'Home Sample Collection Request Submitted',
    confirmationSubtitle: 'Your request has been received by Prime Diagnostic Centre desk. Authorised laboratory staff will contact you shortly to review and confirm your visit.',
    bookingRefLabel: 'Booking Reference ID',
    saveRefInstruction: 'Please quote this unique reference number for any communications with our laboratory.',
    statusNewRequest: 'New Request (Awaiting Lab Confirmation)',
    disclaimerBookingNotice: 'Home collection appointment is subject to review and confirmation by laboratory dispatch staff based on route coverage and patient preparation status.',
    contactLabPrompt: 'Need immediate assistance or have urgent inquiries?',
    
    // Report assistance strict text
    reportAssistanceText: 'For report-related assistance, please contact Prime Diagnostic Centre directly.',
    
    // Medical Disclaimer strict text
    medicalDisclaimerText: 'Information provided by Prime Diagnostic Centre is intended for general educational purposes and test preparation. It does not replace medical advice, diagnosis, or treatment. Test requirements may vary according to individual circumstances. Please consult your doctor or laboratory for test-specific instructions.',
    
    // Emergency warning
    emergencyNotice: 'Emergency Notice: If you or the patient are experiencing severe chest pain, acute breathlessness, loss of consciousness, or severe acute trauma, please seek immediate emergency care at the nearest hospital emergency room. Diagnostic laboratory bookings are not suitable for medical emergencies.',
    
    // Contact
    contactTitle: 'Contact Prime Diagnostic Centre',
    contactSubtitle: 'Located in the heart of Nehru Nagar, Kurla East, Mumbai.',
    callUs: 'Call Us Directly',
    whatsappUs: 'Chat on WhatsApp',
    addressLabel: 'Laboratory Address',
    timingsDisclaimer: 'For sample booking schedules and laboratory visits, please call our primary desk.',
    
    // Privacy
    privacyTitle: 'Patient Privacy & Health Data Protection',
    privacyCommitment: 'In accordance with the Digital Personal Data Protection Act (DPDPA), 2023, patient names, mobile numbers, addresses, and medical test records are treated with the highest confidentiality. Only authorised laboratory personnel have access to sensitive records under strict role-based controls.'
  },
  hi: {
    // Brand
    brandName: 'PRIME DIAGNOSTIC CENTRE',
    tagline: 'आपकी सेहत, हमारी प्राथमिकता',
    locationShort: 'नेहरू नगर, कुर्ला पूर्व, मुंबई',
    fullAddress: 'दुकान नं. 4, इमारत नं. 40, नेहरू नगर, कुर्ला पूर्व, मुंबई, महाराष्ट्र, भारत',
    primaryPhone: '7208627822',
    secondaryPhone: '7208088515',
    
    // Nav
    navHome: 'होम',
    navTests: 'सभी टेस्ट',
    navPrepGuide: 'टेस्ट की तैयारी',
    navPackages: 'हेल्थ चेकअप',
    navBookVisit: 'होम कलेक्शन बुक करें',
    navTrackBooking: 'बुकिंग स्टेटस',
    navAbout: 'हमारे बारे में',
    navAdmin: 'एडमिन लॉगिन (पासवर्ड आवश्यक)',
    viewBookingsAdminOnly: 'बुकिंग्स देखें (केवल एडमिन - पासवर्ड आवश्यक)',
    
    // Hero
    heroHeading: 'विश्वसनीय जांच, आपके घर तक',
    heroDescription: 'जांच की जानकारी प्राप्त करें, टेस्ट की तैयारी समझें और Prime Diagnostic Centre से घर पर सैंपल कलेक्शन के लिए अनुरोध करें।',
    heroBtnExplore: 'सभी टेस्ट देखें',
    heroBtnBook: 'घर पर सैंपल बुक करें',
    heroBtnCall: 'लैब से बात करें',
    heroBadge: 'कुर्ला ईस्ट में विश्वसनीय एवं प्रमाणित पैथोलॉजी लैब',
    
    // Key Stats / USPs
    uspVerifiedTests: '2,500+ प्रमाणित टेस्ट रिकॉर्ड्स',
    uspHomeCollection: 'घर बैठे सुविधाजनक सैंपल कलेक्शन',
    uspColdChain: 'कोल्ड-चेन सुरक्षित सैंपल हैंडलिंग',
    uspNablProtocol: 'सख्त गुणवत्ता मानक एवं नियंत्रण',
    
    // Categories
    sectionServicesTitle: 'पैथोलॉजी जांच सेवाएं एवं विभाग',
    sectionServicesSubtitle: 'सामान्य रक्त परीक्षण से लेकर अत्याधुनिक मॉलिक्यूलर जांच तक, अनुभवी पैथोलॉजिस्ट्स की देखरेख में।',
    viewAllServices: 'इस श्रेणी के सभी टेस्ट देखें',
    homeCollectionBadge: 'घर पर कलेक्शन उपलब्ध',
    facilityOnlyBadge: 'केवल लैब सेंटर पर उपलब्ध',
    
    // Popular Tests
    popularTestsTitle: 'अक्सर करवाए जाने वाले प्रमुख टेस्ट',
    popularTestsSubtitle: 'डॉक्टरों द्वारा नियमित रूप से लिखे जाने वाले आवश्यक डायग्नोस्टिक टेस्ट।',
    
    // Health Checkup Packages
    packagesTitle: 'फुल बॉडी हेल्थ चेकअप पैकेज',
    packagesSubtitle: 'समग्र स्वास्थ्य निगरानी और बीमारियों से बचाव के लिए तैयार किए गए जांच पैकेज।',
    packageParameters: 'कुल जांच पैरामीटर',
    packageTarget: 'किनके लिए उपयुक्त',
    packageSampleTypes: 'सैंपल का प्रकार',
    packageIncludes: 'शामिल टेस्ट',
    packageBookBtn: 'इस पैकेज के लिए होम विजिट बुक करें',
    noPriceNotice: 'टेस्ट पंजीकरण और स्लॉट निर्धारण के लिए लैब से संपर्क करें।',
    
    // How it works
    howItWorksTitle: 'घर पर सैंपल कलेक्शन कैसे होता है?',
    howItWorksSubtitle: 'कुर्ला और आसपास के मुंबई इलाकों में प्रशिक्षित लैब तकनीशियन द्वारा घर पर सुरक्षित सैंपल कलेक्शन।',
    step1Title: 'टेस्ट चुनें',
    step1Desc: 'हमारे प्रमाणित कैटलॉग से अपने आवश्यक टेस्ट या चेकअप पैकेज चुनें।',
    step2Title: 'मरीज की जानकारी दर्ज करें',
    step2Desc: 'मरीज का नाम, पता, फोन नंबर और डॉक्टर की पर्ची (यदि हो) अपलोड करें।',
    step3Title: 'घर पर सैंपल संग्रह',
    step3Desc: 'प्रशिक्षित फ्लेबोटोमिस्ट सुरक्षित एवं बाँझ उपकरणों के साथ समय पर आपके घर पहुंचते हैं।',
    step4Title: 'सटीक लैब विश्लेषण',
    step4Desc: 'सैंपल का स्वचालित अत्याधुनिक मशीनों द्वारा सख्त गुणवत्ता नियंत्रण में विश्लेषण।',
    
    // Test Preparation Guide
    prepGuideTitle: 'टेस्ट से पहले की तैयारी',
    prepGuideSubtitle: 'किसी भी टेस्ट के लिए खाली पेट रहने की आवश्यकता, दवाओं से संबंधित सावधानियां और विशेष निर्देश जानें।',
    fastingRequiredLabel: 'खाली पेट रहना जरूरी है',
    fastingNotRequiredLabel: 'खाली पेट रहना जरूरी नहीं है',
    fastingDependsLabel: 'डॉक्टर के निर्देशानुसार खाली पेट रहें',
    fastingSpecialLabel: 'विशेष निर्देश आवश्यक हैं',
    fastingConfirmLabel: 'लैब से पुष्टि करना आवश्यक है',
    questionFasting: 'क्या इस टेस्ट के लिए खाली पेट रहना जरूरी है?',
    questionPurpose: 'यह टेस्ट क्यों किया जाता है?',
    questionPreparation: 'टेस्ट कराने से पहले क्या सावधानी रखनी चाहिए?',
    questionWater: 'क्या खाली पेट रहने के दौरान सादा पानी पी सकते हैं?',
    waterAllowedText: 'हाँ, शरीर में पानी की कमी से बचने के लिए सादा पानी पीना सुरक्षित और उचित है।',
    waterNotAllowedText: 'कुछ भी न लें। कृपया पहले लैब तकनीशियन से पुष्टि करें।',
    
    // Search & Catalogue
    searchPlaceholder: '2,500+ टेस्ट में खोजें (जैसे CBC, थायरॉइड, शुगर, विटामिन D, पेशाब की जांच)...',
    filterAllCategories: 'सभी श्रेणियां',
    filterAllFasting: 'खाली पेट की सभी स्थितियां',
    filterAllSpecimens: 'सैंपल के सभी प्रकार',
    filterHomeAvailable: 'केवल होम कलेक्शन वाले',
    showingResults: '{count} प्रमाणित टेस्ट दिखाए जा रहे हैं',
    viewDetailsBtn: 'पूरी जानकारी देखें',
    bookThisTestBtn: 'घर पर सैंपल बुक करें',
    noTestsFound: 'आपकी खोज के अनुसार कोई टेस्ट नहीं मिला। कृपया अन्य शब्द का उपयोग करें या सीधे लैब से संपर्क करें।',
    
    // Booking Form
    bookingTitle: 'घर पर सैंपल कलेक्शन बुक करें',
    bookingSubtitle: 'नेहरू नगर, कुर्ला ईस्ट और मुंबई क्षेत्र के लिए प्रशिक्षित तकनीशियन द्वारा होम विजिट।',
    bookingMethodChoice: 'बुकिंग का तरीका चुनें',
    methodPrescription: 'डॉक्टर की पर्ची अपलोड करें (टेस्ट खोजने की आवश्यकता नहीं)',
    methodPrescriptionSub: 'सबसे आसान तरीका! केवल डॉक्टर की पर्ची की फोटो अपलोड करें। हमारा लैब स्टाफ पर्ची देखकर आवश्यक टेस्ट स्वयं दर्ज करेगा।',
    methodManual: 'कैटलॉग से टेस्ट खुद चुनें',
    methodManualSub: 'हमारे 2,500+ प्रमाणित टेस्ट में से अपनी पसंद की जांचें चुनें।',
    btnUploadRxAndBook: 'पर्ची अपलोड करके बुक करें',
    rxOnlySummaryLabel: 'अपलोड की गई डॉक्टर की पर्ची अनुसार (लैब स्टाफ द्वारा सत्यापित कर टेस्ट जोड़े जाएंगे)',
    stepSelectTests: '1. टेस्ट चुनें',
    stepPrescriptionFirst: '1. डॉक्टर की पर्ची',
    stepPatientInfo: '2. मरीज का विवरण',
    stepAddress: '3. पूरा पता',
    stepSchedule: '4. तारीख और समय',
    stepPrescription: '5. पर्ची और डॉक्टर',
    stepReview: '6. समीक्षा और पुष्टि',
    
    // Form fields
    fieldPatientName: 'मरीज का पूरा नाम',
    fieldMobile: '10 अंकों का मोबाइल नंबर',
    fieldAge: 'उम्र (वर्षों में)',
    fieldGender: 'लिंग',
    genderMale: 'पुरुष',
    genderFemale: 'महिला',
    genderOther: 'अन्य',
    fieldMinorNotice: '18 वर्ष से कम उम्र के मरीजों के लिए माता-पिता या अभिभावक का नाम अनिवार्य है।',
    fieldGuardianName: 'अभिभावक / माता-पिता का नाम',
    fieldGuardianRelation: 'मरीज से संबंध',
    fieldAddress: 'घर का पूरा पता (फ्लैट/मकान नं., बिल्डिंग, सड़क)',
    fieldLocality: 'इलाका / क्षेत्र (मुंबई)',
    fieldPinCode: 'पिन कोड (जैसे 400024)',
    fieldLandmark: 'निकटतम लैंडमार्क',
    fieldDoctorName: 'डॉक्टर का नाम या क्लिनिक (या स्वयं)',
    fieldPreferredDate: 'सैंपल कलेक्शन की तारीख',
    fieldPreferredTime: 'पसंदीदा समय स्लॉट',
    fieldInstructions: 'अतिरिक्त निर्देश / लैंडमार्क',
    fieldPrescriptionUpload: 'डॉक्टर की पर्ची अपलोड करें (वैकल्पिक)',
    prescriptionHelp: 'स्पष्ट फोटो या स्कैन (JPG, PNG, PDF 10MB तक)। यह फाइल सुरक्षित रखी जाती है और केवल अधिकृत स्टाफ देख सकता है।',
    consentDPDPA: 'मैं डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट, 2023 के तहत Prime Diagnostic Centre को सैंपल कलेक्शन हेतु स्वास्थ्य जानकारी एकत्र करने की सहमति देता/देती हूँ।',
    consentTerms: 'मैं लैब की गोपनीयता नीति से सहमत हूँ और पुष्टि करता हूँ कि दी गई जानकारी सत्य है।',
    btnNext: 'आगे बढ़ें',
    btnBack: 'पीछे जाएं',
    btnSubmitBooking: 'होम विजिट का अनुरोध सबमिट करें',
    
    // Confirmation
    confirmationTitle: 'होम कलेक्शन का अनुरोध सफलतापूर्वक दर्ज हुआ',
    confirmationSubtitle: 'आपका अनुरोध Prime Diagnostic Centre को प्राप्त हो गया है। हमारी अधिकृत टीम जल्द ही आपसे संपर्क कर विजिट की पुष्टि करेगी।',
    bookingRefLabel: 'बुकिंग रेफरेंस नंबर',
    saveRefInstruction: 'कृपया किसी भी पूछताछ के लिए इस रेफरेंस नंबर को सुरक्षित रखें।',
    statusNewRequest: 'नया अनुरोध (लैब पुष्टि की प्रतीक्षा)',
    disclaimerBookingNotice: 'होम कलेक्शन का समय लैब स्टाफ द्वारा रूट और मरीज की तैयारी की पुष्टि के बाद ही अंतिम माना जाएगा।',
    contactLabPrompt: 'तत्काल जानकारी या सहायता के लिए लैब से संपर्क करें:',
    
    // Report assistance strict text
    reportAssistanceText: 'रिपोर्ट से संबंधित जानकारी के लिए कृपया Prime Diagnostic Centre से सीधे संपर्क करें।',
    
    // Medical Disclaimer strict text
    medicalDisclaimerText: 'Prime Diagnostic Centre द्वारा दी गई जानकारी सामान्य जानकारी और जांच की तैयारी के लिए है। यह डॉक्टर की सलाह, निदान या उपचार का विकल्प नहीं है। व्यक्ति की स्थिति के अनुसार टेस्ट की आवश्यकताएं अलग हो सकती हैं। कृपया विशेष निर्देशों के लिए अपने डॉक्टर या लैब से संपर्क करें।',
    
    // Emergency warning
    emergencyNotice: 'आपातकालीन सूचना: यदि मरीज को सीने में तेज दर्द, सांस लेने में अत्यधिक तकलीफ, बेहोशी या गंभीर चोट है, तो कृपया तुरंत नजदीकी अस्पताल के आपातकालीन विभाग में जाएं। पैथोलॉजी लैब बुकिंग आपातकालीन स्थितियों के लिए नहीं है।',
    
    // Contact
    contactTitle: 'Prime Diagnostic Centre से संपर्क करें',
    contactSubtitle: 'नेहरू नगर, कुर्ला ईस्ट, मुंबई में स्थित आपकी अपनी डायग्नोस्टिक लैब।',
    callUs: 'सीधे कॉल करें',
    whatsappUs: 'व्हाट्सएप पर संपर्क करें',
    addressLabel: 'लैब का पता',
    timingsDisclaimer: 'सैंपल बुकिंग और लैब विजिट संबंधी समय के लिए कृपया सीधे कॉल करें।',
    
    // Privacy
    privacyTitle: 'मरीज की गोपनीयता एवं स्वास्थ्य डेटा सुरक्षा',
    privacyCommitment: 'डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट (DPDPA), 2023 के अंतर्गत मरीज का नाम, मोबाइल नंबर, पता और मेडिकल रिकॉर्ड्स पूर्णतः गोपनीय रखे जाते हैं। केवल अधिकृत लैब स्टाफ ही इन जानकारियों को देख सकता है।'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('prime_lang_pref');
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('prime_lang_pref', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict[key]) {
      return langDict[key];
    }
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
