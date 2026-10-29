import { TestRecord, FastingRequirement } from '../types/test';
import { generateMasterTestDatabase } from './masterCatalogueGenerator';

const STORAGE_KEY = 'prime_diagnostic_catalogue_v1';

let cachedDatabase: TestRecord[] | null = null;

export function getMasterCatalogue(): TestRecord[] {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  // Attempt to read customized / imported catalogue from localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 2000) {
          cachedDatabase = parsed;
          return cachedDatabase;
        }
      }
    } catch {
      // fallback to generated
    }
  }

  cachedDatabase = generateMasterTestDatabase();
  // Persist if in browser
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedDatabase));
    } catch {
      // LocalStorage quota might be tight for 2,500 records; keep in memory cachedDatabase
    }
  }

  return cachedDatabase;
}

export function saveCatalogue(tests: TestRecord[]) {
  cachedDatabase = tests;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
    } catch (e) {
      console.warn('Could not persist entire catalogue to localStorage due to size quota; stored in memory.', e);
    }
  }
}

export interface SearchFilters {
  query?: string;
  category?: string;
  fastingRequirement?: FastingRequirement | 'ALL';
  specimenType?: string;
  homeCollectionOnly?: boolean;
  activeOnly?: boolean;
}

export function searchCatalogue(filters: SearchFilters): { results: TestRecord[]; totalCount: number } {
  const allTests = getMasterCatalogue();
  const query = (filters.query || '').trim().toLowerCase();
  const category = filters.category || 'ALL';
  const fasting = filters.fastingRequirement || 'ALL';
  const specimen = filters.specimenType || 'ALL';
  const homeOnly = !!filters.homeCollectionOnly;
  const activeOnly = filters.activeOnly !== false;

  const filtered = allTests.filter((test) => {
    if (activeOnly && !test.isActive) return false;
    if (homeOnly && !test.homeCollectionAvailable) return false;
    if (category !== 'ALL' && test.category.toLowerCase() !== category.toLowerCase()) return false;
    if (fasting !== 'ALL' && test.fastingRequirement !== fasting) return false;
    if (specimen !== 'ALL' && !test.specimenType.toLowerCase().includes(specimen.toLowerCase())) return false;

    if (!query) return true;

    // Search against multiple fields: ID, Name, Synonyms, Hindi Name, Description, Conditions
    if (test.id.toLowerCase().includes(query)) return true;
    if (test.name.toLowerCase().includes(query)) return true;
    if (test.nameHindi.toLowerCase().includes(query)) return true;
    if (test.category.toLowerCase().includes(query)) return true;
    if (test.subcategory.toLowerCase().includes(query)) return true;
    if (test.synonyms.some((s) => s.toLowerCase().includes(query))) return true;
    if (test.conditionsEvaluated.some((c) => c.toLowerCase().includes(query))) return true;
    if (test.whatItMeasures.toLowerCase().includes(query)) return true;
    if (test.whyPerformed.toLowerCase().includes(query)) return true;

    return false;
  });

  return {
    results: filtered,
    totalCount: filtered.length
  };
}

export function getTestById(id: string): TestRecord | undefined {
  const allTests = getMasterCatalogue();
  return allTests.find((t) => t.id === id);
}

// CSV & JSON Import / Export & Duplicate Detection
export interface ImportSummary {
  totalProcessed: number;
  addedCount: number;
  updatedCount: number;
  duplicateCount: number;
  duplicates: Array<{ id: string; name: string; reason: string }>;
  errors: string[];
}

