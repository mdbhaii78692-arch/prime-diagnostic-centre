import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { BookingRecord } from '../../types/booking';
import { useLanguage } from '../../context/LanguageContext';

interface BookingConfirmationProps {
  booking: BookingRecord;
  onBookAnother: () => void;
  onDone: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onBookAnother,
  onDone
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
          {/* Top Success Badge */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('confirmationTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              {t('confirmationSubtitle')}
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 mb-6 text-center space-y-2">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
              {t('bookingRefLabel')}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 tracking-wider">
                {booking.bookingRef}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-1.5 rounded-lg text-teal-800 hover:bg-teal-100 transition-colors"
                title="Copy reference number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-teal-800">
              {t('saveRefInstruction')}
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3.5 text-xs text-slate-700 mb-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-900">{language === 'hi' ? 'मरीज का नाम' : 'Patient Name'}</span>
              <span className="font-bold text-slate-800">{booking.patientName}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-900">{language === 'hi' ? 'फोन नंबर' : 'Mobile Number'}</span>
              <span className="font-medium text-slate-800">{booking.mobileNumber}</span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-200 gap-4">
              <span className="font-semibold text-slate-900 shrink-0">{language === 'hi' ? 'पसंदीदा समय' : 'Requested Schedule'}</span>
              <span className="font-medium text-slate-800 text-right">
                {booking.preferredDate} · {booking.preferredTimeSlot}
              </span>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-200 gap-4">
              <span className="font-semibold text-slate-900 shrink-0">{language === 'hi' ? 'कलेक्शन पता' : 'Home Address'}</span>
              <span className="font-medium text-slate-800 text-right">
                {booking.addressLine}, {booking.locality}, PIN {booking.pinCode}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-900 block mb-1.5">{language === 'hi' ? 'चयनित टेस्ट' : 'Selected Tests'}</span>
              <ul className="space-y-1">
                {booking.selectedTestNames.map((testName, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                    <span>{testName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Laboratory Dispatch Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('disclaimerBookingNotice')}
            </p>
          </div>

          {/* Contact Laboratory Prompt */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-8">
            <div className="text-center sm:text-left">
              <p className="font-semibold">{t('contactLabPrompt')}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Shop 4, Bldg 40, Nehru Nagar, Kurla East</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/917208627822?text=${encodeURIComponent(
                  `Hello Prime Diagnostic Centre, I have booked a home sample collection. My Booking Reference is ${booking.bookingRef} for patient ${booking.patientName}. Please confirm my visit slot.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                <span>{language === 'hi' ? 'व्हाट्सएप पर रेफरेंस भेजें' : 'Send Ref on WhatsApp'}</span>
              </a>

              <a
                href="tel:7208627822"
                className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>7208627822</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onDone}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <span>{language === 'hi' ? 'होम पेज पर वापस जाएं' : 'Return to Home Page'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBookAnother}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
            >
              {language === 'hi' ? 'अन्य टेस्ट बुक करें' : 'Book Another Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
