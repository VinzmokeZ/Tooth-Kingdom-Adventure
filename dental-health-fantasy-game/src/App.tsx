import { useState } from 'react';
import { GameEngine } from './components/games';

// This simulates your PhoneFrame component
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative bg-black rounded-[3.5rem] p-3.5 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black h-7 w-40 rounded-b-3xl z-20 flex items-end justify-center pb-1">
          <div className="w-14 h-1 bg-gray-900 rounded-full"></div>
        </div>
        
        {/* Screen - 375x812 fixed size */}
        <div className="relative bg-white rounded-[3rem] overflow-hidden w-[375px] h-[812px]">
          {children}
        </div>

        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-black rounded-l"></div>
        <div className="absolute -left-1 top-36 w-1 h-16 bg-black rounded-l"></div>
        <div className="absolute -right-1 top-32 w-1 h-16 bg-black rounded-r"></div>
      </div>
    </div>
  );
}

// This simulates your ChaptersScreen
function ChaptersScreen({ 
  onStartChapter 
}: { 
  onStartChapter: (id: number) => void 
}) {
  const chapters = [
    { id: 1, title: 'Enamel Castle Siege', description: 'Defend your castle from plaque monsters!', emoji: '🏰', color: 'from-purple-500 to-indigo-600', stars: 3 },
    { id: 2, title: 'Sugar Bug Invasion', description: 'Tap the bacteria before they reach your tooth!', emoji: '🦠', color: 'from-pink-500 to-purple-600', stars: 3 },
    { id: 3, title: 'Royal Rope Rescue', description: 'Guide the floss through the gaps!', emoji: '🧵', color: 'from-cyan-500 to-blue-600', stars: 3 },
    { id: 4, title: 'The King\'s Banquet', description: 'Sort healthy and sugary foods!', emoji: '👑', color: 'from-amber-500 to-orange-600', stars: 3 },
    { id: 5, title: 'Wise Knight\'s Trial', description: 'Test your dental knowledge!', emoji: '⚔️', color: 'from-indigo-500 to-purple-600', stars: 3 },
  ];

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-5 pt-12 pb-6">
        <h1 className="text-2xl font-extrabold text-white">🦷 Tooth Kingdom</h1>
        <p className="text-purple-200 text-sm mt-1">Choose your adventure!</p>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onStartChapter(chapter.id)}
            className={`w-full p-4 rounded-2xl bg-gradient-to-r ${chapter.color} shadow-lg active:scale-[0.98] transition-transform`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{chapter.emoji}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">
                    Chapter {chapter.id}
                  </span>
                  <span className="text-yellow-300 text-xs">⭐ {chapter.stars}</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-1">{chapter.title}</h3>
                <p className="text-white/70 text-xs mt-0.5">{chapter.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);

  const handleGameExit = () => {
    setActiveChapterId(null);
  };

  const handleGameComplete = (score: number, stars: number) => {
    console.log(`Game completed! Score: ${score}, Stars: ${stars}`);
    // Here you would update userData, save progress, etc.
    setActiveChapterId(null);
  };

  return (
    <PhoneFrame>
      {activeChapterId ? (
        // Game is active - show fullscreen game
        <div className="absolute inset-0 z-50 bg-white overflow-hidden">
          <GameEngine
            chapterId={activeChapterId}
            onExit={handleGameExit}
            onComplete={handleGameComplete}
          />
        </div>
      ) : (
        // Show chapter selection
        <ChaptersScreen onStartChapter={setActiveChapterId} />
      )}
    </PhoneFrame>
  );
}

export default App;
