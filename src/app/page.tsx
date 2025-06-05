'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BrandLogos from '@/components/BrandLogos';
import WorkspaceSection from '@/components/WorkspaceSection';
import CollaborationSection from '@/components/CollaborationSection';
import StatsSection from '@/components/StatsSection';
import PricingSection from '@/components/PricingSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        <BrandLogos />
        <WorkspaceSection />
        <CollaborationSection />
        <StatsSection />
        <PricingSection />
      </div>
    </div>
  );
}
