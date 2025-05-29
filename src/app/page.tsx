'use client'; // Make this a Client Component

import dynamic from 'next/dynamic';

// Dynamically import PhaserGame component with SSR turned off
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading Shoppy Bird...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="w-full px-4 py-3 sm:py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            Shoppy Bird v2
          </h1>
          <p className="text-blue-200 text-sm sm:text-base">
            A modern take on the classic flappy bird game
          </p>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="flex-1 flex items-center justify-center px-2 sm:px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Game Container with responsive sizing */}
          <div
            id="game-container"
            className="
              w-full
              aspect-[4/3]
              max-w-[800px]
              mx-auto
              border-2 border-white/20
              rounded-xl
              overflow-hidden
              shadow-2xl
              bg-gray-900
              relative
            "
          >
            <PhaserGame />

            {/* Overlay for very small screens */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-center p-4 sm:hidden">
              <div className="hidden max-[400px]:block">
                <p className="text-sm mb-2">🔄 Rotate your device</p>
                <p className="text-xs text-gray-300">For the best experience, please use landscape mode</p>
              </div>
            </div>
          </div>

          {/* Mobile-specific controls hint */}
          <div className="mt-4 text-center sm:hidden">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-w-sm mx-auto">
              <p className="text-white text-sm">
                👆 <strong>Tap anywhere</strong> on the screen to make Shoppy jump!
              </p>
            </div>
          </div>

          {/* Desktop controls hint */}
          <div className="mt-4 text-center hidden sm:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-w-md mx-auto">
              <p className="text-white text-sm">
                🖱️ <strong>Click</strong> or press <strong>SPACE</strong> to jump • <strong>P</strong> to pause
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-300 text-xs sm:text-sm">
            Built with ❤️ using Phaser 3, Next.js & TypeScript
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-blue-400">
            <span>🎮 Game</span>
            <span>📱 Mobile Friendly</span>
            <span>🚀 Fast Loading</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
