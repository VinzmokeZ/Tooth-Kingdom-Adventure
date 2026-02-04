import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

// Types from original App.tsx
import { UserData } from '../components/screens/types';

interface GameContextType {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  resetProgress: () => void;
}

const defaultUserData: UserData = {
  selectedCharacter: null,
  currentStreak: 0,
  bestStreak: 0,
  totalDays: 0,
  completedChapters: 0,
  totalStars: 0,
  level: 1,
  achievements: [],
  unlockedRewards: [],
  brushingLogs: {},
  lastBrushedTimestamp: null,
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
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  // Firestore Sync Effect
  useEffect(() => {
    if (!currentUser) {
      // Fallback to local storage if not logged in
      const savedData = localStorage.getItem('toothKingdomUserData');
      if (savedData) setUserData(JSON.parse(savedData));
      return;
    }

    // Subscribe to user document in Firestore
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        // Initialize new user in Firestore
        setDoc(userDocRef, defaultUserData);
      }
    });

    return unsubscribe;
  }, [currentUser]);

  // Save to cloud or local storage
  const updateUserData = async (updates: Partial<UserData>) => {
    const newData = { ...userData, ...updates };
    setUserData(newData);

    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, newData, { merge: true });
    } else {
      localStorage.setItem('toothKingdomUserData', JSON.stringify(newData));
    }
  };

  const resetProgress = () => {
    updateUserData(defaultUserData);
  };

  return (
    <GameContext.Provider value={{ userData, updateUserData, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
};
