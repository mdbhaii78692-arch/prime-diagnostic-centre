import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  MapPin, 
  Database,
  Lock,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { getMasterCatalogue } from '../../data/catalogueDatabase';
import { BookingRecord, BookingStatus } from '../../types/booking';
import { BookingDrawer } from './BookingDrawer';
import { CatalogueManagerTab } from './CatalogueManagerTab';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const { currentUser, logout, auditLogs, logSecurityEvent } = useAuth();
  const { bookings, getBookingStats } = useBooking();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOOKINGS' | 'CATALOGUE' | 'SERVICES' | 'AUDIT'>('OVERVIEW');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Booking Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');

  // Service Management State
  const [homeCollectionActive, setHomeCollectionActive] = useState(true);
  const [serviceZones, setServiceZones] = useState([
    { zone: 'Nehru Nagar (Kurla East)', status: 'ACTIVE', avgResponseTime: '30 mins' },
    { zone: 'Tilak Nagar (Kurla East)', status: 'ACTIVE', avgResponseTime: '45 mins' },
    { zone: 'Kamgar Nagar & Shiv Srushti', status: 'ACTIVE', avgResponseTime: '40 mins' },
    { zone: 'Chembur East / Postal Colony', status: 'ACTIVE', avgResponseTime: '50 mins' },
    { zone: 'Ghatkopar East / Pant Nagar', status: 'ACTIVE', avgResponseTime: '60 mins' },
    { zone: 'Chunabhatti / Everard Nagar', status: 'ACTIVE', avgResponseTime: '45 mins' }
  ]);

  const stats = getBookingStats();
  const totalCatalogueCount = getMasterCatalogue().length;

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (!bookingSearch.trim()) return true;
    const q = bookingSearch.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(q) ||
      b.patientName.toLowerCase().includes(q) ||
      b.mobileNumber.includes(q) ||
      b.locality.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'NEW_REQUEST':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">NEW_REQUEST</span>;
      case 'CONFIRMED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-200">CONFIRMED</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">ASSIGNED</span>;
      case 'SAMPLE_COLLECTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">COLLECTED</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200">CANCELLED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white">
            <Activity className="w-4 h-4 text-teal-200" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                PRIME DIAGNOSTIC CENTRE
              </span>
              <span className="hidden sm:inline text-slate-500">·</span>
              <span className="hidden sm:inline text-xs font-mono text-teal-400">
                Staff Console
              </span>
            </div>
          </div>
        </div>

        {/* Staff Identity & Logout */}
        <div className="flex items-center gap-3 text-xs">
          {currentUser && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-slate-200">{currentUser.fullName}</span>
              <span className="text-[11px] text-teal-400 font-mono">{currentUser.role}</span>
            </div>
          )}

          <button
            onClick={logout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
            title="Log out of staff session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Nav Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-semibold py-1">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Operations Overview
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'BOOKINGS'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Bookings & Home Visits</span>
            {stats.newRequests > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {stats.newRequests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('CATALOGUE')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CATALOGUE'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Master Catalogue ({totalCatalogueCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'SERVICES'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Zones & Slots
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`py-3 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'AUDIT'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: OVERVIEW & REAL STATISTICS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* 6 Real Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 block font-medium">Total Bookings</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                  {stats.total}
                </span>
                <span className="text-[11px] text-teal-700 mt-1 block font-medium">Patient Requests</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-amber-800 block font-medium">New Requests (Pending)</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 block">
                  {stats.newRequests}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Awaiting Staff Call</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-teal-800 block font-medium">Confirmed / Scheduled</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-1 block">
                  {stats.confirmed + stats.assigned}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Phlebotomy En Route</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 block font-medium">Verified Test Database</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block font-mono">
                  {totalCatalogueCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Active Medical Records</span>
              </div>
            </div>

            {/* Recent Pending Bookings quick list */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Incoming Home Collection Requests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming requests, verify prescription attachments, and assign phlebotomists.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('BOOKINGS')}
                  className="text-xs font-semibold text-teal-800 hover:underline"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-slate-900">{b.bookingRef}</span>
                        {getStatusBadge(b.status)}
                        {b.hasPrescription && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                            Rx Attached
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-800">
                        {b.patientName} ({b.age} yrs) · {b.locality}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{b.preferredDate} · {b.preferredTimeSlot.slice(0, 18)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'BOOKINGS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Home Collection Bookings Dispatch Console
                </h2>
                <p className="text-xs text-slate-500">
                  Total {bookings.length} patient requests registered in system.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by Booking Ref (PDC-2026-XXXXX), patient name, mobile, or locality..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-teal-600"
                >
                  <option value="ALL">All Statuses ({bookings.length})</option>
                  <option value="NEW_REQUEST">New Request</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="SAMPLE_COLLECTED">Sample Collected</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Patient Name & Contact</th>
                      <th className="py-3 px-4">Address / Area</th>
                      <th className="py-3 px-4">Visit Schedule</th>
                      <th className="py-3 px-4">Tests & Rx</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {b.bookingRef}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{b.patientName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {b.mobileNumber} · {b.age} yrs ({b.gender})
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800 line-clamp-1">{b.locality}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{b.addressLine}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{b.preferredDate}</p>
                          <p className="text-[11px] text-slate-500">{b.preferredTimeSlot.slice(0, 18)}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800">{b.selectedTestNames.length} Tests</p>
                          {b.hasPrescription ? (
                            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                              Rx Attached
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">No Rx</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MASTER TEST CATALOGUE MANAGEMENT */}
        {activeTab === 'CATALOGUE' && <CatalogueManagerTab />}

        {/* TAB 4: SERVICE ZONES & SLOTS */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Home Sample Collection Master Switch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controls whether patients can book home collection requests online.
                  </p>
                </div>
                <button
                  onClick={() => setHomeCollectionActive(!homeCollectionActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    homeCollectionActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {homeCollectionActive ? 'Home Collection Enabled' : 'Temporarily Disabled'}
                </button>
              </div>
            </div>

            {/* Kurla East & Mumbai Service Zones */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Authorized Phlebotomy Service Zones (Mumbai Region)
              </h3>
              <p className="text-xs text-slate-500">
                Operating from Shop No. 4, Building No. 40, Nehru Nagar, Kurla East.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
                {serviceZones.map((z, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{z.zone}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {z.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Avg Response: {z.avgResponseTime}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DPDP ACT 2023 SECURITY AUDIT LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <span>DPDP Act 2023 Statutory Audit Logging & Access Governance</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In compliance with the Digital Personal Data Protection Act, 2023 (India), all access events to patient personal information, authentication attempts, status transitions, and catalogue imports are recorded with immutable timestamps and staff identity attribution.
              </p>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-semibold text-[11px] sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Staff / Actor</th>
                      <th className="py-3 px-4">Event Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-teal-800">
                          {log.resourceType}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-sans">
                          {log.actor}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-sans">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Drawer for detailed view & editing */}
      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};
