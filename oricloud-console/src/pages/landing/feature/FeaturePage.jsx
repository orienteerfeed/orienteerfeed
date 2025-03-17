import React from 'react';
import { LandingPageLayout } from '../../../templates';

export const FeaturePage = ({ t }) => {
  return (
    <LandingPageLayout>
      <div className="container mx-auto">
        <section
          id="start"
          className="min-h-screen mt-12 flex flex-col items-center text-center p-8"
        >
          <img
            src="images/o-checklist-logo.jpeg"
            alt="O-CheckList Logo"
            className="w-32 h-32 mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Start
          </h1>
          <p className="text-lg max-w-2xl mt-4 text-gray-600">
            Our application is fully compatible with the{' '}
            <span className="font-semibold">O-CheckList</span> Android app.
            O-CheckList is designed to streamline the start process by fetching
            competitors directly from{' '}
            <span className="font-semibold">OrienteerFeed</span>
            and supporting real-time updates. You can instantly check if a
            competitor is present and apply last-minute changes, such as
            updating their card number, directly into the entries.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=se.tg3.startlist"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Download O-CheckList
          </a>
        </section>
        <section id="results" className="min-h-screen">
          Results
        </section>
      </div>
    </LandingPageLayout>
  );
};
