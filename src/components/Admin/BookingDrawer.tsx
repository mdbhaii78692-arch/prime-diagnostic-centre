import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ExternalLink,
  MessageSquare,
  Search,
  Plus,
  Trash2,
  ClipboardCheck
} from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../types/booking';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { getMasterCatalogue } from '../../data/catalogueDatabase';

interface BookingDrawerProps {
  booking: BookingRecord | null;
  onClose: () => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({ booking, onClose }) => {
  const { updateBookingStatus, assignPhlebotomist, addInternalNotes, updateBookingTests } = useBooking();
  const { currentUser, hasRole } = useAuth();

  if (!booking) return null;

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [remarks, setRemarks] = useState('');
  const [phlebotomist, setPhlebotomist] = useState(booking.assignedPhlebotomist || '');
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes || '');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Test assignment by lab staff (especially for prescription-only bookings)
  const [assignedTestNames, setAssignedTestNames] = useState<string[]>(booking.selectedTestNames);
  const [assignedTestIds, setAssignedTestIds] = useState<string[]>(booking.selectedTestIds);
  const [testSearchQuery, setTestSearchQuery] = useState('');

  const allCatalogue = React.useMemo(() => getMasterCatalogue(), []);

  const searchResults = React.useMemo(() => {
    if (!testSearchQuery.trim()) return [];
    const q = testSearchQuery.toLowerCase();
    return allCatalogue
      .filter((t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [testSearchQuery, allCatalogue]);

  const handleAddTest = (test: { id: string; name: string }) => {
    // If clearing placeholder
    const cleanNames = assignedTestNames.filter(
      (n) => !n.includes('Prescription') && !n.includes('पर्ची') && !n.includes('RX-UPLOAD')
    );
    const cleanIds = assignedTestIds.filter((id) => id !== 'RX-UPLOAD-PENDING');

    if (!cleanIds.includes(test.id)) {
      setAssignedTestNames([...cleanNames, test.name]);
      setAssignedTestIds([...cleanIds, test.id]);
    }
    setTestSearchQuery('');
  };

  const handleRemoveTest = (index: number) => {
    setAssignedTestNames(assignedTestNames.filter((_, i) => i !== index));
    setAssignedTestIds(assignedTestIds.filter((_, i) => i !== index));
  };

  const phlebotomistList = [
    'Ramesh Gawli (Certified Senior Phlebotomist)',
    'Sunita More (Certified Home Collection Staff)',
    'Imran Pathan (Mobile Phlebotomy Technician)',
    'Pooja Shinde (Pediatric Phlebotomy Specialist)'
  ];

  const handleUpdate = () => {
    let changed = false;

    if (status !== booking.status) {
      updateBookingStatus(booking.id, status, remarks);
      changed = true;
    }

    if (phlebotomist !== booking.assignedPhlebotomist) {
      assignPhlebotomist(booking.id, phlebotomist);
      changed = true;
    }

    if (internalNotes !== booking.internalNotes) {
      addInternalNotes(booking.id, internalNotes);
      changed = true;
    }

    if (JSON.stringify(assignedTestNames) !== JSON.stringify(booking.selectedTestNames)) {
      updateBookingTests(booking.id, assignedTestIds, assignedTestNames);
      changed = true;
    }

    setSuccessNotice('Booking details, assigned tests, and administrative status updated successfully.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-teal-300 bg-slate-800 px-2 py-0.5 rounded">
                {booking.bookingRef}
              </span>
              <span className="text-xs text-slate-400">
                Created {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {booking.patientName} ({booking.age} yrs, {booking.gender})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-700 flex-1">
          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Quick Contact & Address Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wide">
                Patient Contact & Residential Address
              </span>
              <a
                href={`tel:${booking.mobileNumber}`}
                className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {booking.mobileNumber}</span>
              </a>
            </div>

            <div className="space-y-1.5 text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {booking.addressLine}, {booking.locality}, PIN {booking.pinCode}
                  {booking.landmark && ` (Landmark: ${booking.landmark})`}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Requested Schedule: <strong className="text-slate-800">{booking.preferredDate}</strong> at <strong className="text-slate-800">{booking.preferredTimeSlot}</strong></span>
              </p>
              {booking.specialInstructions && (
                <p className="p-2.5 rounded-lg bg-white border border-slate-200 italic">
                  "{booking.specialInstructions}"
                </p>
              )}
            </div>
          </div>

          {/* Prescription-Only Notification for Staff */}
          {booking.bookingType === 'PRESCRIPTION_ONLY' && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-amber-950">
                <ClipboardCheck className="w-4 h-4 text-amber-700" />
                <span>Prescription-Only Booking (Pathologist Review Needed)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                The patient booked home visit by uploading doctor's prescription directly without choosing tests. Please inspect the prescription below, verify test names, and add them to this booking using the search tool below.
              </p>
            </div>
          )}

          {/* Prescription Document Preview */}
          {booking.prescription ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-800" />
                  <span>Prescription Document Review</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                  {booking.prescription.status}
                </span>
              </div>

              {booking.prescription.previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={booking.prescription.previewUrl}
                    alt="Prescription Scan"
                    className="w-full max-h-72 object-contain rounded-xl border border-slate-200 bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    File: {booking.prescription.fileName} ({(booking.prescription.fileSize / 1024).toFixed(0)} KB)
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <FileText className="w-8 h-8 text-teal-800 mx-auto" />
                  <p className="font-semibold text-slate-800">{booking.prescription.fileName}</p>
                  <p className="text-[11px] text-slate-500">PDF Document attached by patient</p>
                </div>
              )}

              {booking.prescription.ocrExtractedNotes && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-[11px]">
                  <strong>Transcribed Doctor Note: </strong>
                  {booking.prescription.ocrExtractedNotes}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 italic">
              No prescription document attached. Referring Doctor: {booking.referringDoctor || 'Self-Referral'}
            </div>
          )}

          {/* Diagnostic Tests Assignment / Management */}
          <div className="space-y-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-800" />
                <span>Assigned Diagnostic Tests ({assignedTestNames.length})</span>
              </h3>
              {JSON.stringify(assignedTestNames) !== JSON.stringify(booking.selectedTestNames) && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Pending Save
                </span>
              )}
            </div>

            {/* Current Tests List */}
            <ul className="space-y-1.5">
              {assignedTestNames.map((tName, i) => (
                <li key={i} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                    <span className="truncate">{tName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(i)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors shrink-0"
                    title="Remove test"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Staff Search & Add Tests to this Booking */}
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-700">
                Search & Add Tests to this Booking (from 2,520+ catalogue):
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={testSearchQuery}
                  onChange={(e) => setTestSearchQuery(e.target.value)}
                  placeholder="Type test name or code (e.g. CBC, Lipid, HbA1c, Vit D)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Autocomplete dropdown */}
              {searchResults.length > 0 && (
                <div className="border border-slate-200 rounded-xl bg-white shadow-md overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto mt-1">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAddTest(item)}
                      className="p-2 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="truncate mr-2">
                        <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.category} · {item.specimenType}</p>
                      </div>
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded shrink-0">
                        + Add Test
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Operational Controls: Status & Phlebotomist Assignment */}
          <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-200 space-y-3.5">
            <h3 className="font-bold text-teal-950 uppercase tracking-wide">
              Operational Dispatch & Status Control
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Booking Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none"
                >
                  <option value="NEW_REQUEST">NEW_REQUEST</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="UNABLE_TO_FULFIL">UNABLE_TO_FULFIL</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Assign Certified Phlebotomist
                </label>
                <select
                  value={phlebotomist}
                  onChange={(e) => setPhlebotomist(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                >
                  <option value="">-- Unassigned --</option>
                  {phlebotomistList.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Status Change Remarks (Logged to Audit Trail)
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Confirmed with patient on phone; slot assigned for 7:30 AM"
                className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Internal Clinical Notes (Staff Eyes Only)
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Private laboratory instructions, vacutainer codes, cold box details..."
                className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Audit History Trail */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wide mb-2">
              Booking Audit History & Status Trail
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
              {booking.statusHistory.map((item, idx) => (
                <div key={idx} className="pt-2 text-[11px] text-slate-600 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.status}</span>
                    <span className="text-slate-400 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-500">By: {item.updatedBy}</p>
                  {item.remarks && <p className="italic text-slate-700 font-medium">"{item.remarks}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-6 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
