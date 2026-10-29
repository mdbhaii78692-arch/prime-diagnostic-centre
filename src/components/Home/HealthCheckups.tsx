import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Droplets, 
  CalendarPlus, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { HEALTH_CHECKUP_PACKAGES } from '../../data/checkupPackages';
import { HealthCheckupPackage } from '../../types/test';
import { useLanguage } from '../../context/LanguageContext';

interface HealthCheckupsProps {
  onBookPackage: (pkg: HealthCheckupPackage) => void;
}

export const HealthCheckups: React.FC<HealthCheckupsProps> = ({ onBookPackage }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <span>{language === 'hi' ? 'समग्र स्वास्थ्य सुरक्षा' : 'Preventative Wellness'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('packagesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t('packagesSubtitle')}
          </p>
          <p className="text-xs text-slate-500 mt-1 italic">
            {t('noPriceNotice')}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTH_CHECKUP_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-600 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header with parameter count */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    {pkg.includedParametersCount} {language === 'hi' ? 'पैरामीटर्स' : 'Parameters'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{pkg.fastingRequired ? pkg.fastingDuration : 'No Fasting'}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                  {language === 'hi' ? pkg.nameHindi : pkg.name}
                </h3>
                <p className="text-xs text-teal-800 font-medium mb-3">
                  {language === 'hi' ? pkg.taglineHindi : pkg.tagline}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi' ? pkg.descriptionHindi : pkg.description}
                </p>

                {/* Included Tests list */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 mb-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-800" />
                    <span>{t('packageIncludes')}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {pkg.tests.map((testItem, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{testItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specimen Info */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-5">
                  <Droplets className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{pkg.includedSampleTypes.join(' · ')}</span>
                </div>
              </div>

              {/* Action Button (Strictly NO PRICES) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onBookPackage(pkg)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-xs"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-100" />
                  <span>{t('packageBookBtn')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
