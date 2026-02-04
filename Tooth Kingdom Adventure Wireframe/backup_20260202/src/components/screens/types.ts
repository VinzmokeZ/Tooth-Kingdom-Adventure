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

export interface ScreenProps {
  navigateTo: (screen: string) => void;
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}
