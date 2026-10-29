import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ContactSection: React.FC<{ onBookHomeVisit: () => void }> = ({ onBookHomeVisit }) => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>{language === 'hi' ? 'सीधा संपर्क एवं सहायता' : 'Direct Laboratory Access'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('contactTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards & Laboratory Coordinates (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {t('addressLabel')}
                  </h2>
                  <p className="text-sm font-semibold text-teal-900 mt-1">
                    PRIME DIAGNOSTIC CENTRE
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Shop No. 4, Building No. 40, Nehru Nagar, Kurla East, Mumbai, Maharashtra, India.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {language === 'hi'
                      ? 'निकटतम स्टेशन: कुर्ला रेलवे स्टेशन (पूर्व) · लैंडमार्क: नेहरू नगर'
                      : 'Nearest Railway Station: Kurla East · Landmark: Nehru Nagar'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Telephone Connections */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-slate-900">
                    {t('callUs')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'hi'
                      ? 'टेस्ट संबंधी पूछताछ, स्लॉट निर्धारण एवं होम कलेक्शन सहायता के लिए सीधे कॉल करें।'
                      : 'Speak directly with our clinical desk for test information and home visits.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    <a
                      href="tel:7208627822"
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div>
                        <span className="text-[11px] text-teal-300 block font-medium">Primary Line</span>
                        <span className="text-base font-bold tracking-wide">7208627822</span>
                      </div>
                      <Phone className="w-4 h-4 text-teal-400" />
                    </a>

                    <a
                      href="tel:7208088515"
                      className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-between transition-colors border border-slate-200"
                    >
                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">Secondary Line</span>
                        <span className="text-base font-bold tracking-wide">7208088515</span>
                      </div>
                      <Phone className="w-4 h-4 text-slate-600" />
                    </a>
                  </div>

                  <div className="pt-3">
                    <a
                      href="https://wa.me/917208627822?text=Hello%20Prime%20Diagnostic%20Centre,%20I%20would%20like%20to%20inquire%20about%20a%20test%20or%20book%20home%20collection."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{language === 'hi' ? 'व्हाट्सएप पर संदेश भेजें (+91 7208627822)' : 'Chat on WhatsApp (+91 7208627822)'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Strict Report Policy Notice */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-2 border border-slate-800">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wide">
                <Clock className="w-4 h-4" />
                <span>{language === 'hi' ? 'रिपोर्ट संबंधित सहायता नीति' : 'Report-Related Assistance'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('reportAssistanceText')}
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                {language === 'hi'
                  ? 'रोगियों की सुरक्षा और समय पर रिपोर्टिंग सुनिश्चित करने के लिए सभी रिपोर्ट अधिकृत पैथोलॉजिस्ट द्वारा सत्यापित की जाती हैं।'
                  : 'Diagnostic results are validated by authorized clinical pathologists before dispatch.'}
              </p>
            </div>
          </div>

          {/* Right Column: Send Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'पूछताछ या संदेश भेजें' : 'Send an Inquiry / Message'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'हमारी लैब टीम जल्द ही आपसे फोन पर संपर्क करेगी।'
                    : 'Our desk will call you back to assist with test preparation or slots.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? 'संदेश सफलतापूर्वक प्राप्त हुआ' : 'Inquiry Received'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'hi'
                      ? 'Prime Diagnostic Centre से संपर्क करने के लिए धन्यवाद। हमारा स्टाफ शीघ्र ही 7208627822 से आपसे संपर्क करेगा।'
                      : 'Thank you for reaching out. Laboratory personnel will contact you on the provided number shortly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-teal-800 hover:underline pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {t('fieldPatientName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand R. Kulkarni"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {t('fieldMobile')} *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9820145892"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-teal-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      {language === 'hi' ? 'आपका संदेश या आवश्यक टेस्ट' : 'Your Message or Required Tests'}
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Inquiring about Lipid profile fasting duration and tomorrow morning home visit availability..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'hi' ? 'संदेश सबमिट करें' : 'Submit Inquiry to Desk'}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Personal phone and health inquiries remain strictly confidential under DPDP Act 2023.
                  </p>
                </form>
              )}

              {/* Quick Book Home Visit card */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs space-y-2">
                <span className="font-bold text-teal-950 block">
                  {language === 'hi' ? 'सीधे होम विजिट बुक करना चाहते हैं?' : 'Need to book a sample collection right away?'}
                </span>
                <p className="text-slate-600 text-[11px]">
                  {language === 'hi'
                    ? 'ऑनलाइन 6-चरणीय फॉर्म द्वारा तुरंत अपना पसंदीदा स्लॉट दर्ज करें।'
                    : 'Submit your patient details and select morning or afternoon slots directly.'}
                </p>
                <button
                  type="button"
                  onClick={onBookHomeVisit}
                  className="w-full py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors"
                >
                  {t('heroBtnBook')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
