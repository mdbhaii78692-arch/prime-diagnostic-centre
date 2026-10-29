import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const LAB_WHATSAPP_NUMBER = '917208627822';

  const defaultMessage = language === 'hi'
    ? 'नमस्ते Prime Diagnostic Centre, मुझे टेस्ट और होम कलेक्शन के बारे में जानकारी चाहिए।'
    : 'Hello Prime Diagnostic Centre, I would like to inquire about diagnostic tests and home sample collection.';

  const handleOpenWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText || defaultMessage);
    const url = `https://wa.me/${LAB_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickQuestions = [
    {
      en: 'I want to book a Home Sample Collection in Kurla/Mumbai',
      hi: 'मुझे कुर्ला/मुंबई में होम सैंपल कलेक्शन बुक करना है'
    },
    {
      en: 'Is fasting required for my test?',
      hi: 'क्या मेरे टेस्ट के लिए खाली पेट रहना जरूरी है?'
    },
    {
      en: 'I have a doctor prescription to share for test advice',
      hi: 'मेरे पास डॉक्टर की पर्ची है, मुझे टेस्ट की जानकारी चाहिए'
    },
    {
      en: 'Inquiry regarding report assistance',
      hi: 'रिपोर्ट से संबंधित सहायता के लिए जानकारी चाहिए'
    }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs">
          {/* Header */}
          <div className="p-4 bg-[#075E54] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6 fill-white text-[#075E54]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white leading-tight">
                  PRIME DIAGNOSTIC CENTRE
                </h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {language === 'hi' ? 'व्हाट्सएप सपोर्ट सक्रिय' : 'WhatsApp Support Active'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Close chat box"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Bubble Body */}
          <div className="p-4 bg-[#ECE5DD] space-y-3 max-h-72 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-2xs max-w-[88%] space-y-1">
              <p className="font-semibold text-slate-800 text-[11px]">
                Prime Diagnostic Centre (Nehru Nagar, Kurla East)
              </p>
              <p className="text-slate-700 leading-relaxed">
                {language === 'hi'
                  ? 'नमस्ते! हम आपकी क्या सहायता कर सकते हैं? आप नीचे दिए गए विषय चुन सकते हैं या सीधा मैसेज भेज सकते हैं।'
                  : 'Hello! How can we assist you today? Select a common inquiry below or send us a direct message.'}
              </p>
              <span className="text-[10px] text-slate-400 block text-right">Just now</span>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {language === 'hi' ? 'त्वरित संदेश चुनें:' : 'Quick Inquiries:'}
              </p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(language === 'hi' ? q.hi : q.en)}
                  className="w-full text-left p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-300/60 shadow-2xs transition-all hover:border-emerald-600 flex items-center justify-between gap-1 group"
                >
                  <span className="line-clamp-1">{language === 'hi' ? q.hi : q.en}</span>
                  <Send className="w-3 h-3 text-[#25D366] shrink-0 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Input & Direct Send Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleOpenWhatsApp(customMsg);
                    setCustomMsg('');
                  }
                }}
                placeholder={
                  language === 'hi'
                    ? 'अपना संदेश यहां लिखें...'
                    : 'Type your message here...'
                }
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#25D366] text-xs text-slate-900"
              />
              <button
                onClick={() => {
                  handleOpenWhatsApp(customMsg);
                  setCustomMsg('');
                }}
                className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs transition-colors shrink-0"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500">
              <span>Direct: +91 7208627822</span>
              <span>Kurla East, Mumbai</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full animate-ping" />
        </div>
        <span className="font-bold text-xs sm:text-sm tracking-wide">
          {language === 'hi' ? 'व्हाट्सएप पर बात करें' : 'WhatsApp'}
        </span>
      </button>
    </div>
  );
};
