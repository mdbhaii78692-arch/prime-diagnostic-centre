/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Home/Hero';
import { ServiceCategories } from './components/Home/ServiceCategories';
import { PopularTests } from './components/Home/PopularTests';
import { HealthCheckups } from './components/Home/HealthCheckups';
import { HowItWorks } from './components/Home/HowItWorks';
import { FAQSection } from './components/Home/FAQSection';
import { TestCatalogue } from './components/Catalogue/TestCatalogue';
import { PreparationGuide } from './components/Catalogue/PreparationGuide';
import { TestDetailModal } from './components/Catalogue/TestDetailModal';
import { BookingWorkflow } from './components/Booking/BookingWorkflow';
import { ContactSection } from './components/Contact/ContactSection';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { EmergencyNotice } from './components/Common/EmergencyNotice';
import { FloatingWhatsApp } from './components/Common/FloatingWhatsApp';
import { TestRecord, HealthCheckupPackage } from './types/test';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Navigation State: 'home' | 'tests' | 'prep' | 'packages' | 'contact' | 'book' | 'admin'
  const [activeView, setActiveView] = useState<string>('home');

  // Filter propagation from Hero or Categories
  const [catalogueInitialCategory, setCatalogueInitialCategory] = useState<string | undefined>();
  const [catalogueInitialQuery, setCatalogueInitialQuery] = useState<string>('');

  // Modals state
  const [selectedTestForDetails, setSelectedTestForDetails] = useState<TestRecord | null>(null);
  const [selectedTestsForBooking, setSelectedTestsForBooking] = useState<TestRecord[]>([]);
  const [bookingInitialMode, setBookingInitialMode] = useState<'PRESCRIPTION_ONLY' | 'CATALOGUE_TESTS'>('PRESCRIPTION_ONLY');

  // Handlers
  const handleSelectCategory = (categoryName: string) => {
    setCatalogueInitialCategory(categoryName);
    setCatalogueInitialQuery('');
    setActiveView('tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string) => {
    setCatalogueInitialQuery(query);
    setCatalogueInitialCategory('ALL');
    setActiveView('tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBooking = (tests?: TestRecord[]) => {
    if (tests && tests.length > 0) {
      setSelectedTestsForBooking(tests);
      setBookingInitialMode('CATALOGUE_TESTS');
    } else {
      setSelectedTestsForBooking([]);
      setBookingInitialMode('PRESCRIPTION_ONLY');
    }
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadPrescriptionBooking = () => {
    setSelectedTestsForBooking([]);
    setBookingInitialMode('PRESCRIPTION_ONLY');
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookSingleTest = (test: TestRecord) => {
    setSelectedTestsForBooking([test]);
    setBookingInitialMode('CATALOGUE_TESTS');
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookPackage = (pkg: HealthCheckupPackage) => {
    // Generate package pseudo-record for booking
    const packageTestItem: TestRecord = {
      id: pkg.id.toUpperCase(),
      name: pkg.name,
      synonyms: [pkg.name, pkg.nameHindi],
      nameHindi: pkg.nameHindi,
      description: pkg.description,
      descriptionHindi: pkg.descriptionHindi,
      category: 'Full Body Health Screening',
      subcategory: pkg.targetGroup,
      whatItMeasures: `${pkg.includedParametersCount} Parameters: ${pkg.tests.join(', ')}`,
      whatItMeasuresHindi: `${pkg.includedParametersCount} स्वास्थ्य पैरामीटर्स`,
      whyPerformed: pkg.clinicalPurpose,
      whyPerformedHindi: pkg.clinicalPurposeHindi,
      conditionsEvaluated: [pkg.category],
      specimenType: pkg.includedSampleTypes.join(' · '),
      collectionMethod: 'Multi-specimen home collection in sterile barcoded vacuum tubes',
      fastingRequirement: pkg.fastingRequired ? 'REQUIRED' : 'NOT_REQUIRED',
      fastingOptional: false,
      fastingDoctorDependent: false,
      fastingDurationHours: pkg.fastingDuration,
      waterPermitted: true,
      preparationInstructions: pkg.fastingDuration,
      preparationInstructionsHindi: pkg.fastingDuration,
      medicationPrecautions: 'Report current medications to laboratory staff.',
      processingTime: 'Same Day / 24 Hours',
      homeCollectionAvailable: true,
      specialContainerRequired: false,
      specialAppointmentRequired: false,
      prescriptionRequired: false,
      interpretationDisclaimer: 'To be interpreted by a registered physician.',
      verifiedReference: 'ICMR & NABL Preventative Health Screening Protocols',
      lastReviewedDate: '2026-09-01',
      offeredByLab: true,
      isActive: true
    };

    setSelectedTestsForBooking([packageTestItem]);
    setBookingInitialMode('CATALOGUE_TESTS');
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View is active
  if (activeView === 'admin') {
    if (isAuthenticated) {
      return <AdminDashboard onBackToApp={() => setActiveView('home')} />;
    }
    return <AdminLogin onBackToApp={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Sticky Top Header Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBookVisitClick={() => handleStartBooking()}
        onUploadPrescriptionClick={handleUploadPrescriptionBooking}
        onAdminClick={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Emergency Triage Notice on Home View */}
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <EmergencyNotice />
          </div>
        )}

        {/* HOME VIEW */}
        {activeView === 'home' && (
          <>
            <Hero
              onExploreTests={() => {
                setCatalogueInitialCategory('ALL');
                setCatalogueInitialQuery('');
                setActiveView('tests');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookHomeVisit={() => handleStartBooking()}
              onUploadPrescriptionClick={handleUploadPrescriptionBooking}
              onSearchSubmit={handleHeroSearch}
            />

            <ServiceCategories onSelectCategory={handleSelectCategory} />

            <PopularTests
              onViewDetails={(test) => setSelectedTestForDetails(test)}
              onBookTest={handleBookSingleTest}
              onViewAllTests={() => {
                setCatalogueInitialCategory('ALL');
                setCatalogueInitialQuery('');
                setActiveView('tests');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <HealthCheckups onBookPackage={handleBookPackage} />

            <HowItWorks onBookClick={() => handleStartBooking()} />

            <FAQSection />
          </>
        )}

        {/* ALL TESTS VIEW */}
        {activeView === 'tests' && (
          <TestCatalogue
            initialCategory={catalogueInitialCategory}
            initialQuery={catalogueInitialQuery}
            onViewDetails={(test) => setSelectedTestForDetails(test)}
            onBookTest={handleBookSingleTest}
          />
        )}

        {/* PREPARATION GUIDE VIEW */}
        {activeView === 'prep' && (
          <PreparationGuide
            onViewDetails={(test) => setSelectedTestForDetails(test)}
            onBookTest={handleBookSingleTest}
          />
        )}

        {/* HEALTH CHECKUPS VIEW */}
        {activeView === 'packages' && (
          <div className="py-8">
            <HealthCheckups onBookPackage={handleBookPackage} />
          </div>
        )}

        {/* CONTACT VIEW */}
        {activeView === 'contact' && (
          <ContactSection onBookHomeVisit={() => handleStartBooking()} />
        )}

        {/* BOOK HOME VISIT WIZARD */}
        {activeView === 'book' && (
          <BookingWorkflow
            key={`${bookingInitialMode}-${selectedTestsForBooking.map(t => t.id).join('_')}`}
            initialSelectedTests={selectedTestsForBooking}
            initialBookingMode={bookingInitialMode}
            onCancel={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <TestDetailModal
        test={selectedTestForDetails}
        onClose={() => setSelectedTestForDetails(null)}
        onBookTest={handleBookSingleTest}
      />

      {/* Floating Interactive WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminClick={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
