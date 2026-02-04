import React from 'react';
import { SignInScreen } from './screens/SignInScreen';
import { OTPVerificationScreen } from './screens/OTPVerificationScreen';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { CharacterSelectScreen } from './screens/CharacterSelectScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ChaptersScreen } from './screens/ChaptersScreen';
import { BrushingLessonScreen } from './screens/BrushingLessonScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { StreakScreen } from './screens/StreakScreen';
import { LessonCompleteScreen } from './screens/LessonCompleteScreen';
import { RewardUnlockedScreen } from './screens/RewardUnlockedScreen';
import { LearningResourcesScreen } from './screens/LearningResourcesScreen';
import { LearningAcademyScreen } from './screens/LearningAcademyScreen';

import { UserData } from './screens/types';

interface AppScreensProps {
  currentScreen: string;
  navigateTo: (screen: string) => void;
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

export function AppScreens({ currentScreen, navigateTo, userData, updateUserData }: AppScreensProps) {
  const screenProps = { navigateTo, userData, updateUserData };

  switch (currentScreen) {
    case 'signin':
      return <SignInScreen {...screenProps} />;
    case 'otp-verification':
      return <OTPVerificationScreen {...screenProps} />;
    case 'splash':
      return <SplashScreen {...screenProps} />;
    case 'onboarding':
      return <OnboardingScreen {...screenProps} />;
    case 'character-select':
      return <CharacterSelectScreen {...screenProps} />;
    case 'dashboard':
      return <DashboardScreen {...screenProps} />;
    case 'chapters':
      return <ChaptersScreen {...screenProps} />;
    case 'brushing-lesson':
      return <BrushingLessonScreen {...screenProps} />;
    case 'lesson-complete':
      return <LessonCompleteScreen {...screenProps} />;
    case 'reward-unlocked':
      return <RewardUnlockedScreen {...screenProps} />;
    case 'rewards':
      return <RewardsScreen {...screenProps} />;
    case 'progress':
      return <ProgressScreen {...screenProps} />;
    case 'calendar':
      return <CalendarScreen {...screenProps} />;
    case 'settings':
      return <SettingsScreen {...screenProps} />;
    case 'profile':
      return <ProfileScreen {...screenProps} />;
    case 'achievements':
      return <AchievementsScreen {...screenProps} />;
    case 'stats':
      return <StatsScreen {...screenProps} />;
    case 'notifications':
      return <NotificationsScreen {...screenProps} />;
    case 'streak':
      return <StreakScreen {...screenProps} />;
    case 'learning-resources':
      return <LearningResourcesScreen {...screenProps} />;
    case 'learning-academy':
      return <LearningAcademyScreen {...screenProps} />;
    default:
      return <SplashScreen {...screenProps} />;
  }
}