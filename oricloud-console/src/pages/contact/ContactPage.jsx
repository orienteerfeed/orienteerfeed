import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FloatingBadge } from '../../organisms';
import { EventPageLayout } from '../../templates';

export const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <EventPageLayout t={t} pageName={t('Contact')}>
      <div className="grid items-start gap-8">
        <FloatingBadge title="Contact OrienteerFeed" />

        {/* Section 1 - Get in Touch */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('Get in Touch')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Got a question, feedback, or just want to chat about the latest
            route choice disasters? We’d love to hear from you! Whether you're
            an event organizer, competitor, or just looking for someone to blame
            for your latest mispunch, reach out!
          </p>
        </section>

        {/* Section 2 - Contact Methods */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('How to Reach Us')}
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              📧 <strong>Email:</strong>{' '}
              <a
                href="mailto:support@orienteerfeed.com"
                className="text-blue-500 underline"
              >
                support@orienteerfeed.com
              </a>{' '}
              – Our inbox is open 24/7 (response time: somewhere between instant
              and "oops, we forgot to check").
            </li>
            <li>
              🎙️ <strong>Join Our Community:</strong> Connect with fellow
              orienteering enthusiasts, ask questions, and share experiences on
              our{' '}
              <Link
                href="https://discord.gg/bXHnBcNWNc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                OrienteerFeed Discord Server
              </Link>
              .
            </li>
            <li>
              🏢 <strong>Headquarters:</strong> If you prefer in-person
              discussions, drop by our (mostly imaginary) office:
              <br />{' '}
              <div className="ml-12">
                OrienteerFeed HQ
                <br />
                Somewhere in the Forest 🌲
                <br /> Earth 🌍
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 - Support & FAQs */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('Need Help?')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Stuck with an issue? Check out our{' '}
            <Link
              to="https://obpraha.cz/orienteer-feed-docs"
              className="text-blue-500 underline"
            >
              Documentation
            </Link>{' '}
            for quick answers. If you still need assistance, our support team is
            happy to help!
          </p>
        </section>

        {/* Section 4 - Bug Reports */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('Found a Bug?')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Spotted a bug? Report it on our{' '}
            <Link
              to="https://github.com/martinkrivda/orienteerfeed/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              GitHub Issue Tracker
            </Link>{' '}
            so we can squash it faster than you reach the next control point.
          </p>
          {/*           <Map
            apiKey="tPVxGxmTRbdoc4vDVIIvTTIMRmVjdJgcwv9U_Hqhekk"
            center={{ lat: 50.0755, lng: 14.4378 }}
          /> */}
        </section>
      </div>
    </EventPageLayout>
  );
};
