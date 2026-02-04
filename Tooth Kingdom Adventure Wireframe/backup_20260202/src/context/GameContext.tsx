import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types from original App.tsx
export interface UserData {
  selectedCharacter: number | null;
  currentStreak: number;
  totalDays: number;
  completedChapters: number;
  totalStars: number;
  level: number;
  achievements: number[];
  unlockedRewards: number[];
}

interface GameContextType {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  resetProgress: () => void;
}

const defaultUserData: UserData = {
  selectedCharacter: null,
  currentStreak: 7,
  totalDays: 45,
  completedChapters: 2,
  totalStars: 127,
  level: 5,
  achievements: [1, 2, 3, 4],
  unlockedRewards: [1, 2, 3, 4, 5],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or default
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const savedData = localStorage.getItem('toothKingdomUserData');
      return savedData ? JSON.parse(savedData) : defaultUserData;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultUserData;
    }
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    try {
      localStorage.setItem('toothKingdomUserData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [userData]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const resetProgress = () => {
    setUserData(defaultUserData);
  };

  return (
    <GameContext.Provider value={{ userData, updateUserData, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
};
