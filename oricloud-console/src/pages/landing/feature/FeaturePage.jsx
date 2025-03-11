import React from 'react';
import { LandingPageLayout } from '../../../templates';

export const FeaturePage = ({ t }) => {
  return (
    <LandingPageLayout>
      <div className="container mx-auto">
        <section id="start" className="min-h-screen mt-12">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Start
          </h1>
        </section>
        <section id="results" className="min-h-screen">
          Results
        </section>
      </div>
    </LandingPageLayout>
  );
};
