'use client'; // Make this a Client Component

import dynamic from 'next/dynamic';

// Dynamically import PhaserGame component with SSR turned off
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading Game...</p> // Optional loading component
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">Shoppy Bird v2</h1>
      <div
        id="game-container"
        className="w-full max-w-[800px] aspect-[4/3] border border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto"
      >
        <PhaserGame />
      </div>
      <p className="mt-4 sm:mt-8 text-xs sm:text-sm text-gray-600">
        Game powered by Phaser 3 and Next.js
      </p>
    </main>
  );
}
