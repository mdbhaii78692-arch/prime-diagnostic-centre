import React from 'react';
import { 
  ArrowRight, 
  Phone, 
  CalendarPlus, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Microscope, 
  MapPin, 
  Search,
  MessageCircle,
  UploadCloud 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onExploreTests: () => void;
  onBookHomeVisit: () => void;
  onUploadPrescriptionClick: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreTests, 
  onBookHomeVisit, 
  onUploadPrescriptionClick,
  onSearchSubmit 
}) => {
  const { language, t } = useLanguage();
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    } else {
      onExploreTests();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-24">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Content (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>{t('heroBadge')}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Nehru Nagar, Kurla East</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('heroHeading')}
            </h1>

            {/* Tagline & Subheading */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              {t('heroDescription')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookHomeVisit}
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-teal-100" />
                <span>{t('heroBtnBook')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreTests}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-colors"
              >
                {t('heroBtnExplore')}
              </button>

              <a
                href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20diagnostic%20tests%20or%20home%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>{language === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}</span>
              </a>

              <a
                href="tel:7208627822"
                className="px-4 py-3.5 rounded-xl text-teal-300 hover:text-white hover:bg-slate-800/60 font-medium text-sm inline-flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>{t('heroBtnCall')}: 7208627822</span>
              </a>
            </div>

            {/* Quick Hero Search Box */}
            <form onSubmit={handleSearch} className="pt-4 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'टेस्ट खोजें: CBC, थायरॉइड (TSH), ब्लड शुगर, विटामिन D...'
                      : 'Search 2,500+ tests: CBC, TSH, Blood Glucose, HbA1c, Vitamin D...'
                  }
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:placeholder:text-slate-400 text-sm border border-slate-700 focus:border-teal-500 focus:outline-none transition-all duration-200 text-white focus:text-slate-900 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors"
                >
                  {language === 'hi' ? 'खोजें' : 'Search'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {language === 'hi'
                  ? 'लोकप्रिय खोजें: CBC · फास्टिंग शुगर · थायरॉइड प्रोफाइल · LFT · KFT · पेशाब की जांच'
                  : 'Common searches: CBC · Fasting Glucose · Thyroid Profile · LFT · KFT · Urine Routine'}
              </p>
            </form>

            {/* Direct Prescription Upload Fast-Track Card */}
            <div className="pt-2 max-w-xl">
              <div 
                onClick={onUploadPrescriptionClick}
                className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 to-slate-800/80 border border-teal-500/40 hover:border-teal-400 cursor-pointer transition-all hover:shadow-lg flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600/30 text-teal-300 border border-teal-500/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-200 transition-colors">
                      {language === 'hi'
                        ? 'डॉक्टर की पर्ची है? केवल पर्ची अपलोड करके बुक करें'
                        : 'Have a Doctor Prescription? Upload & Book Directly'}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {language === 'hi'
                        ? 'टेस्ट खोजने की कोई जरूरत नहीं · हमारा लैब स्टाफ पर्ची देखकर सब कुछ तैयार करेगा'
                        : 'No test search needed · Our lab pathologist will review and confirm all tests'}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shrink-0 transition-colors">
                  {language === 'hi' ? 'पर्ची अपलोड करें' : 'Upload Rx'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Highlights & Laboratory Trust Card (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-800/80 border border-slate-700 shadow-xl backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      PRIME DIAGNOSTIC CENTRE
                    </h3>
                    <p className="text-xs text-teal-400 font-medium">
                      Kurla East, Mumbai
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {language === 'hi' ? 'सक्रिय सेवाएं' : 'Active Centre'}
                  </span>
                </div>
              </div>

              {/* 3 Core Trust Pillars */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-teal-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'hi' ? '2,500+ प्रमाणित टेस्ट कैटलॉग' : '2,500+ Verified Diagnostic Tests'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      {language === 'hi'
                        ? 'हेमेटोलॉजी, बायोकेमिस्ट्री, हार्मोन, माइक्रोबायोलॉजी व मॉलिक्यूलर जांच।'
                        : 'Covering comprehensive haematology, biochemistry, hormones, immunology & cultures.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-teal-400 shrink-0">
                    <ThermometerSnowflake className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'hi' ? 'प्रमाणित कोल्ड-चेन सैंपल कलेक्शन' : 'Cold-Chain Home Phlebotomy'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      {language === 'hi'
                        ? 'वैक्यूटाइनर ट्यूब्स एवं तापमान नियंत्रित आइस-पैक से सुरक्षित सैंपल परिवहन।'
                        : 'Trained staff, vacuum EDTA/SST tubes, and immediate temperature stabilization.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-teal-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {language === 'hi' ? 'नेहरू नगर, कुर्ला पूर्व में स्थित' : 'Prime Location in Kurla East'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Shop No. 4, Building No. 40, Nehru Nagar, Kurla East, Mumbai 400024.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Call */}
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{language === 'hi' ? 'हेल्पलाइन:' : 'Helpline:'}</span>
                <div className="flex items-center gap-3">
                  <a href="tel:7208627822" className="text-teal-300 font-bold hover:underline">
                    7208627822
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:7208088515" className="text-slate-300 hover:text-white">
                    7208088515
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
