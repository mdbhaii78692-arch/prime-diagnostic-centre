import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Droplet, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Info,
  CalendarPlus
} from 'lucide-react';
import { getMasterCatalogue } from '../../data/catalogueDatabase';
import { TestRecord, FastingRequirement } from '../../types/test';
import { useLanguage } from '../../context/LanguageContext';
import { MedicalDisclaimer } from '../Common/MedicalDisclaimer';

interface PreparationGuideProps {
  onViewDetails: (test: TestRecord) => void;
  onBookTest: (test: TestRecord) => void;
}

export const PreparationGuide: React.FC<PreparationGuideProps> = ({ onViewDetails, onBookTest }) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FastingRequirement | 'ALL'>('ALL');

  const allTests = useMemo(() => getMasterCatalogue(), []);

  const filteredTests = useMemo(() => {
    return allTests.filter((t) => {
      if (activeTab !== 'ALL' && t.fastingRequirement !== activeTab) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.nameHindi.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }).slice(0, 50); // fast slice
  }, [allTests, searchQuery, activeTab]);

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-teal-700" />
            <span>{language === 'hi' ? 'चिकित्सीय तैयारी गाइड' : 'Authoritative Preparation Reference'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('prepGuideTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t('prepGuideSubtitle')}
          </p>
        </div>

        {/* 4 Golden Rules of Diagnostic Preparation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs mb-3">
              01
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'सभी टेस्ट में उपवास जरूरी नहीं' : 'Not All Tests Need Fasting'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'CBC, HbA1c और विटामिन डी जैसे रूटीन टेस्ट बिना खाली पेट दिन में कभी भी किए जा सकते हैं।'
                : 'CBC, HbA1c, Vitamin D, and routine antibodies do not require overnight fasting.'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs mb-3">
              02
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'सादा पानी पीना सुरक्षित है' : 'Plain Water is Permitted'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'खाली पेट रहने के दौरान सादा पानी पिएं ताकि नसों से खून का सैंपल आसानी से लिया जा सके।'
                : 'Plain water maintains proper hydration without skewing metabolic measurements.'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs mb-3">
              03
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'दवाइयां खुद बंद न करें' : 'Never Stop Medicines Alone'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'बीपी, दिल या डायबिटीज की दवाएं बिना डॉक्टर की सलाह के कभी न रोकें। तकनीशियन को सूचित करें।'
                : 'Never pause insulin, BP, or cardiac pills independently without medical oversight.'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs mb-3">
              04
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'विशेष जांच निर्देश' : 'Special Sample Protocols'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'वीर्य जांच (Semen) के लिए 2-7 दिन का परहेज और यूरिन कल्चर के लिए बाँझ डिब्बा आवश्यक है।'
                : 'Semen analysis requires 2-7 days abstinence; urine cultures require sterile containers.'}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'किसी भी टेस्ट की तैयारी जांचें (जैसे ग्लूकोज, थायरॉइड, लिपिड, यूरिन)...'
                  : 'Check preparation for any test (e.g. Glucose Fasting, Lipid, Thyroid, Semen)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'hi' ? 'सभी स्थितियां' : 'All Preparation Rules'}
            </button>

            <button
              onClick={() => setActiveTab('REQUIRED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'REQUIRED'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {t('fastingRequiredLabel')}
            </button>

            <button
              onClick={() => setActiveTab('NOT_REQUIRED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'NOT_REQUIRED'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              {t('fastingNotRequiredLabel')}
            </button>

            <button
              onClick={() => setActiveTab('SPECIAL_INSTRUCTIONS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'SPECIAL_INSTRUCTIONS'
                  ? 'bg-indigo-700 text-white shadow-2xs'
                  : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
              }`}
            >
              {t('fastingSpecialLabel')}
            </button>
          </div>
        </div>

        {/* Test Cards List */}
        <div className="space-y-4 mb-12">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {test.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {test.category}
                    </span>
                    {test.fastingRequirement === 'REQUIRED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {language === 'hi'
                          ? `खाली पेट जरूरी (${test.fastingDurationHours || '8-10 घंटे'})`
                          : `Fasting Required (${test.fastingDurationHours || '8-10h'})`}
                      </span>
                    )}
                    {test.fastingRequirement === 'NOT_REQUIRED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {language === 'hi' ? 'खाली पेट रहना जरूरी नहीं' : 'No Fasting Required'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {test.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-800">
                    {test.nameHindi}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5 mt-2">
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-800" />
                      <span>{language === 'hi' ? 'तैयारी के निर्देश: ' : 'Verified Preparation Instructions:'}</span>
                    </p>
                    <p className="leading-relaxed">
                      {language === 'hi' ? test.preparationInstructionsHindi : test.preparationInstructions}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      <strong className="text-slate-700">{language === 'hi' ? 'सैंपल: ' : 'Specimen: '}</strong>
                      {test.specimenType}
                    </span>
                    <span>
                      <strong className="text-slate-700">{language === 'hi' ? 'सादा पानी: ' : 'Water: '}</strong>
                      {test.waterPermitted ? (language === 'hi' ? 'पी सकते हैं' : 'Permitted') : (language === 'hi' ? 'पुष्टि करें' : 'Confirm')}
                    </span>
                    <span>
                      <strong className="text-slate-700">{language === 'hi' ? 'रेफरेंस: ' : 'Reference: '}</strong>
                      {test.verifiedReference}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => onViewDetails(test)}
                    className="py-2 px-3.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'hi' ? 'पूरा विवरण' : 'Full Details'}</span>
                  </button>

                  {test.homeCollectionAvailable && (
                    <button
                      onClick={() => onBookTest(test)}
                      className="py-2 px-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-teal-100" />
                      <span>{language === 'hi' ? 'होम विजिट' : 'Book Visit'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Medical disclaimer at bottom */}
        <MedicalDisclaimer />
      </div>
    </div>
  );
};
