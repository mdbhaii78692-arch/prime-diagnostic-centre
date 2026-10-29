import React, { useState } from 'react';
import { 
  Activity, 
  Phone, 
  Globe, 
  Menu, 
  X, 
  CalendarPlus, 
  Search, 
  ShieldCheck, 
  Lock, 
  FileCheck2,
  MessageCircle,
  UploadCloud 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onBookVisitClick: () => void;
  onUploadPrescriptionClick: () => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onBookVisitClick,
  onUploadPrescriptionClick,
  onAdminClick
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'tests', label: t('navTests') },
    { id: 'prep', label: t('navPrepGuide') },
    { id: 'packages', label: t('navPackages') },
    { id: 'contact', label: t('navContact') }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top micro banner for direct phone & location */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">{t('locationShort')}</span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">
              {language === 'hi' ? 'दुकान नं. 4, बिल्डिंग 40, नेहरू नगर' : 'Shop 4, Bldg 40, Nehru Nagar'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:7208627822"
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold tracking-wide">7208627822</span>
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="tel:7208088515"
              className="hidden md:inline hover:text-white transition-colors font-medium"
            >
              7208088515
            </a>

            <a
              href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20diagnostic%20tests%20or%20home%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>WhatsApp: 7208627822</span>
            </a>

            <button
              onClick={onAdminClick}
              className="ml-2 inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title={language === 'hi' ? 'केवल अधिकृत एडमिन - पासवर्ड आवश्यक' : 'Admin Only - Password Required'}
            >
              <Lock className="w-3 h-3 text-teal-400" />
              <span className="font-medium">{language === 'hi' ? 'बुकिंग्स देखें (एडमिन)' : 'View Bookings (Admin)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-teal-900 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                PRIME
              </span>
              <span className="text-sm sm:text-base font-semibold text-teal-800 tracking-wide">
                DIAGNOSTIC CENTRE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              {t('tagline')}
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`py-1 transition-colors relative ${
                activeView === link.id
                  ? 'text-teal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>

          {/* WhatsApp Direct Chat Button */}
          <a
            href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20diagnostic%20tests%20or%20home%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-2xs transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          {/* Upload Doctor Prescription Fast CTA */}
          <button
            onClick={onUploadPrescriptionClick}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold shadow-2xs transition-colors"
            title={language === 'hi' ? 'केवल डॉक्टर की पर्ची अपलोड करके टेस्ट बुक करें' : 'Upload doctor prescription & book without choosing tests'}
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
            <span>{language === 'hi' ? 'पर्ची अपलोड करें' : 'Upload Rx'}</span>
          </button>

          {/* Quick Book Home Visit CTA */}
          <button
            onClick={onBookVisitClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <CalendarPlus className="w-4 h-4 text-teal-100" />
            <span className="whitespace-nowrap">{t('heroBtnBook')}</span>
          </button>

          {/* Admin Portal Gateway */}
          <button
            onClick={onAdminClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="Authorized Laboratory Staff Portal"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('navAdmin')}</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm ${
                  activeView === link.id
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                onUploadPrescriptionClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-sm font-bold text-teal-900 hover:bg-teal-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-teal-700" />
                {language === 'hi' ? 'केवल डॉक्टर की पर्ची अपलोड करें' : 'Upload Prescription (No Test Search)'}
              </span>
              <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                {language === 'hi' ? 'त्वरित' : 'Direct'}
              </span>
            </button>

            <button
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span>{language === 'hi' ? 'बुकिंग्स देखें (केवल एडमिन)' : 'View Bookings (Admin Only)'}</span>
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {language === 'hi' ? 'पासवर्ड आवश्यक' : 'Password Required'}
              </span>
            </button>

            <a
              href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20diagnostic%20tests%20or%20home%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow-xs hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>{language === 'hi' ? 'व्हाट्सएप पर संपर्क करें' : 'Chat on WhatsApp'}</span>
            </a>

            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>Kurla East, Mumbai</span>
              <a href="tel:7208627822" className="text-teal-800 font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3" />
                7208627822
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
