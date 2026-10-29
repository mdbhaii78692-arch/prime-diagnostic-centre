import React from 'react';
import { 
  ArrowRight, 
  CalendarPlus, 
  Info, 
  Clock, 
  Droplet, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CORE_VERIFIED_TESTS } from '../../data/masterCatalogueGenerator';
import { TestRecord } from '../../types/test';
import { useLanguage } from '../../context/LanguageContext';

interface PopularTestsProps {
  onViewDetails: (test: TestRecord) => void;
  onBookTest: (test: TestRecord) => void;
  onViewAllTests: () => void;
}

export const PopularTests: React.FC<PopularTestsProps> = ({
  onViewDetails,
  onBookTest,
  onViewAllTests
}) => {
  const { language, t } = useLanguage();

  // Take the 8 most essential routine tests
  const popularList = CORE_VERIFIED_TESTS.slice(0, 8);

  const getFastingBadge = (test: TestRecord) => {
    switch (test.fastingRequirement) {
      case 'REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            <Clock className="w-3 h-3 text-amber-700" />
            {language === 'hi' ? 'खाली पेट (8-10 घंटे)' : 'Fasting Required (8-10h)'}
          </span>
        );
      case 'NOT_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {language === 'hi' ? 'खाली पेट जरूरी नहीं' : 'No Fasting Required'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            {language === 'hi' ? 'डॉक्टर के निर्देशानुसार' : 'As Advised by Doctor'}
          </span>
        );
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
              <span>{language === 'hi' ? 'अक्सर डॉक्टर द्वारा निर्देशित' : 'Routine Clinical Testing'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('popularTestsTitle')}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              {t('popularTestsSubtitle')}
            </p>
          </div>

          <button
            onClick={onViewAllTests}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-900 hover:underline transition-colors shrink-0"
          >
            <span>{language === 'hi' ? 'सभी 2,500+ टेस्ट देखें' : 'Browse All 2,500+ Tests'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column or 4-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularList.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              <div>
                {/* Fasting tag & specimen */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getFastingBadge(test)}
                  <span className="text-[11px] text-slate-500 font-medium truncate">
                    {test.category}
                  </span>
                </div>

                {/* Test Name & Hindi Name */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
                  {test.name}
                </h3>
                <p className="text-xs font-medium text-teal-800 mb-2.5">
                  {test.nameHindi}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {language === 'hi' ? test.descriptionHindi : test.description}
                </p>

                {/* Specimen */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4 pb-3 border-b border-slate-200/70">
                  <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{test.specimenType}</span>
                </div>
              </div>

              {/* Action buttons (Strictly NO PRICES) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onViewDetails(test)}
                  className="flex-1 py-2 px-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
                </button>

                {test.homeCollectionAvailable ? (
                  <button
                    onClick={() => onBookTest(test)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-teal-100" />
                    <span>{language === 'hi' ? 'बुक करें' : 'Book'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic py-2 text-center flex-1">
                    {language === 'hi' ? 'लैब विजिट' : 'Lab Visit'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
