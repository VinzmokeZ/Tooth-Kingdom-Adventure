// Shared types for all games
export interface GameProps {
  onComplete: (score: number, stars: number) => void;
  onExit?: () => void;
}

export type GameScreen = 'start' | 'gameplay' | 'victory';

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: 'plaque' | 'candy' | 'bacteria';
  health: number;
  maxHealth: number;
}

export interface HeroState {
  x: number;
  y: number;
  direction: 'left' | 'right';
  isAttacking: boolean;
  health: number;
  maxHealth: number;
}

export interface FoodItem {
  id: string;
  x: number;
  type: 'healthy' | 'sugary';
  name: string;
  emoji: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
