import React from 'react';
import { ScreenProps } from './types';
import { Sparkles } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export function RewardUnlockedScreen({ navigateTo, userData }: ScreenProps) {
  return (
    <div className="h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Sparkle effects */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Character celebrating with reward */}
        <div className="mb-4 float-gentle">
          <UserAvatar
            characterId={userData.selectedCharacter}
            size="large"
            showBackground={true}
            className="mx-auto"
          />
        </div>

        <h2 className="text-white/80 text-lg mb-4 font-medium">
          Reward Unlocked!
        </h2>

        {/* Reward card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6 transform hover:scale-105 transition-all">
          <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-7xl">
            👑
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Golden Crown
          </h3>
          <p className="text-gray-600 text-sm">
            Exclusive reward for completing your first chapter!
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={() => navigateTo('rewards')}
          className="w-full h-14 bg-white text-purple-600 rounded-2xl font-bold mb-3 shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          View My Rewards
        </button>

        <button
          onClick={() => navigateTo('dashboard')}
          className="text-white/90 text-sm font-medium"
        >
          Continue Adventure
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      ` }} />
    </div>
  );
}