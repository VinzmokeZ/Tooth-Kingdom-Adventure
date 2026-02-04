import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Lock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { chapters } from '../../data/chapters';
import { GameEngine } from '../games/GameEngine';
import { useGame } from '../../context/GameContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

export function ChaptersScreen({ navigateTo, userData }: ScreenProps) {
  const { updateUserData } = useGame();
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);

  const handleStartChapter = (chapterId: number) => {
    setActiveChapterId(chapterId);
  };

  const handleGameExit = () => {
    setActiveChapterId(null);
  };

  const handleGameComplete = (score: number, stars: number) => {
    // Determine stars earned based on score (simplified logic)
    // In a real app, this might be more complex
    const earnedStars = score >= 90 ? 3 : score >= 70 ? 2 : 1;

    // Update user data:
    // 1. Mark chapter as completed if not already (logic simplified here)
    // 2. Add stars
    // 3. Unlock next chapter

    const chapterIndex = chapters.findIndex(c => c.id === activeChapterId);
    const nextChapterId = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1].id : null;

    // This logic should ideally be in a helper or context action, but doing here for speed
    // Note: We are using a simplified update logic. 
    // In a real app we'd need to check if we already earned stars for this chapter to avoid duplicates

    updateUserData({
      totalStars: userData.totalStars + earnedStars,
      completedChapters: Math.max(userData.completedChapters, (activeChapterId || 0)),
      // Unlock logic would need to update the 'chapters' data structure which is currently static constant
      // For this demo, we rely on the userData.completedChapters to act as the gate in the UI below
    });

    // Also close the game
    setActiveChapterId(null);
    navigateTo('reward-unlocked'); // Or some success feedback
  };



  if (activeChapterId) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-hidden"> {/* Fullscreen overlay for mobile */}
        <ErrorBoundary onReset={handleGameExit}>
          <GameEngine
            chapterId={activeChapterId}
            onExit={handleGameExit}
            onComplete={handleGameComplete}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Chapters</h1>
        </div>

        {/* Progress summary */}
        <div
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white"
          style={{
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25), 0 2px 8px rgba(124, 58, 237, 0.15)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Overall Progress</span>
            <span className="text-sm font-bold">{userData.completedChapters}/{chapters.length} Complete</span>
          </div>
          <div className="progress-bar-child" style={{ height: '10px', background: 'rgba(255,255,255,0.2)' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${(userData.completedChapters / chapters.length) * 100}%`,
                background: 'white',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {chapters.map((chapter) => {
          // Dynamic lock status based on user progress (userData.completedChapters)
          // Rules: 
          // Chapter 1 is always unlocked.
          // Chapter N is unlocked if Chapter N-1 is complete (id <= completedChapters + 1)
          const isLocked = chapter.id > userData.completedChapters + 1;
          const isCompleted = chapter.id <= userData.completedChapters;

          return (
            <button
              key={chapter.id}
              onClick={() => !isLocked && handleStartChapter(chapter.id)}
              disabled={isLocked}
              className={`w-full lesson-card text-left ${isLocked ? 'opacity-60 cursor-not-allowed' : ''
                }`}
            >
              {/* Chapter Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">
                  Chapter {chapter.id}
                </span>
                {!isLocked && (
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{chapter.stars} stars</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-green-700">Completed</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
                {chapter.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {chapter.description}
              </p>

              {/* Illustration */}
              <div
                className={`w-full h-48 bg-gradient-to-br ${chapter.color} rounded-2xl mb-4 overflow-hidden relative`}
                style={{
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <img
                  src={chapter.illustration}
                  alt={chapter.title}
                  className="w-full h-full object-cover opacity-80"
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-semibold">Complete previous chapters</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {chapter.lessons} lessons
                </span>
                {!isLocked && (
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                    Start Adventure
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {/* Space for Custom Future Games */}
        <div className="pt-8 pb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Custom Adventures</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <button
                key={`custom-slot-${i}`}
                onClick={() => alert(`Custom Game Slot ${i}: This area is ready for your own custom game logic or external mini-game integration! 🎮✨`)}
                className="w-full aspect-[16/9] rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50 group hover:bg-gray-50 hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🎮</span>
                </div>
                <h4 className="text-gray-400 font-bold group-hover:text-purple-400">Future Game Slot {i}</h4>
                <p className="text-xs text-gray-400 mt-1">Ready for your own creation!</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}