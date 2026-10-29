import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      qEn: 'Do all blood tests require fasting?',
      qHn: 'क्या सभी ब्लड टेस्ट के लिए खाली पेट रहना जरूरी है?',
      aEn: 'No. Many common blood tests (such as Complete Blood Count / CBC, HbA1c, Vitamin D, and Routine Thyroid TSH) do not routinely require fasting. However, metabolic tests like Fasting Blood Glucose, Lipid Profile, and Iron Studies strictly demand 8 to 12 hours of overnight fasting. Check each test page in our catalogue for exact verified instructions.',
      aHn: 'नहीं। कई सामान्य रक्त परीक्षणों जैसे CBC, HbA1c और विटामिन डी के लिए खाली पेट रहना जरूरी नहीं होता। केवल फास्टिंग ब्लड शुगर, लिपिड प्रोफाइल (कोलेस्ट्रॉल) और आयरन टेस्ट के लिए 8 से 12 घंटे का उपवास अनिवार्य है।'
    },
    {
      qEn: 'Can I drink water during fasting for diagnostic blood tests?',
      qHn: 'क्या उपवास (Fasting) के दौरान सादा पानी पी सकते हैं?',
      aEn: 'Yes, for almost all standard fasting blood tests, plain drinking water is permitted and actively encouraged to keep you well-hydrated. Dehydration can falsely elevate hemoconcentration, creatinine, and red cell counts. However, you must avoid tea, coffee, milk, juices, chewing gum, or lemon water.',
      aHn: 'हाँ, सादा पानी पीना पूरी तरह सुरक्षित है और उचित भी है, ताकि शरीर में पानी की कमी न हो। परंतु चाय, कॉफी, दूध, जूस या नींबू पानी बिल्कुल न लें।'
    },
    {
      qEn: 'Why can Semen Analysis only be conducted at the laboratory facility?',
      qHn: 'वीर्य जांच (Semen Analysis) केवल लैब में ही क्यों होती है?',
      aEn: 'According to WHO standards, human sperm motility degrades rapidly within minutes of collection when exposed to room temperature or transport vibrations. The sample must be liquefied at 37°C in a specialized incubator immediately after collection to provide an accurate microscopic evaluation. Therefore, home collection is not provided for semen analysis.',
      aHn: 'WHO के वैज्ञानिक नियमों के अनुसार शुक्राणुओं की गतिशीलता कमरे के तापमान पर तेजी से घटती है। सटीक रिपोर्ट के लिए सैंपल को तुरंत 37 डिग्री सेल्सियस पर रखना आवश्यक होता है, इसलिए यह जांच केवल लैब सेंटर पर ही कराई जा सकती है।'
    },
    {
      qEn: 'Should I stop taking my daily medicines before a blood test?',
      qHn: 'क्या टेस्ट से पहले अपनी रोज की दवाइयां बंद कर देनी चाहिए?',
      aEn: 'Never stop or alter prescribed medications (such as blood pressure, heart, epilepsy, or thyroid pills) on your own without direct advice from your treating physician. If you take thyroid medications, take your morning dose after the blood sample is drawn unless your doctor advised otherwise. Always mention your medications to our phlebotomist.',
      aHn: 'डॉक्टर की अनुमति के बिना बीपी, दिल या डायबिटीज की दवाएं कभी बंद न करें। थायरॉइड की दवा आमतौर पर खून देने के बाद ली जाती है। अपने सभी दवाओं की जानकारी लैब तकनीशियन को अवश्य दें।'
    },
    {
      qEn: 'When and how can I receive my diagnostic test reports?',
      qHn: 'टेस्ट की रिपोर्ट कैसे और कब प्राप्त होगी?',
      aEn: 'For report-related assistance, please contact Prime Diagnostic Centre directly. Our desk coordinates with your referring doctor and provides verified pathology reports as soon as authorized clinical verification is completed.',
      aHn: 'रिपोर्ट से संबंधित जानकारी के लिए कृपया Prime Diagnostic Centre से सीधे संपर्क करें। अधिकृत पैथोलॉजिस्ट द्वारा जांच पूर्ण होने पर आपको सूचित किया जाता है।'
    },
    {
      qEn: 'Is a doctor’s prescription required to book a home sample collection?',
      qHn: 'क्या होम कलेक्शन के लिए डॉक्टर की पर्ची अनिवार्य है?',
      aEn: 'A prescription is helpful to verify the exact clinical investigations your doctor requested, but you can also request routine wellness tests and self-monitoring panels directly. For specialized investigations, molecular assays, or radiographs, a verified medical prescription is recommended.',
      aHn: 'पर्ची होने से सही टेस्ट की पहचान आसान हो जाती है। आप सामान्य स्वास्थ्य जांच सीधे भी बुक कर सकते हैं। विशेष जांचों के लिए डॉक्टर की पर्ची संलग्न करना बेहतर होता है।'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'hi' ? 'मरीजों के सामान्य प्रश्न' : 'Patient Information & FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {language === 'hi'
              ? 'जांच की तैयारी, खाली पेट रहने के नियम और होम कलेक्शन संबंधी स्पष्टीकरण।'
              : 'Clear, authoritative guidance on fasting, specimen collection, and home phlebotomy.'}
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {language === 'hi' ? faq.qHn : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{language === 'hi' ? faq.aHn : faq.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>
            {language === 'hi'
              ? 'क्या आपके मन में कोई अन्य चिकित्सीय प्रश्न है? हमारी लैब से बात करें।'
              : 'Have additional questions regarding your specific diagnostic test?'}
          </span>
          <a
            href="tel:7208627822"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7208627822</span>
          </a>
        </div>
      </div>
    </section>
  );
};
