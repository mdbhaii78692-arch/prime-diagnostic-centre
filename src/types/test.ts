export type FastingRequirement = 
  | 'REQUIRED' 
  | 'NOT_REQUIRED' 
  | 'DEPENDS_ON_DOCTOR' 
  | 'CONFIRM_WITH_LAB' 
  | 'SPECIAL_INSTRUCTIONS';

export interface TestRecord {
  // 1. Unique test ID
  id: string;
  // 2. Standard test name
  name: string;
  // 3. Commonly used alternative names / synonyms
  synonyms: string[];
  // 4. Hindi test name or Hindi explanation
  nameHindi: string;
  // 5. English description
  description: string;
  // 6. Hindi description
  descriptionHindi: string;
  // 7. Main medical category
  category: string;
  // 8. Subcategory
  subcategory: string;
  // 9. What the test measures
  whatItMeasures: string;
  whatItMeasuresHindi: string;
  // 10. Why the test is performed
  whyPerformed: string;
  whyPerformedHindi: string;
  // 11. What conditions it may help evaluate
  conditionsEvaluated: string[];
  // 12. Required specimen type (e.g. Whole Blood, Serum, Plasma, Midstream Urine, Stool, Sputum, etc.)
  specimenType: string;
  // 13. Sample collection method
  collectionMethod: string;
  // 14. Whether fasting is required
  fastingRequirement: FastingRequirement;
  // 15. Whether fasting is optional
  fastingOptional: boolean;
  // 16. Whether fasting depends on doctor's instructions
  fastingDoctorDependent: boolean;
  // 17. Recommended fasting duration (e.g. "8-10 hours", "10-12 hours", "N/A")
  fastingDurationHours?: string;
  // 18. Whether water is generally permitted during fasting
  waterPermitted: boolean;
  // 19. Preparation instructions
  preparationInstructions: string;
  preparationInstructionsHindi: string;
  // 20. Medication-related precautions
  medicationPrecautions: string;
  // 21. Exercise or lifestyle precautions
  lifestylePrecautions?: string;
  // 22. Special instructions for women or children
  specialInstructions?: string;
  // 23. Approximate laboratory processing time
  processingTime?: string;
  // 24. Whether home sample collection is available
  homeCollectionAvailable: boolean;
  // 25. Whether a special collection container is required
  specialContainerRequired: boolean;
  specialContainerDetails?: string;
  // 26. Whether a special collection appointment is required (e.g. Semen, Timed Cortisol, X-Ray)
  specialAppointmentRequired: boolean;
  // 27. Whether the test requires a doctor's prescription
  prescriptionRequired: boolean;
  // 28. Clinical interpretation disclaimer
  interpretationDisclaimer: string;
  // 29. Source or reference used to verify the information
  verifiedReference: string;
  // 30. Last medical information review date
  lastReviewedDate: string;
  // 31. Whether the laboratory currently offers the test
  offeredByLab: boolean;
  // 32. Whether the test is active in public catalogue
  isActive: boolean;
}

export interface HealthCheckupPackage {
  id: string;
  name: string;
  nameHindi: string;
  tagline: string;
  taglineHindi: string;
  description: string;
  descriptionHindi: string;
  category: string;
  targetGroup: string;
  includedParametersCount: number;
  includedSampleTypes: string[];
  fastingRequired: boolean;
  fastingDuration: string;
  testCodes: string[];
  tests: string[];
  clinicalPurpose: string;
  clinicalPurposeHindi: string;
}

export interface TestCategoryMeta {
  id: string;
  name: string;
  nameHindi: string;
  shortDesc: string;
  shortDescHindi: string;
  iconName: string;
  sampleTypes: string[];
  isHomeCollectionSupported: boolean;
}
