import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  FileSpreadsheet, 
  FileCode, 
  Filter, 
  Sparkles 
} from 'lucide-react';
import { 
  getMasterCatalogue, 
  saveCatalogue, 
  importTestsFromJSON, 
  parseCSVToTests, 
  exportCatalogueAsCSV, 
  exportCatalogueAsJSON,
  ImportSummary
} from '../../data/catalogueDatabase';
import { TestRecord } from '../../types/test';
import { LAB_SERVICES } from '../../data/categories';
import { useAuth } from '../../context/AuthContext';

export const CatalogueManagerTab: React.FC = () => {
  const { logSecurityEvent } = useAuth();
  const [catalogue, setCatalogue] = useState<TestRecord[]>(() => getMasterCatalogue());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<ImportSummary | null>(null);

  // New Test Form
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newNameHn, setNewNameHn] = useState('');
  const [newCategory, setNewCategory] = useState('Haematology');
  const [newSubcategory, setNewSubcategory] = useState('General Investigation');
  const [newSpecimen, setNewSpecimen] = useState('Whole Blood (EDTA)');
  const [newFasting, setNewFasting] = useState<any>('NOT_REQUIRED');
  const [newRef, setNewRef] = useState('ICMR / NABL Clinical Diagnostic Standards');
  const [newHome, setNewHome] = useState(true);

  // Import state
  const [importMode, setImportMode] = useState<'CSV' | 'JSON'>('CSV');
  const [importText, setImportText] = useState('');

  const filteredTests = useMemo(() => {
    return catalogue.filter((t) => {
      if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.nameHindi.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [catalogue, searchQuery, selectedCategory]);

  const handleToggleActive = (id: string) => {
    const updated = catalogue.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
    saveCatalogue(updated);
    setCatalogue(updated);
    logSecurityEvent('CATALOGUE_TEST_TOGGLE', 'TEST_CATALOGUE', `Toggled active status for test ID ${id}`, id);
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const testId = newId.trim().toUpperCase() || `PDC-LAB-${Date.now()}`;
    const newRecord: TestRecord = {
      id: testId,
      name: newName.trim(),
      synonyms: [newName.trim()],
      nameHindi: newNameHn.trim() || `${newName} (जांच)`,
      description: `Diagnostic investigation for ${newName}. Supervised by laboratory pathologists.`,
      descriptionHindi: `${newName} की अधिकृत प्रयोगशाला जांच।`,
      category: newCategory,
      subcategory: newSubcategory,
      whatItMeasures: newName,
      whatItMeasuresHindi: newName,
      whyPerformed: 'Diagnostic evaluation and patient management',
      whyPerformedHindi: 'रोग निदान और स्वास्थ्य निगरानी हेतु',
      conditionsEvaluated: [newCategory],
      specimenType: newSpecimen,
      collectionMethod: 'Aseptic collection in verified laboratory container',
      fastingRequirement: newFasting,
      fastingOptional: false,
      fastingDoctorDependent: true,
      fastingDurationHours: newFasting === 'REQUIRED' ? '8-10 Hours' : 'None',
      waterPermitted: true,
      preparationInstructions: 'Maintain normal hydration. Follow doctor guidance.',
      preparationInstructionsHindi: 'सादा पानी पी सकते हैं। डॉक्टर की सलाह का पालन करें।',
      medicationPrecautions: 'Report current medications to laboratory staff.',
      processingTime: '24-48 Hours',
      homeCollectionAvailable: newHome,
      specialContainerRequired: false,
      specialAppointmentRequired: false,
      prescriptionRequired: false,
      interpretationDisclaimer: 'To be interpreted by a registered medical practitioner.',
      verifiedReference: newRef,
      lastReviewedDate: new Date().toISOString().slice(0, 10),
      offeredByLab: true,
      isActive: true
    };

    const updated = [newRecord, ...catalogue];
    saveCatalogue(updated);
    setCatalogue(updated);
    setShowAddModal(false);
    setNewName('');
    setNewId('');
    setNewNameHn('');

    logSecurityEvent('CATALOGUE_TEST_ADDED', 'TEST_CATALOGUE', `Added new test ${testId}: ${newName}`, testId);
  };

  const handleRunImport = () => {
    if (!importText.trim()) return;

    let res: ImportSummary;
    if (importMode === 'JSON') {
      res = importTestsFromJSON(importText);
    } else {
      res = parseCSVToTests(importText);
    }

    setImportResult(res);
    setCatalogue(getMasterCatalogue());
    logSecurityEvent(
      'CATALOGUE_IMPORTED',
      'TEST_CATALOGUE',
      `Import executed (${importMode}): ${res.addedCount} added, ${res.updatedCount} updated, ${res.duplicateCount} duplicates identified.`
    );
  };

  const handleExportCSV = () => {
    const csv = exportCatalogueAsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Prime_Diagnostic_Catalogue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logSecurityEvent('CATALOGUE_EXPORT_CSV', 'EXPORT', 'Authorised staff exported catalogue as CSV.');
  };

  const handleExportJSON = () => {
    const json = exportCatalogueAsJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Prime_Diagnostic_Catalogue_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logSecurityEvent('CATALOGUE_EXPORT_JSON', 'EXPORT', 'Authorised staff exported catalogue as JSON.');
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Master Diagnostic Test Catalogue
          </h2>
          <p className="text-xs text-slate-500">
            {catalogue.length.toLocaleString()} verified tests loaded in system. Architected to support 3,000+ entries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Test</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import CSV / JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test ID (e.g. CBC-001), scientific name, Hindi name, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-600 text-slate-900"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-600 text-slate-700"
          >
            <option value="ALL">All Categories ({catalogue.length})</option>
            {LAB_SERVICES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-semibold uppercase tracking-wider sticky top-0 z-10 text-[11px]">
              <tr>
                <th className="py-3 px-4">Test ID</th>
                <th className="py-3 px-4">Standard Test Name & Hindi</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Specimen</th>
                <th className="py-3 px-4">Fasting Requirement</th>
                <th className="py-3 px-4">Home Visit</th>
                <th className="py-3 px-4 text-right">Catalogue Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTests.slice(0, 100).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {t.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-teal-800">{t.nameHindi}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {t.category}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {t.specimenType}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {t.fastingRequirement}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.homeCollectionAvailable ? (
                      <span className="text-emerald-700 font-semibold">Available</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Lab Visit</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleActive(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                        t.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {t.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{t.isActive ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing top {Math.min(100, filteredTests.length)} of {filteredTests.length} filtered tests</span>
          <span className="text-teal-800 font-semibold">Master DB Count: {catalogue.length} verified records</span>
        </div>
      </div>

      {/* Add New Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Diagnostic Test to Catalogue</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Test Code / ID</label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="e.g. LAB-HEMO-042"
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Standard Test Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Serum Ceruloplasmin"
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Hindi Name or Explanation</label>
                <input
                  type="text"
                  value={newNameHn}
                  onChange={(e) => setNewNameHn(e.target.value)}
                  placeholder="e.g. सीरम सेरुलोप्लास्मिन (कॉपर जांच)"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {LAB_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Specimen Type</label>
                  <input
                    type="text"
                    value={newSpecimen}
                    onChange={(e) => setNewSpecimen(e.target.value)}
                    placeholder="e.g. Serum, EDTA Blood"
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Fasting Requirement</label>
                  <select
                    value={newFasting}
                    onChange={(e) => setNewFasting(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="NOT_REQUIRED">NOT_REQUIRED</option>
                    <option value="REQUIRED">REQUIRED</option>
                    <option value="DEPENDS_ON_DOCTOR">DEPENDS_ON_DOCTOR</option>
                    <option value="SPECIAL_INSTRUCTIONS">SPECIAL_INSTRUCTIONS</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="newHomeCb"
                    checked={newHome}
                    onChange={(e) => setNewHome(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <label htmlFor="newHomeCb" className="font-semibold text-slate-800">
                    Home Collection Available
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Verified Medical Reference</label>
                <input
                  type="text"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  placeholder="e.g. Tietz Clinical Guide / ICMR Reference Protocol"
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white font-semibold"
                >
                  Add Test to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV / JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Import Diagnostic Tests with Duplicate Detection</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setImportMode('CSV')}
                className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 ${
                  importMode === 'CSV' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV Format</span>
              </button>

              <button
                type="button"
                onClick={() => setImportMode('JSON')}
                className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 ${
                  importMode === 'JSON' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON Format</span>
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Paste {importMode} Data (Header required for CSV: id,name,category,specimen,fasting,reference)
              </label>
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={
                  importMode === 'CSV'
                    ? 'id,name,category,specimen,fasting,reference\nLAB-BIO-501,Serum Magnesium,Clinical Biochemistry,Serum,NOT_REQUIRED,Tietz\nLAB-BIO-502,Serum Zinc,Clinical Biochemistry,Serum,REQUIRED,ICMR'
                    : '[\n  {\n    "id": "LAB-TEST-901",\n    "name": "Serum Copper",\n    "category": "Clinical Biochemistry"\n  }\n]'
                }
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-teal-600"
              />
            </div>

            {importResult && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-800">
                  Import Summary: {importResult.addedCount} new tests added, {importResult.updatedCount} existing records updated.
                </p>
                {importResult.duplicateCount > 0 && (
                  <p className="text-amber-800 font-medium">
                    {importResult.duplicateCount} duplicate identifiers detected and merged.
                  </p>
                )}
                {importResult.errors.length > 0 && (
                  <p className="text-rose-700">
                    Errors: {importResult.errors.join('; ')}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportResult(null);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleRunImport}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white font-semibold"
              >
                Execute Import & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
