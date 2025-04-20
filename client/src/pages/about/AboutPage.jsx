import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FloatingBadge } from '../../organisms';
import { EventPageLayout } from '../../templates';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <EventPageLayout t={t} pageName={t('About OrienteerFeed')}>
      <div className="grid items-start gap-8">
        <FloatingBadge title="About OrienteerFeed" />

        {/* Section 1 - Introduction */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('What is OrienteerFeed?')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            OrienteerFeed is the <strong> ultimate digital compass</strong> for
            orienteering enthusiasts. Whether you're a{' '}
            <strong>
              organizer, competitor, coach, or someone who just got lost in the
              forest
            </strong>{' '}
            (we don’t judge), OrienteerFeed is here to track & manage your
            competitions, analyze your mistakes, and give you an excuse for why
            your <strong>friend finished 2 minutes ahead of you</strong>.
          </p>
        </section>

        {/* Section 2 - Key Features */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('Key Features')}
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              📊 <strong>Real-Time Competition Control</strong> – Because who
              doesn’t love managing chaos in real time? Stay on top of every
              unknown SI card, split, update, and surprise drama.
            </li>
            <li>
              🏁 <strong>Live Results</strong> – No more "Did I win?" questions.
              Athletes can see their rankings instantly (and blame yourself, not
              you).
            </li>
            <li>
              📺 <strong>Big Screen Results Board</strong> – Keep the crowd
              engaged with flashy, live-updating results.
            </li>
            <li>
              ⏳ <strong>Last-Minute Entries</strong> – Because some people love
              the thrill of signing up 30 seconds before the starting signal.
              You’ve got it covered!
            </li>
            <li>
              📈 <strong>Rankoholics Welcome</strong> – We’ve got{' '}
              <strong>real-time ranking updates on the fly</strong>, so you
              always know where you stand—whether you’re crushing it or just
              trying not to be last.
            </li>
          </ul>
        </section>

        {/* Section 3 - How It Works */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('How It Works?')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>OrienteerFeed</strong> is like your
            <strong>digital event HQ</strong> for orienteering. It keeps track
            of everything –{' '}
            <strong>
              events, classes, competitors, results, and even last-minute drama{' '}
            </strong>
            – in real time. Here’s how the magic happens:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              🏃‍♂️ <strong>You organize, we sync</strong> – Live data is instantly
              synchronized with our cloud service, giving you access to all
              information from anywhere, whether through our app or via the
              REST/GraphQL API.
            </li>
            <li>
              📡 <strong>Smart APIs, No Tech Headaches</strong> – Whether you
              like clicking buttons or sending fancy GraphQL queries, the data
              is right at your fingertips.
            </li>
            <li>
              🔐 <strong>Secure Access</strong> – Only the chosen ones (aka
              logged-in users) can edit event details. No unauthorized tampering
              with your glorious race results!
            </li>
            <li>
              📜 <strong>We Speak IOF</strong> – We use{' '}
              <strong>established IOF-XML standards</strong>, so importing and
              exporting event data works seamlessly with other orienteering
              systems. No weird formats, just smooth interoperability.
            </li>
          </ul>
        </section>

        {/* Section 4 - Integrations */}
        <section className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-6 dark:bg-zinc-700 dark:text-white">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('Supported Integrations')}
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              🗺️ <strong>ORIS</strong> – Single Sign-On (SSO) integration allows
              seamless authentication using{' '}
              <Link
                to="https://oris.orientacnisporty.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                ORIS
              </Link>{' '}
              accounts, making login and event management easier for organizers
              and competitors.
            </li>
            <li>
              🔗 <strong>O-Checklist</strong> – Integrated with{' '}
              <Link
                to="https://play.google.com/store/apps/details?id=se.tg3.startlist&hl=cs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                O-Checklist
              </Link>
              , an app that simplifies pre-start checks for event organizers.
            </li>
            <li>
              🎯 <strong>QuickEvent</strong> – Direct connection with
              <Link
                to="https://github.com/Quick-Box/quickevent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {' '}
                QuickEvent
              </Link>
              , an open-source tool for organizing orienteering events, enabling
              real-time synchronization of start lists, results, and event data.
            </li>
          </ul>
        </section>
      </div>
    </EventPageLayout>
  );
};
