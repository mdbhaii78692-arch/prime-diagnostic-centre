import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { PrescriptionDoc } from '../../types/booking';
import { useLanguage } from '../../context/LanguageContext';

interface PrescriptionUploaderProps {
  prescription?: PrescriptionDoc;
  onChange: (prescription: PrescriptionDoc | undefined) => void;
}

export const PrescriptionUploader: React.FC<PrescriptionUploaderProps> = ({ prescription, onChange }) => {
  const { language, t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(
        language === 'hi'
          ? 'फाइल का आकार 10MB से अधिक नहीं होना चाहिए।'
          : 'File size must not exceed 10 MB.'
      );
      return;
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError(
        language === 'hi'
          ? 'केवल JPG, PNG या PDF फाइल ही मान्य है।'
          : 'Only JPG, JPEG, PNG, or PDF files are accepted.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const doc: PrescriptionDoc = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        previewUrl: file.type.startsWith('image/') ? result : undefined,
        uploadedAt: new Date().toISOString(),
        status: 'PENDING_STAFF_VERIFICATION'
      };
      onChange(doc);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {!prescription ? (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl bg-slate-50/50 hover:bg-teal-50/30 transition-all cursor-pointer group">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-teal-700 group-hover:border-teal-300 transition-colors mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 text-center mb-1">
            {language === 'hi' ? 'डॉक्टर की पर्ची अपलोड करने के लिए क्लिक करें' : 'Click or drag prescription photo here'}
          </p>
          <p className="text-xs text-slate-500 text-center max-w-sm">
            {t('prescriptionHelp')}
          </p>
        </label>
      ) : (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              {prescription.previewUrl ? (
                <img
                  src={prescription.previewUrl}
                  alt="Prescription preview"
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="truncate">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पर्ची संलग्न है' : 'Prescription Attached'}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{prescription.fileName}</p>
                <p className="text-xs text-slate-500">
                  {(prescription.fileSize / 1024).toFixed(0)} KB · {prescription.mimeType}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove prescription"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
