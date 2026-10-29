import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert } from 'lucide-react';

export const EmergencyNotice: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="font-normal">{t('emergencyNotice')}</p>
      </div>
    </div>
  );
};
