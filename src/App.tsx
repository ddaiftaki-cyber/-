/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductConfig, HotspotAnnotation, PricingPlan } from './types';
import { MATERIAL_PRESETS, PRICING_PLANS } from './data/productData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveCameraStudio } from './components/LiveCameraStudio';
import { SpatialFeatureMatrix } from './components/SpatialFeatureMatrix';
import { ExplodedInspector } from './components/ExplodedInspector';
import { CustomizerStudio } from './components/CustomizerStudio';
import { InteractiveBenchmarks } from './components/InteractiveBenchmarks';
import { TechSpecsSheet } from './components/TechSpecsSheet';
import { PricingTiers } from './components/PricingTiers';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { ARRoomViewer } from './components/ARRoomViewer';
import { OnboardingTour } from './components/OnboardingTour';

export default function App() {
  // Master 3D Product Configuration State
  const [config, setConfig] = useState<ProductConfig>({
    material: MATERIAL_PRESETS[0],
    coreGlowColor: '#00f0ff',
    isExploded: false,
    explodedProgress: 0,
    isWireframe: false,
    lightingPreset: 'studio',
    sceneMode: 'PRODUCT_CORE',
    autoRotate: false,
    rotationSpeed: 0.8,
    activeHotspotId: null,
    cameraPreset: 'front',
    performanceMode: 'ultra',
    engravingText: 'V380-SOLAR-4G',
    ptzPanAngle: 0,
    ptzTiltAngle: 0,
    alarmActive: false,
    ecoMode: false,
  });

  // Selected annotation / hotspot state
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotAnnotation | null>(null);

  // Reservation Modal state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PRICING_PLANS[1]); // Studio Pro default

  // AR Room View Modal State
  const [isAROpen, setIsAROpen] = useState(false);

  // Interactive Onboarding Tour State
  const [isTourOpen, setIsTourOpen] = useState(() => {
    try {
      const completed = localStorage.getItem('v380_onboarding_completed');
      return completed !== 'true';
    } catch {
      return true;
    }
  });

  const handleConfigChange = (updates: Partial<ProductConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleOpenReservation = (plan?: PricingPlan) => {
    if (plan) {
      setSelectedPlan(plan);
    }
    setIsReservationOpen(true);
  };

  const handleOpenAR = () => {
    setIsAROpen(true);
  };

  const handleOpenTour = () => {
    setIsTourOpen(true);
  };

  const handleScrollToCustomizer = () => {
    const el = document.getElementById('customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans relative transition-all duration-500 ${
      config.ecoMode ? 'eco-mode-active' : ''
    }`}>
      
      {/* Floating Eco-Mode Active Pill Bar */}
      {config.ecoMode && (
        <div className="fixed bottom-6 left-6 z-40 bg-emerald-950/90 border border-emerald-500/60 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-3 text-xs text-emerald-300 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="font-bold">وضع توفير الطاقة (Eco-Mode) نشط</span>
            <span className="text-[10px] text-emerald-400/80 block">تم تقليل السطوع وإيقاف التحديثات المستمرة لتسريع الأداء</span>
          </div>
          <button
            onClick={() => handleConfigChange({ ecoMode: false, performanceMode: 'balanced' })}
            className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold transition-colors mr-1"
          >
            إيقاف
          </button>
        </div>
      )}
      
      {/* Sleek Glassmorphism Navigation Bar */}
      <Navbar
        config={config}
        onConfigChange={handleConfigChange}
        onOpenReservation={() => handleOpenReservation(selectedPlan)}
        onOpenAR={handleOpenAR}
        onOpenTour={handleOpenTour}
      />

      {/* Hero Section with Live Interactive 3D WebGL Viewport */}
      <HeroSection
        config={config}
        onConfigChange={handleConfigChange}
        onSelectHotspot={setSelectedHotspot}
        onOpenReservation={() => handleOpenReservation(selectedPlan)}
        onOpenAR={handleOpenAR}
        onOpenTour={handleOpenTour}
      />

      {/* Live Camera Stream & Interactive 360 PTZ Remote Controller Studio */}
      <LiveCameraStudio
        config={config}
        onConfigChange={handleConfigChange}
        onOpenReservation={() => handleOpenReservation(selectedPlan)}
      />

      {/* Spatial Feature Architecture Matrix */}
      <SpatialFeatureMatrix
        config={config}
        onConfigChange={handleConfigChange}
      />

      {/* 3D Exploded View Component Inspector */}
      <ExplodedInspector
        config={config}
        onConfigChange={handleConfigChange}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={setSelectedHotspot}
      />

      {/* Studio 3D Customizer Configurator */}
      <CustomizerStudio
        config={config}
        onConfigChange={handleConfigChange}
        onOpenReservation={() => handleOpenReservation(selectedPlan)}
        onOpenAR={handleOpenAR}
        onOpenTour={handleOpenTour}
      />

      {/* Empirical Benchmarks vs Legacy Systems */}
      <InteractiveBenchmarks />

      {/* Full Technical Specifications Sheet */}
      <TechSpecsSheet />

      {/* Batch 01 Pre-Order Pricing Tiers */}
      <PricingTiers
        config={config}
        onSelectPlan={(plan) => handleOpenReservation(plan)}
      />

      {/* FAQ & Footer with Telemetry */}
      <Footer />

      {/* Pre-order Reservation Modal with Confetti */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        plan={selectedPlan}
        config={config}
      />

      {/* AR / WebXR Room Viewer Modal */}
      <ARRoomViewer
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        config={config}
        onConfigChange={handleConfigChange}
        onOpenReservation={() => {
          setIsAROpen(false);
          handleOpenReservation(selectedPlan);
        }}
      />

      {/* Interactive Onboarding Tour Modal */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onOpenAR={handleOpenAR}
        onScrollToCustomizer={handleScrollToCustomizer}
      />

    </div>
  );
}
