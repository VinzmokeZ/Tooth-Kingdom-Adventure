// 🦷 Dental Kingdom Adventures - Game Exports
// Import these into your existing app's chapter system

// Individual Games
export { EnamelCastleSiege } from './EnamelCastleSiege';
export { SugarBugInvasion } from './SugarBugInvasion';
export { RoyalRopeRescue } from './RoyalRopeRescue';
export { KingsBanquet } from './KingsBanquet';
export { WiseKnightsTrial } from './WiseKnightsTrial';

// Shared Components
export { Hero } from './Hero';
export { StarRating } from './StarRating';
export { GameEngine } from './GameEngine';

// Easy Integration Wrapper
export { DentalGame, DentalGameEmbed } from './DentalGame';

// Types
export type { GameProps, GameScreen, Enemy, HeroState, FoodItem, TriviaQuestion } from './types';

// Game Registry - use this to dynamically load games
export const GAME_REGISTRY = {
  brushing: {
    id: 'brushing',
    title: 'Enamel Castle Siege',
    subtitle: 'Brush away plaque monsters!',
    icon: '🏰',
    component: 'EnamelCastleSiege',
  },
  bacteria: {
    id: 'bacteria',
    title: 'Sugar Bug Invasion',
    subtitle: 'Zap the bacteria bugs!',
    icon: '🦠',
    component: 'SugarBugInvasion',
  },
  flossing: {
    id: 'flossing',
    title: 'Royal Rope Rescue',
    subtitle: 'Navigate the floss through teeth!',
    icon: '🧵',
    component: 'RoyalRopeRescue',
  },
  nutrition: {
    id: 'nutrition',
    title: "The King's Banquet",
    subtitle: 'Sort healthy vs sugary foods!',
    icon: '👑',
    component: 'KingsBanquet',
  },
  mastery: {
    id: 'mastery',
    title: "Wise Knight's Trial",
    subtitle: 'Test your dental wisdom!',
    icon: '🧠',
    component: 'WiseKnightsTrial',
  },
} as const;

export type GameId = keyof typeof GAME_REGISTRY;
