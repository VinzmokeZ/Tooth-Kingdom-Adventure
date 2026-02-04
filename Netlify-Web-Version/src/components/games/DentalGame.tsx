// 🦷 DentalGame - Drop-in wrapper for your chapter system
// 
// Usage in your existing app:
//
// import { DentalGame } from '@/components/games/DentalGame';
//
// <DentalGame 
//   gameId="brushing" 
//   onComplete={(score, stars) => handleChapterComplete(score, stars)}
//   onBack={() => navigate('/chapters')}
// />

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EnamelCastleSiege } from './EnamelCastleSiege';
import { SugarBugInvasion } from './SugarBugInvasion';
import { RoyalRopeRescue } from './RoyalRopeRescue';
import { KingsBanquet } from './KingsBanquet';
import { WiseKnightsTrial } from './WiseKnightsTrial';
import type { GameId } from './index';

interface DentalGameProps {
  /** Which game to play: 'brushing' | 'bacteria' | 'flossing' | 'nutrition' | 'mastery' */
  gameId: GameId;
  
  /** Called when game finishes with score and stars (0-3) */
  onComplete: (score: number, stars: number) => void;
  
  /** Optional: Called when back button is pressed */
  onBack?: () => void;
  
  /** Optional: Show/hide back button (default: true) */
  showBackButton?: boolean;
  
  /** Optional: Custom back button text */
  backButtonText?: string;
}

const GAMES = {
  brushing: EnamelCastleSiege,
  bacteria: SugarBugInvasion,
  flossing: RoyalRopeRescue,
  nutrition: KingsBanquet,
  mastery: WiseKnightsTrial,
};

export function DentalGame({ 
  gameId, 
  onComplete, 
  onBack,
  showBackButton = true,
  backButtonText = 'Back to Chapters'
}: DentalGameProps) {
  const GameComponent = GAMES[gameId];
  
  if (!GameComponent) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-xl">Game not found: {gameId}</p>
        <p className="text-gray-600 mt-2">
          Available games: {Object.keys(GAMES).join(', ')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 20 + Math.random() * 50,
              height: 20 + Math.random() * 50,
              background: ['#FF6B9D', '#FFE66D', '#4ECDC4', '#95E1D3', '#F38181'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Back Button */}
        {showBackButton && onBack && (
          <motion.button
            onClick={onBack}
            className="mb-4 px-6 py-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-purple-600 font-bold flex items-center gap-2 shadow-lg border-4 border-purple-300"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {backButtonText}
          </motion.button>
        )}
        
        {/* Game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GameComponent onComplete={onComplete} />
        </motion.div>
      </div>
    </div>
  );
}

// Also export a minimal version without background for embedding
export function DentalGameEmbed({ 
  gameId, 
  onComplete 
}: { 
  gameId: GameId; 
  onComplete: (score: number, stars: number) => void;
}) {
  const GameComponent = GAMES[gameId];
  
  if (!GameComponent) {
    return <div>Game not found: {gameId}</div>;
  }

  return <GameComponent onComplete={onComplete} />;
}
