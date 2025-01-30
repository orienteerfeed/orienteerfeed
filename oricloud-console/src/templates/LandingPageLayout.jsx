import React from 'react';

export const LandingPageLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white relative">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="font-bold text-2xl tracking-tight">ORIENTEERFEED</div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-700 dark:border-gray-300 rounded-full">
            Become a Developer
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-full">
            Launch
          </button>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Real-Time Orienteering Data.
          </h1>
          <p className="text-2xl text-red-600 mt-4">
            Track, analyze, and share event insights from anywhere.
          </p>
        </section>

        {/* Image positioned at the bottom */}
        <div className="w-full max-h-[80vh] flex gap-4 overflow-hidden">
          <img
            src="/images/illustration/2025_orienteerfeed_v03_forest_background.svg"
            alt="Forest"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_arena.svg"
            alt="Arena"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_finish.svg"
            alt="Finish"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_entries.svg"
            alt="Entries"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_radio.svg"
            alt="Radio"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_start.svg"
            alt="Start"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_it_centrum.svg"
            alt="IT Centrum"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_results.svg"
            alt="Results"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover transition-all duration-300 ease-in-out hover:scale-110"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_bottom_frame.svg"
            alt="Trees"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover"
          />
        </div>

        {/* Topography Map */}

        {/* Markers */}
        {[
          { id: '008', x: '20%', y: '30%' },
          { id: '042', x: '40%', y: '60%' },
          { id: '063', x: '70%', y: '20%' },
        ].map((marker) => (
          <div
            key={marker.id}
            className="absolute flex flex-col items-center"
            style={{ left: marker.x, top: marker.y }}
          >
            <div className="h-32 border-l-2 border-orange-500"></div>
            <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {marker.id}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
