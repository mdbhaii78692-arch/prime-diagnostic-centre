import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AdminLoginProps {
  onBackToApp: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToApp }) => {
  const { login } = useAuth();
  const { language } = useLanguage();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setErrorMsg('Network or authentication service error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white">
        {/* Top Header */}
        <div>
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सार्वजनिक वेबसाइट पर लौटें' : 'Back to Public Portal'}</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-teal-900/60 border border-teal-700/60 text-teal-300 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            PRIME DIAGNOSTIC CENTRE
          </h1>
          <p className="text-xs text-amber-300 font-medium mt-1">
            {language === 'hi' 
              ? 'मरीजों की बुकिंग देखने के लिए केवल अधिकृत एडमिन को अनुमति है (पासवर्ड आवश्यक)' 
              : 'Patient bookings are strictly restricted to authorized administrators (Password Required)'}
          </p>
        </div>

        {/* Security Warning */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'hi'
              ? 'मरीजों के नाम, फोन नंबर, पर्ची और बुकिंग्स का डेटा केवल सही पासवर्ड दर्ज करने के बाद ही देखा जा सकता है।'
              : 'Strict access control. Patient bookings, medical prescriptions, and contact details can only be viewed after entering the valid administrator password.'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'hi' ? 'स्टाफ यूजरनेम' : 'Staff Username or Laboratory Email'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or director@primediagnostic.in"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-teal-500 focus:outline-none text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                {language === 'hi' ? 'एडमिन पासवर्ड (Password)' : 'Admin Password / Passkey'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? (language === 'hi' ? 'छिपाएं' : 'Hide') : (language === 'hi' ? 'दिखाएं' : 'Show')}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'hi' ? 'एडमिन पासवर्ड दर्ज करें' : 'Enter Admin Password'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-teal-500 focus:outline-none text-xs sm:text-sm text-white font-mono"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Laboratory Console'}</span>
          </button>
        </form>

        {/* Demo Authorized Staff Quick-Switch Helper */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Available Authorised Profiles for Verification:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'Prime@2026Admin')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <p className="font-semibold text-teal-300">Dr. Sharma</p>
              <p className="text-slate-500">Super Administrator</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('labadmin', 'LabAdmin#2026')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <p className="font-semibold text-teal-300">Amina Shaikh</p>
              <p className="text-slate-500">Lab Operations Head</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('dispatch', 'Dispatch@Kurla')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <p className="font-semibold text-teal-300">Santosh Kamble</p>
              <p className="text-slate-500">Dispatch & Bookings</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('catalogue', 'Catalogue#2026')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <p className="font-semibold text-teal-300">Pooja Nair</p>
              <p className="text-slate-500">Catalogue Manager</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
