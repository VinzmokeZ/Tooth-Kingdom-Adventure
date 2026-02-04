import React, { useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { AppScreens } from './components/AppScreens';
import { GameProvider, useGame } from './context/GameContext';
import { AuthProvider } from './context/AuthContext';

// Inner component to handle screen state, now that data is in Context
const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('signin');
  // userData and updateUserData are now available via useGame() inside child components
  // or we can pass them if we really want to keep props for now, 
  // but better to let AppScreens handle it or pass from here.

  // For compatibility with AppScreens signature:
  const { userData, updateUserData } = useGame();

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <AppScreens
      currentScreen={currentScreen}
      navigateTo={navigateTo}
      userData={userData}
      updateUserData={updateUserData}
    />
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-8">
      <AuthProvider>
        <GameProvider>
          <PhoneFrame>
            <AppContent />
          </PhoneFrame>
        </GameProvider>
      </AuthProvider>
    </div>
  );
}