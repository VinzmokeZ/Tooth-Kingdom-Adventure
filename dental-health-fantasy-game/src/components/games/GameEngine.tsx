import { EnamelCastleSiege } from './EnamelCastleSiege';
import { SugarBugInvasion } from './SugarBugInvasion';
import { RoyalRopeRescue } from './RoyalRopeRescue';
import { KingsBanquet } from './KingsBanquet';
import { WiseKnightsTrial } from './WiseKnightsTrial';

interface GameEngineProps {
  chapterId: number;
  onExit: () => void;
  onComplete: (score: number, stars: number) => void;
}

// Map chapter IDs to games
// Chapter 1: Brushing - Enamel Castle Siege
// Chapter 2: Bacteria - Sugar Bug Invasion
// Chapter 3: Flossing - Royal Rope Rescue
// Chapter 4: Nutrition - King's Banquet
// Chapter 5: Mastery - Wise Knight's Trial

export function GameEngine({ chapterId, onExit, onComplete }: GameEngineProps) {
  // Render the appropriate game based on chapter ID
  switch (chapterId) {
    case 1:
      return (
        <div className="w-full h-full">
          <EnamelCastleSiege 
            onComplete={onComplete} 
            onExit={onExit}
          />
        </div>
      );
    
    case 2:
      return (
        <div className="w-full h-full">
          <SugarBugInvasion 
            onComplete={onComplete} 
            onExit={onExit}
          />
        </div>
      );
    
    case 3:
      return (
        <div className="w-full h-full">
          <RoyalRopeRescue 
            onComplete={onComplete} 
            onExit={onExit}
          />
        </div>
      );
    
    case 4:
      return (
        <div className="w-full h-full">
          <KingsBanquet 
            onComplete={onComplete} 
            onExit={onExit}
          />
        </div>
      );
    
    case 5:
      return (
        <div className="w-full h-full">
          <WiseKnightsTrial 
            onComplete={onComplete} 
            onExit={onExit}
          />
        </div>
      );
    
    default:
      // Fallback for unknown chapters
      return (
        <div className="w-full h-full bg-gradient-to-b from-purple-600 to-indigo-800 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon!</h2>
          <p className="text-white/70 text-center mb-6">
            This adventure is still being prepared...
          </p>
          <button
            onClick={onExit}
            className="bg-white/20 text-white font-bold py-3 px-8 rounded-full"
          >
            Go Back
          </button>
        </div>
      );
  }
}
