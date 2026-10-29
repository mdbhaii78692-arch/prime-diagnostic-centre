import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Droplet, 
  CheckCircle2, 
  CalendarPlus, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { getMasterCatalogue, searchCatalogue } from '../../data/catalogueDatabase';
import { LAB_SERVICES } from '../../data/categories';
import { TestRecord, FastingRequirement } from '../../types/test';
import { useLanguage } from '../../context/LanguageContext';

interface TestCatalogueProps {
  initialCategory?: string;
  initialQuery?: string;
  onViewDetails: (test: TestRecord) => void;
  onBookTest: (test: TestRecord) => void;
}

export const TestCatalogue: React.FC<TestCatalogueProps> = ({
  initialCategory,
  initialQuery = '',
  onViewDetails,
  onBookTest
}) => {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedFasting, setSelectedFasting] = useState<FastingRequirement | 'ALL'>('ALL');
  const [homeOnly, setHomeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 24;

  // Filter tests
  const { results, totalCount } = useMemo(() => {
    return searchCatalogue({
      query: searchQuery,
      category: selectedCategory === 'ALL' ? undefined : selectedCategory,
      fastingRequirement: selectedFasting === 'ALL' ? undefined : selectedFasting,
      homeCollectionOnly: homeOnly,
      activeOnly: true
    });
  }, [searchQuery, selectedCategory, selectedFasting, homeOnly]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedFasting('ALL');
    setHomeOnly(false);
    setCurrentPage(1);
  };

  const getFastingBadge = (test: TestRecord) => {
    switch (test.fastingRequirement) {
      case 'REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>{language === 'hi' ? 'खाली पेट जरूरी' : 'Fasting Required'}</span>
          </span>
        );
      case 'NOT_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{language === 'hi' ? 'खाली पेट जरूरी नहीं' : 'No Fasting'}</span>
          </span>
        );
      case 'SPECIAL_INSTRUCTIONS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>{language === 'hi' ? 'विशेष निर्देश' : 'Special Instructions'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <span>{language === 'hi' ? 'सलाह अनुसार' : 'Doctor Advised'}</span>
          </span>
        );
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'संपूर्ण जांच कैटलॉग' : 'Comprehensive Diagnostic Catalogue'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'सभी डायग्नोस्टिक टेस्ट खोजें' : 'All Diagnostic Tests & Investigations'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {t('showingResults').replace('{count}', totalCount.toLocaleString())}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs text-xs text-slate-600">
              <strong className="text-slate-800 font-semibold">{language === 'hi' ? 'होम कलेक्शन क्षेत्र: ' : 'Home Collection Radius: '}</strong>
              <span>Nehru Nagar, Kurla East & Greater Mumbai</span>
            </div>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input (6 cols) */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown (3 cols) */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t('filterAllCategories')}</option>
                {LAB_SERVICES.map((s) => (
                  <option key={s.id} value={s.name}>
                    {language === 'hi' ? s.nameHindi : s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fasting Requirement Dropdown (3 cols) */}
            <div className="md:col-span-3">
              <select
                value={selectedFasting}
                onChange={(e) => {
                  setSelectedFasting(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-teal-600 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t('filterAllFasting')}</option>
                <option value="REQUIRED">{t('fastingRequiredLabel')}</option>
                <option value="NOT_REQUIRED">{t('fastingNotRequiredLabel')}</option>
                <option value="DEPENDS_ON_DOCTOR">{t('fastingDependsLabel')}</option>
                <option value="SPECIAL_INSTRUCTIONS">{t('fastingSpecialLabel')}</option>
              </select>
            </div>
          </div>

          {/* Sub-toggles: Home Collection Only & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={homeOnly}
                onChange={(e) => {
                  setHomeOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span>{t('filterHomeAvailable')}</span>
            </label>

            {(searchQuery || selectedCategory !== 'ALL' || selectedFasting !== 'ALL' || homeOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-teal-700 hover:text-teal-900 font-semibold underline"
              >
                {language === 'hi' ? 'सभी फिल्टर हटाएं' : 'Reset all filters'}
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {paginatedResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {paginatedResults.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-600 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    {getFastingBadge(test)}
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {test.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
                    {test.name}
                  </h3>
                  <p className="text-xs font-medium text-teal-800 mb-2">
                    {test.nameHindi}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {language === 'hi' ? test.descriptionHindi : test.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-500 pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{test.specimenType}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{test.category}</span>
                      {test.homeCollectionAvailable ? (
                        <span className="text-emerald-700 font-medium">Home Visit ✓</span>
                      ) : (
                        <span className="text-amber-800 font-medium">Centre Only</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions (Strictly NO PRICES) */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onViewDetails(test)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'hi' ? 'पूरी जानकारी' : 'View Details'}</span>
                  </button>

                  {test.homeCollectionAvailable ? (
                    <button
                      onClick={() => onBookTest(test)}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-teal-100" />
                      <span>{language === 'hi' ? 'बुक करें' : 'Book Visit'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewDetails(test)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लैब विजिट' : 'Lab Visit'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs mb-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {language === 'hi' ? 'कोई टेस्ट नहीं मिला' : 'No diagnostic tests found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
              {t('noTestsFound')}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
            >
              {language === 'hi' ? 'सर्च रीसेट करें' : 'Reset Search Filters'}
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
            </button>

            <span className="text-slate-600 font-medium">
              {language === 'hi'
                ? `पृष्ठ ${currentPage} का ${totalPages} (कुल ${totalCount} टेस्ट)`
                : `Page ${currentPage} of ${totalPages} (${totalCount} tests)`}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 font-medium"
            >
              <span>{language === 'hi' ? 'अगला' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
