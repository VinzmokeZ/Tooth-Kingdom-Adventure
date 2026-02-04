export interface UserData {
  selectedCharacter: number | null;
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  completedChapters: number;
  totalStars: number;
  level: number;
  achievements: { id: number; unlockedAt: string }[];
  unlockedRewards: number[];
  brushingLogs: { [date: string]: { morning: boolean; evening: boolean } };
  lastBrushedTimestamp: string | null;
}

export interface ScreenProps {
  navigateTo: (screen: string) => void;
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}
