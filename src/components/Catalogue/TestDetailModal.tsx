import React from 'react';
import { 
  X, 
  CalendarPlus, 
  Clock, 
  Droplet, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  HelpCircle,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { TestRecord } from '../../types/test';
import { useLanguage } from '../../context/LanguageContext';

interface TestDetailModalProps {
  test: TestRecord | null;
  onClose: () => void;
  onBookTest: (test: TestRecord) => void;
}

export const TestDetailModal: React.FC<TestDetailModalProps> = ({ test, onClose, onBookTest }) => {
  const { language, t } = useLanguage();

  if (!test) return null;

  const getFastingBadge = () => {
    switch (test.fastingRequirement) {
      case 'REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            {language === 'hi'
              ? `खाली पेट जरूरी है (${test.fastingDurationHours || '8-10 घंटे'})`
              : `Fasting Required (${test.fastingDurationHours || '8-10 Hours'})`}
          </span>
        );
      case 'NOT_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'hi' ? 'खाली पेट रहना जरूरी नहीं' : 'Fasting Usually Not Required'}
          </span>
        );
      case 'SPECIAL_INSTRUCTIONS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            {language === 'hi' ? 'विशेष निर्देश अनिवार्य' : 'Special Collection Instructions'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
            {language === 'hi' ? 'डॉक्टर के निर्देशानुसार' : 'Depends on Doctor Instructions'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                {test.id}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {test.category} · {test.subcategory}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {test.name}
            </h2>
            <p className="text-sm font-medium text-teal-300 mt-1">
              {test.nameHindi}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-slate-200">
            {getFastingBadge()}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <Droplet className="w-3.5 h-3.5 text-rose-600" />
              <span>{test.specimenType}</span>
            </span>

            {test.homeCollectionAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? 'घर पर सैंपल संभव' : 'Home Sample Collection Available'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'hi' ? 'केवल लैब सेंटर पर उपलब्ध' : 'Centre Facility Visit Only'}</span>
              </span>
            )}

            {test.processingTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-xs">
                <span>TAT: {test.processingTime}</span>
              </span>
            )}
          </div>

          {/* Clinical Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'जांच का उद्देश्य एवं विवरण' : 'Clinical Overview & Purpose'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              {language === 'hi' ? test.descriptionHindi : test.description}
            </p>
            {test.synonyms.length > 1 && (
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{language === 'hi' ? 'अन्य नाम:' : 'Alternative Names / Synonyms:'} </span>
                {test.synonyms.join(', ')}
              </p>
            )}
          </div>

          {/* What it measures & Why performed (Bilingual Questions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-800" />
                <span>{language === 'hi' ? 'यह टेस्ट क्या मापता है?' : 'What Does This Test Measure?'}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? test.whatItMeasuresHindi : test.whatItMeasures}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-800" />
                <span>{language === 'hi' ? 'यह टेस्ट क्यों किया जाता है?' : 'Why Is This Test Performed?'}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? test.whyPerformedHindi : test.whyPerformed}
              </p>
            </div>
          </div>

          {/* Test Preparation Instructions (CRITICAL MEDICAL SECTION) */}
          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
            <h4 className="text-sm font-bold text-teal-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-800" />
              <span>{language === 'hi' ? 'टेस्ट कराने से पहले क्या सावधानी रखनी चाहिए?' : 'Test Preparation & Fasting Guidelines'}</span>
            </h4>
            
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {language === 'hi' ? test.preparationInstructionsHindi : test.preparationInstructions}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-teal-100 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">
                  {language === 'hi' ? 'क्या पानी पी सकते हैं? ' : 'Plain Water Permitted: '}
                </span>
                <span>
                  {test.waterPermitted
                    ? (language === 'hi' ? 'हाँ, पर्याप्त पानी पिएं।' : 'Yes, plain drinking water is permitted.')
                    : (language === 'hi' ? 'लैब से पुष्टि करें।' : 'Check with laboratory staff.')}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-800">
                  {language === 'hi' ? 'दवाओं संबंधी सावधानी: ' : 'Medication Precautions: '}
                </span>
                <span>{test.medicationPrecautions}</span>
              </div>
            </div>
          </div>

          {/* Conditions evaluated */}
          {test.conditionsEvaluated.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'संबंधित चिकित्सीय स्थितियां' : 'Conditions Often Evaluated'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {test.conditionsEvaluated.map((cond, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Reference & Statutory Disclaimer */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong className="text-slate-700">Verified Reference: </strong>
                {test.verifiedReference}
              </span>
              <span>
                <strong className="text-slate-700">Last Reviewed: </strong>
                {test.lastReviewedDate}
              </span>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                {test.interpretationDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Strictly NO PRICES) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-white transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>

            <a
              href={`https://wa.me/917208627822?text=${encodeURIComponent(
                `Hello Prime Diagnostic Centre, I would like to inquire about test "${test.name}" (${test.id}). Could you please guide me on preparation/booking?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>{language === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Inquire on WhatsApp'}</span>
            </a>
          </div>

          {test.homeCollectionAvailable ? (
            <button
              onClick={() => {
                onClose();
                onBookTest(test);
              }}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4 text-teal-100" />
              <span>{language === 'hi' ? 'इस टेस्ट के लिए होम विजिट बुक करें' : 'Book Home Visit for this Test'}</span>
            </button>
          ) : (
            <a
              href="tel:7208627822"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Building2 className="w-4 h-4 text-teal-300" />
              <span>{language === 'hi' ? 'लैब विजिट हेतु कॉल करें: 7208627822' : 'Call for Center Visit: 7208627822'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