export function importTestsFromJSON(jsonString: string): ImportSummary {
  const summary: ImportSummary = {
    totalProcessed: 0,
    addedCount: 0,
    updatedCount: 0,
    duplicateCount: 0,
    duplicates: [],
    errors: []
  };

  try {
    const records = JSON.parse(jsonString);
    if (!Array.isArray(records)) {
      summary.errors.push('JSON payload must be an array of test records.');
      return summary;
    }

    const current = [...getMasterCatalogue()];
    const existingIdMap = new Map<string, number>();
    const existingNameMap = new Map<string, number>();

    current.forEach((t, idx) => {
      existingIdMap.set(t.id.toLowerCase(), idx);
      existingNameMap.set(t.name.trim().toLowerCase(), idx);
    });

    for (const item of records) {
      summary.totalProcessed++;
      if (!item.name || !item.category) {
        summary.errors.push(`Row ${summary.totalProcessed}: Missing required name or category.`);
        continue;
      }

      const id = (item.id || `IMPORT-${Date.now()}-${Math.floor(Math.random() * 1000)}`).toUpperCase();
      const normName = item.name.trim().toLowerCase();

      if (existingIdMap.has(id.toLowerCase())) {
        summary.duplicateCount++;
        summary.duplicates.push({ id, name: item.name, reason: 'Duplicate Test ID found - Record updated.' });
        const idx = existingIdMap.get(id.toLowerCase())!;
        current[idx] = { ...current[idx], ...item, id };
        summary.updatedCount++;
      } else if (existingNameMap.has(normName)) {
        summary.duplicateCount++;
        summary.duplicates.push({ id, name: item.name, reason: 'Duplicate Test Name matches existing record.' });
        const idx = existingNameMap.get(normName)!;
        current[idx] = { ...current[idx], ...item };
        summary.updatedCount++;
      } else {
        const newRecord: TestRecord = {
          id,
          name: item.name,
          synonyms: Array.isArray(item.synonyms) ? item.synonyms : [item.name],
          nameHindi: item.nameHindi || `${item.name} (जांच)`,
          description: item.description || `Diagnostic laboratory test for ${item.name}`,
          descriptionHindi: item.descriptionHindi || `${item.name} की प्रयोगशाला जांच`,
          category: item.category,
          subcategory: item.subcategory || 'General Laboratory Investigations',
          whatItMeasures: item.whatItMeasures || item.name,
          whatItMeasuresHindi: item.whatItMeasuresHindi || item.name,
          whyPerformed: item.whyPerformed || 'Clinical diagnostic evaluation',
          whyPerformedHindi: item.whyPerformedHindi || 'रोग निदान और स्वास्थ्य निगरानी हेतु',
          conditionsEvaluated: Array.isArray(item.conditionsEvaluated) ? item.conditionsEvaluated : [item.category],
          specimenType: item.specimenType || 'Serum',
          collectionMethod: item.collectionMethod || 'Standard collection protocol',
          fastingRequirement: item.fastingRequirement || 'DEPENDS_ON_DOCTOR',
          fastingOptional: !!item.fastingOptional,
          fastingDoctorDependent: true,
          fastingDurationHours: item.fastingDurationHours || 'As advised',
          waterPermitted: item.waterPermitted !== false,
          preparationInstructions: item.preparationInstructions || 'Preparation requirements may vary. Please confirm with the laboratory.',
          preparationInstructionsHindi: item.preparationInstructionsHindi || 'टेस्ट की तैयारी संबंधी निर्देश अलग-अलग हो सकते हैं। कृपया लैब से पुष्टि करें।',
          medicationPrecautions: item.medicationPrecautions || 'Consult doctor before modifying medications.',
          processingTime: item.processingTime || '24-48 Hours',
          homeCollectionAvailable: item.homeCollectionAvailable !== false,
          specialContainerRequired: !!item.specialContainerRequired,
          specialAppointmentRequired: !!item.specialAppointmentRequired,
          prescriptionRequired: !!item.prescriptionRequired,
          interpretationDisclaimer: 'To be interpreted by a registered medical practitioner.',
          verifiedReference: item.verifiedReference || 'Verified Clinical Laboratory Standard',
          lastReviewedDate: new Date().toISOString().slice(0, 10),
          offeredByLab: item.offeredByLab !== false,
          isActive: item.isActive !== false
        };
        current.push(newRecord);
        existingIdMap.set(id.toLowerCase(), current.length - 1);
        existingNameMap.set(normName, current.length - 1);
        summary.addedCount++;
      }
    }

    saveCatalogue(current);
  } catch (err: any) {
    summary.errors.push(`JSON Parse Error: ${err.message}`);
  }

  return summary;
}

