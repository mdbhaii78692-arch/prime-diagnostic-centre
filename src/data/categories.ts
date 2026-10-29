import { TestCategoryMeta } from '../types/test';

export const LAB_SERVICES: TestCategoryMeta[] = [
  {
    id: 'haematology',
    name: 'Haematology',
    nameHindi: 'रक्त विज्ञान (Haematology)',
    shortDesc: 'Complete blood counts, coagulation profiles, hemoglobin studies, and red/white blood cell investigations.',
    shortDescHindi: 'पूर्ण रक्त गणना (CBC), हीमोग्लोबिन, रक्त का थक्का जमना और अन्य रक्त संबंधी जांच।',
    iconName: 'Droplets',
    sampleTypes: ['Whole Blood (EDTA)', 'Citrated Plasma'],
    isHomeCollectionSupported: true
  },
  {
    id: 'clinical-biochemistry',
    name: 'Clinical Biochemistry',
    nameHindi: 'क्लीनिकल बायोकेमिस्ट्री',
    shortDesc: 'Blood glucose, HbA1c, liver function, kidney parameters, lipid profile, electrolytes, and enzymes.',
    shortDescHindi: 'ब्लड शुगर, HbA1c, लिवर फंक्शन, किडनी प्रोफाइल, लिपिड प्रोफाइल, इलेक्ट्रोलाइट्स और एंजाइम।',
    iconName: 'Activity',
    sampleTypes: ['Serum', 'Fluoride Plasma', 'Heparinised Plasma'],
    isHomeCollectionSupported: true
  },
  {
    id: 'hormones-endocrinology',
    name: 'Hormones & Endocrinology',
    nameHindi: 'हार्मोन एवं एंडोक्राइनोलॉजी',
    shortDesc: 'Thyroid profile (TSH, FT3, FT4), reproductive hormones, cortisol, insulin, prolactin, and fertility markers.',
    shortDescHindi: 'थायरॉइड प्रोफाइल (TSH, T3, T4), प्रजनन हार्मोन, कोर्टिसोल, इंसुलिन और फर्टिलिटी जांच।',
    iconName: 'Flame',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'immunology-serology',
    name: 'Immunology & Serology',
    nameHindi: 'इम्यूनोलॉजी एवं सेरोलॉजी',
    shortDesc: 'Autoimmune panels (ANA, Anti-CCP, RF), immunoglobulins, viral antibodies, and complement assays.',
    shortDescHindi: 'ऑटोइम्यून जांच (ANA, रूमेटाइड फैक्टर), एंटीबॉडी और इम्युनिटी संबंधी सेरोलॉजी टेस्ट।',
    iconName: 'ShieldCheck',
    sampleTypes: ['Serum', 'Plasma'],
    isHomeCollectionSupported: true
  },
  {
    id: 'microbiology',
    name: 'Microbiology & Cultures',
    nameHindi: 'माइक्रोबायोलॉजी एवं कल्चर जांच',
    shortDesc: 'Bacterial and fungal cultures (urine, blood, sputum, wound swab) with automated antibiotic sensitivity testing.',
    shortDescHindi: 'बैक्टीरियल एवं फंगल कल्चर (पेशाब, रक्त, कफ, पस) और एंटीबायोटिक संवेदनशीलता जांच।',
    iconName: 'Microscope',
    sampleTypes: ['Midstream Urine', 'Sterile Swab', 'Sputum', 'Blood'],
    isHomeCollectionSupported: true
  },
  {
    id: 'clinical-pathology',
    name: 'Clinical Pathology',
    nameHindi: 'क्लीनिकल पैथोलॉजी (पेशाब व मल जांच)',
    shortDesc: 'Routine & microscopic examination of urine, stool, body fluids, and semen analysis.',
    shortDescHindi: 'पेशाब (Urine Routine), मल (Stool Test) और शरीर के द्रवों की सूक्ष्मदर्शीय जांच।',
    iconName: 'FileSearch',
    sampleTypes: ['Clean Catch Urine', 'Fresh Stool', 'Semen (Lab Visit)'],
    isHomeCollectionSupported: true
  },
  {
    id: 'molecular-diagnostics',
    name: 'Molecular Diagnostics',
    nameHindi: 'मॉलिक्यूलर डायग्नोस्टिक्स (PCR)',
    shortDesc: 'High-precision RT-PCR for viral loads (HBV DNA, HCV RNA), GeneXpert MTB/RIF, and genetic markers.',
    shortDescHindi: 'RT-PCR द्वारा वायरल लोड (हेपेटाइटिस बी/सी), टीबी की GeneXpert जांच और आनुवंशिक टेस्ट।',
    iconName: 'Dna',
    sampleTypes: ['Whole Blood (EDTA)', 'Plasma', 'Sputum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'infectious-diseases',
    name: 'Infectious Disease Testing',
    nameHindi: 'संक्रामक रोग जांच',
    shortDesc: 'Dengue NS1/IgM, Typhoid Widal, Malaria Smear & Antigen, HIV, HBsAg, HCV, Syphilis, and seasonal fevers.',
    shortDescHindi: 'डेंगू, टायफाइड, मलेरिया, एचआईवी, हेपेटाइटिस और मौसमी बुखार संबंधी विश्वसनीय जांच।',
    iconName: 'Bug',
    sampleTypes: ['Serum', 'Whole Blood'],
    isHomeCollectionSupported: true
  },
  {
    id: 'vitamins-nutrition',
    name: 'Vitamins & Nutrition',
    nameHindi: 'विटामिन एवं पोषण जांच',
    shortDesc: 'Vitamin D3 (25-OH), Vitamin B12, Iron profile, Ferritin, Folate, and essential mineral markers.',
    shortDescHindi: 'विटामिन डी (Vitamin D), विटामिन बी12 (B12), आयरन प्रोफाइल, फोलिक एसिड और जिंक जांच।',
    iconName: 'Apple',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'cardiac-markers',
    name: 'Cardiac & Metabolic Testing',
    nameHindi: 'हृदय एवं मेटाबोलिक जांच',
    shortDesc: 'High-sensitivity Troponin I, CK-MB, NT-proBNP, Homocysteine, hs-CRP, and cardiovascular risk evaluation.',
    shortDescHindi: 'हृदय स्वास्थ्य जांच, ट्रॉपोनिन, होमोसिस्टीन, हाई-सेंसिटिविटी CRP और कार्डियक रिस्क मार्कर।',
    iconName: 'HeartPulse',
    sampleTypes: ['Serum', 'Citrated Plasma'],
    isHomeCollectionSupported: true
  },
  {
    id: 'renal-hepatic',
    name: 'Renal & Hepatic Profiles',
    nameHindi: 'किडनी एवं लिवर प्रोफाइल',
    shortDesc: 'Comprehensive organ assessment: Kidney Function Tests (KFT) and Liver Function Tests (LFT).',
    shortDescHindi: 'गुर्दे (किडनी) एवं यकृत (लिवर) के स्वास्थ्य की संपूर्ण जांच।',
    iconName: 'ClipboardList',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'diabetes-testing',
    name: 'Diabetes Testing',
    nameHindi: 'मधुमेह (डायबिटीज) जांच',
    shortDesc: 'Fasting Blood Glucose, Postprandial Glucose, Glycated Hemoglobin (HbA1c), and Average Blood Glucose.',
    shortDescHindi: 'फास्टिंग ब्लड शुगर, खाना खाने के बाद की शुगर (PP) और 3 महीने का औसत शुगर (HbA1c)।',
    iconName: 'Gauge',
    sampleTypes: ['Fluoride Plasma', 'Whole Blood (EDTA)'],
    isHomeCollectionSupported: true
  },
  {
    id: 'allergy-testing',
    name: 'Allergy Testing',
    nameHindi: 'एलर्जी जांच (Allergy Testing)',
    shortDesc: 'Total IgE and specific allergen panels (food, inhalants, dust mites, molds, skin allergies).',
    shortDescHindi: 'एलर्जी परीक्षण: टोटल IgE, खाद्य एलर्जी, धूल-मिट्टी व श्वास संबंधी एलर्जी पैनल।',
    iconName: 'ShieldAlert',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'cancer-markers',
    name: 'Cancer-Related Biomarkers',
    nameHindi: 'ट्यूमर मार्कर जांच',
    shortDesc: 'Medically recognised tumour markers (PSA, CA-125, CEA, CA 19-9, AFP) with strict clinical interpretation disclaimer.',
    shortDescHindi: 'चिकित्सीय ट्यूमर मार्कर (PSA, CA-125, CEA आदि) - केवल डॉक्टर के परामर्श अनुसार।',
    iconName: 'Stethoscope',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'therapeutic-drug-monitoring',
    name: 'Therapeutic Drug Monitoring',
    nameHindi: 'दवा स्तर निगरानी (TDM)',
    shortDesc: 'Plasma concentrations for narrow therapeutic index medicines (Phenytoin, Valproic acid, Digoxin, Lithium).',
    shortDescHindi: 'विशेष दवाओं के रक्त में सुरक्षित स्तर की जांच (जैसे मिर्गी व हृदय संबंधी दवाएं)।',
    iconName: 'Pill',
    sampleTypes: ['Serum'],
    isHomeCollectionSupported: true
  },
  {
    id: 'semen-analysis',
    name: 'Semen Analysis',
    nameHindi: 'वीर्य जांच (Semen Analysis)',
    shortDesc: 'Comprehensive sperm count, motility, morphology, and vitality (Requires dedicated laboratory visit).',
    shortDescHindi: 'शुक्राणु संख्या, गतिशीलता व संरचना जांच (विशेष निर्देश व लैब विजिट अनिवार्य)।',
    iconName: 'Sparkles',
    sampleTypes: ['Fresh Semen Specimen (On-Site Collection)'],
    isHomeCollectionSupported: false // IMPORTANT: Semen analysis requires lab visit
  },
  {
    id: 'x-ray-services',
    name: 'X-Ray Services',
    nameHindi: 'डिजिटल एक्स-रे सेवाएं (X-Ray)',
    shortDesc: 'Digital radiographic examinations conducted at Prime Diagnostic Centre facility in Kurla East.',
    shortDescHindi: 'डिजिटल एक्स-रे जांच - नेहरू नगर, कुर्ला ईस्ट स्थित लैब सेंटर पर उपलब्ध।',
    iconName: 'ScanLine',
    sampleTypes: ['Radiographic Image (Facility Only)'],
    isHomeCollectionSupported: false // Facility only
  },
  {
    id: 'full-body-checkups',
    name: 'Full Body Health Screening',
    nameHindi: 'फुल बॉडी हेल्थ चेकअप पैकेज',
    shortDesc: 'Curated preventative health profiles customized for wellness, senior citizens, women, and diabetes.',
    shortDescHindi: 'नियमित स्वास्थ्य निगरानी के लिए तैयार किए गए समग्र जांच पैकेज (होम कलेक्शन उपलब्ध)।',
    iconName: 'UserCheck',
    sampleTypes: ['Whole Blood', 'Serum', 'Urine'],
    isHomeCollectionSupported: true
  }
];
