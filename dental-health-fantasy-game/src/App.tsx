import { useState } from 'react';
import { GameEngine } from './components/games';

function App() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const chapters = [
    { id: 1, title: 'Enamel Castle Siege', description: 'Defend your castle from plaque monsters!', emoji: '🏰', color: 'from-purple-500 to-indigo-600' },
    { id: 2, title: 'Sugar Bug Invasion', description: 'Tap the bacteria before they reach your tooth!', emoji: '🦠', color: 'from-pink-500 to-purple-600' },
    { id: 3, title: 'Royal Rope Rescue', description: 'Guide the floss through the gaps!', emoji: '🧵', color: 'from-cyan-500 to-blue-600' },
    { id: 4, title: 'The King\'s Banquet', description: 'Sort healthy and sugary foods!', emoji: '👑', color: 'from-amber-500 to-orange-600' },
    { id: 5, title: 'Wise Knight\'s Trial', description: 'Test your dental knowledge!', emoji: '⚔️', color: 'from-indigo-500 to-purple-600' },
  ];

  const handleComplete = (score: number, stars: number) => {
    console.log(`Game completed! Score: ${score}, Stars: ${stars}`);
    if (selectedChapter && !completedChapters.includes(selectedChapter)) {
      setCompletedChapters([...completedChapters, selectedChapter]);
    }
    setSelectedChapter(null);
  };

  // If a chapter is selected, show the game
  if (selectedChapter) {
    return (
      <div className="w-full h-screen bg-gray-900">
        <GameEngine
          chapterId={selectedChapter}
          onExit={() => setSelectedChapter(null)}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Chapter selection screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            🦷 Tooth Kingdom
          </h1>
          <p className="text-purple-300">Choose your adventure!</p>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const isLocked = index > 0 && !completedChapters.includes(chapters[index - 1].id);
            const isCompleted = completedChapters.includes(chapter.id);

            return (
              <button
                key={chapter.id}
                onClick={() => !isLocked && setSelectedChapter(chapter.id)}
                disabled={isLocked}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  isLocked 
                    ? 'bg-gray-800/50 opacity-50 cursor-not-allowed' 
                    : `bg-gradient-to-r ${chapter.color} hover:scale-[1.02] active:scale-[0.98]`
                } shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{chapter.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{chapter.title}</h3>
                      {isCompleted && <span className="text-yellow-300">⭐</span>}
                      {isLocked && <span className="text-white/60">🔒</span>}
                    </div>
                    <p className="text-white/70 text-sm">{chapter.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            Progress: {completedChapters.length}/{chapters.length} chapters
          </p>
          <div className="mt-2 h-2 bg-purple-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
              style={{ width: `${(completedChapters.length / chapters.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
