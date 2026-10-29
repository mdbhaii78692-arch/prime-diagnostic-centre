import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimer: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { language, t } = useLanguage();

  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>{t('medicalDisclaimerText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 shrink-0">
          <AlertCircle className="w-5 h-5 text-teal-800" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
            {language === 'hi' ? 'चिकित्सीय एवं नैदानिक सूचना अस्वीकरण (Medical Disclaimer)' : 'Medical & Clinical Information Disclaimer'}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('medicalDisclaimerText')}
          </p>
        </div>
      </div>
    </div>
  );
};
