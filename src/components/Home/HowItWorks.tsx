import React from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  ThermometerSnowflake, 
  Microscope, 
  ArrowRight, 
  CalendarPlus 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorks: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { language, t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: ClipboardCheck
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: MapPin
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: ThermometerSnowflake
    },
    {
      num: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: Microscope
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-14 text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <span>{language === 'hi' ? 'घर बैठे सुविधा' : 'Simple 4-Step Process'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                      Step {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5 text-teal-700" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner below */}
        <div className="mt-12 text-center">
          <button
            onClick={onBookClick}
            className="px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4 text-teal-100" />
            <span>{t('heroBtnBook')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
