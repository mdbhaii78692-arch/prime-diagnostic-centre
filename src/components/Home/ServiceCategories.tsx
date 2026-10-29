import React from 'react';
import { 
  Droplets, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Microscope, 
  FileSearch, 
  Dna, 
  Bug, 
  Apple, 
  HeartPulse, 
  ClipboardList, 
  Gauge, 
  ShieldAlert, 
  Stethoscope, 
  Pill, 
  Sparkles, 
  ScanLine, 
  UserCheck, 
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { LAB_SERVICES } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Droplets,
  Activity,
  Flame,
  ShieldCheck,
  Microscope,
  FileSearch,
  Dna,
  Bug,
  Apple,
  HeartPulse,
  ClipboardList,
  Gauge,
  ShieldAlert,
  Stethoscope,
  Pill,
  Sparkles,
  ScanLine,
  UserCheck
};

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onSelectCategory }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <span>{language === 'hi' ? 'विशेषज्ञ जांच प्रभाग' : 'Diagnostic Divisions'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('sectionServicesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t('sectionServicesSubtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LAB_SERVICES.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || Activity;
            const isHome = cat.isHomeCollectionSupported;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group relative p-6 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-600 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-700 text-teal-800 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {isHome ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'hi' ? 'होम कलेक्शन' : 'Home Collection'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                        <Building2 className="w-3 h-3 text-amber-600" />
                        <span>{language === 'hi' ? 'लैब विजिट जरूरी' : 'Lab Visit Only'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors mb-1.5">
                    {language === 'hi' ? cat.nameHindi : cat.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {language === 'hi' ? cat.shortDescHindi : cat.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate text-[11px]">
                    {cat.sampleTypes.join(', ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-teal-800 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                    {language === 'hi' ? 'टेस्ट देखें' : 'View Tests'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