export function parseCSVToTests(csvContent: string): ImportSummary {
  const summary: ImportSummary = {
    totalProcessed: 0,
    addedCount: 0,
    updatedCount: 0,
    duplicateCount: 0,
    duplicates: [],
    errors: []
  };

  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    summary.errors.push('CSV must contain a header row and at least one data row.');
    return summary;
  }

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
  const current = [...getMasterCatalogue()];
  const existingIdMap = new Map<string, number>();
  const existingNameMap = new Map<string, number>();

  current.forEach((t, idx) => {
    existingIdMap.set(t.id.toLowerCase(), idx);
    existingNameMap.set(t.name.trim().toLowerCase(), idx);
  });

  for (let i = 1; i < lines.length; i++) {
    summary.totalProcessed++;
    const row = lines[i].split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
    if (row.length < 2) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = row[idx] || '';
    });

    const testName = rowObj['name'] || rowObj['test name'] || rowObj['testname'];
    const category = rowObj['category'] || rowObj['main category'] || 'Haematology';
    const testId = (rowObj['id'] || rowObj['test id'] || `CSV-${Date.now()}-${i}`).toUpperCase();

    if (!testName) {
      summary.errors.push(`Row ${i}: Missing test name.`);
      continue;
    }

    const normName = testName.trim().toLowerCase();
    const isDupId = existingIdMap.has(testId.toLowerCase());
    const isDupName = existingNameMap.has(normName);

    if (isDupId || isDupName) {
      summary.duplicateCount++;
      const reason = isDupId ? 'Test ID already exists' : 'Test Name already exists in catalogue';
      summary.duplicates.push({ id: testId, name: testName, reason });
      const targetIdx = isDupId ? existingIdMap.get(testId.toLowerCase())! : existingNameMap.get(normName)!;
      current[targetIdx] = {
        ...current[targetIdx],
        name: testName,
        category: category || current[targetIdx].category,
        specimenType: rowObj['specimen'] || rowObj['specimentype'] || current[targetIdx].specimenType,
        fastingRequirement: (rowObj['fasting'] as any) || current[targetIdx].fastingRequirement
      };
      summary.updatedCount++;
    } else {
      const newTest: TestRecord = {
        id: testId,
        name: testName,
        synonyms: [testName],
        nameHindi: rowObj['hindi name'] || rowObj['namehindi'] || `${testName} (जांच)`,
        description: rowObj['description'] || `Clinical laboratory test for ${testName}.`,
        descriptionHindi: rowObj['hindidescription'] || `${testName} की अधिकृत जांच।`,
        category: category,
        subcategory: rowObj['subcategory'] || 'General Investigation',
        whatItMeasures: rowObj['measures'] || testName,
        whatItMeasuresHindi: rowObj['measures'] || testName,
        whyPerformed: rowObj['purpose'] || 'Medical evaluation and health monitoring.',
        whyPerformedHindi: 'डॉक्टर के परामर्श अनुसार स्वास्थ्य जांच।',
        conditionsEvaluated: [category],
        specimenType: rowObj['specimen'] || 'Serum',
        collectionMethod: 'Standard certified collection method',
        fastingRequirement: (rowObj['fasting'] as any) || 'DEPENDS_ON_DOCTOR',
        fastingOptional: false,
        fastingDoctorDependent: true,
        fastingDurationHours: 'Confirm with lab',
        waterPermitted: true,
        preparationInstructions: rowObj['preparation'] || 'Preparation requirements may vary. Please confirm with the laboratory or your healthcare professional.',
        preparationInstructionsHindi: 'टेस्ट की तैयारी संबंधी निर्देश अलग-अलग हो सकते हैं। कृपया लैब या अपने डॉक्टर से पुष्टि करें।',
        medicationPrecautions: 'Inform laboratory staff of any medications.',
        processingTime: '24-48 Hours',
        homeCollectionAvailable: rowObj['homecollection'] !== 'false',
        specialContainerRequired: false,
        specialAppointmentRequired: false,
        prescriptionRequired: false,
        interpretationDisclaimer: 'Laboratory results require medical interpretation.',
        verifiedReference: rowObj['reference'] || 'Authoritative Medical Reference',
        lastReviewedDate: new Date().toISOString().slice(0, 10),
        offeredByLab: true,
        isActive: true
      };
      current.push(newTest);
      existingIdMap.set(testId.toLowerCase(), current.length - 1);
      existingNameMap.set(normName, current.length - 1);
      summary.addedCount++;
    }
  }

  saveCatalogue(current);
  return summary;
}

export function exportCatalogueAsJSON(): string {
  const tests = getMasterCatalogue();
  return JSON.stringify(tests, null, 2);
}

export function exportCatalogueAsCSV(): string {
  const tests = getMasterCatalogue();
  const headers = [
    'id', 'name', 'nameHindi', 'category', 'subcategory', 'specimenType',
    'fastingRequirement', 'fastingDurationHours', 'homeCollectionAvailable',
    'processingTime', 'verifiedReference'
  ];

  const rows = tests.map((t) => [
    `"${t.id}"`,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.nameHindi.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.subcategory}"`,
    `"${t.specimenType}"`,
    `"${t.fastingRequirement}"`,
    `"${t.fastingDurationHours || ''}"`,
    `"${t.homeCollectionAvailable}"`,
    `"${t.processingTime || ''}"`,
    `"${t.verifiedReference.replace(/"/g, '""')}"`
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
