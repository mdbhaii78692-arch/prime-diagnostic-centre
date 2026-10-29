import React from 'react';
import { 
  Activity, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Clock, 
  Lock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveView: (view: string) => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onAdminClick }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Strict Report Policy & Medical Notice Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                {language === 'hi' ? 'रिपोर्ट सहायता संबंधी सूचना' : 'Diagnostic Report Assistance Policy'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {t('reportAssistanceText')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:7208627822"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>7208627822</span>
            </a>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">PRIME </span>
                <span className="text-sm font-medium text-teal-400">DIAGNOSTIC CENTRE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('tagline')} · {language === 'hi' ? 'नेहरू नगर, कुर्ला पूर्व, मुंबई में स्थित उच्च गुणवत्ता वाली डायग्नोस्टिक प्रयोगशाला।' : 'Reputable clinical laboratory serving Nehru Nagar, Kurla East, and Mumbai with accredited diagnostic testing and home sample collection.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DPDP Act 2023 Patient Privacy Protected</span>
            </div>
          </div>

          {/* Column 2: Laboratory Location & Direct Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {language === 'hi' ? 'प्रयोगशाला संपर्क एवं पता' : 'Laboratory Address & Contact'}
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Shop No. 4, Building No. 40, Nehru Nagar, Kurla East, Mumbai, Maharashtra, India.
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:7208627822" className="text-white hover:text-teal-300 font-semibold transition-colors">
                    Primary: 7208627822
                  </a>
                  <a href="tel:7208088515" className="hover:text-white transition-colors">
                    Secondary: 7208088515
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20a%20diagnostic%20test%20or%20home%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-medium hover:bg-emerald-900 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp 7208627822</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {language === 'hi' ? 'महत्वपूर्ण लिंक्स' : 'Quick Navigation'}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('tests')} className="hover:text-white transition-colors">
                  {t('navTests')} (2,500+ Verified Records)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('prep')} className="hover:text-white transition-colors">
                  {t('navPrepGuide')} (Fasting Guidelines)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('packages')} className="hover:text-white transition-colors">
                  {t('navPackages')}
                </button>
              </li>
              <li>
                <button 
                  onClick={onAdminClick} 
                  className="hover:text-white transition-colors text-slate-300 font-medium flex items-center gap-1.5"
                  title="Admin Only - Password Required"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{language === 'hi' ? 'बुकिंग्स देखें (केवल एडमिन - पासवर्ड आवश्यक)' : 'View Bookings (Admin Only - Password Required)'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-white transition-colors">
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Admin Gateway */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {language === 'hi' ? 'गोपनीयता एवं स्टाफ' : 'Privacy & Staff'}
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'मरीजों का डेटा, पर्ची और संपर्क विवरण पूर्णतः एन्क्रिप्टेड और सुरक्षित हैं। सार्वजनिक रूप से कोई मूल्य प्रदर्शित नहीं किया जाता।'
                : 'Patient health information, addresses, and mobile numbers are stored under strict role-based access. No test prices are published.'}
            </p>
            <div className="pt-2">
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs hover:text-white hover:border-slate-700 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('navAdmin')} Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Statutory Disclaimer */}
        <div className="pt-8 space-y-4 text-xs text-slate-500">
          <p className="leading-relaxed border-b border-slate-900 pb-4">
            <span className="text-slate-400 font-semibold">{language === 'hi' ? 'अस्वीकरण:' : 'Disclaimer:'} </span>
            {t('medicalDisclaimerText')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>© {new Date().getFullYear()} Prime Diagnostic Centre. All rights reserved.</p>
            <p className="text-slate-500">
              Shop 4, Bldg 40, Nehru Nagar, Kurla East, Mumbai 400024 · Tel: 7208627822 / 7208088515
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
