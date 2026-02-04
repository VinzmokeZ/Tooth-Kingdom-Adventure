import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Award, Lock, Trophy, Flame, Star, Target } from 'lucide-react';

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: Star, unlocked: true, progress: 100, category: 'lessons', color: 'from-purple-400 to-purple-600' },
  { id: 2, title: '3-Day Streak', description: 'Brush for 3 days in a row', icon: Flame, unlocked: true, progress: 100, category: 'streak', color: 'from-orange-400 to-pink-500' },
  { id: 3, title: 'Chapter Master', description: 'Complete an entire chapter', icon: Trophy, unlocked: true, progress: 100, category: 'lessons', color: 'from-amber-400 to-orange-500' },
  { id: 4, title: 'Week Warrior', description: 'Brush for 7 days straight', icon: Flame, unlocked: true, progress: 100, category: 'streak', color: 'from-red-400 to-pink-500' },
  { id: 5, title: 'Star Collector', description: 'Earn 100 total stars', icon: Star, unlocked: false, progress: 75, category: 'special', color: 'from-blue-400 to-cyan-500' },
  { id: 6, title: 'Perfect Week', description: 'Complete all tasks for 7 days', icon: Target, unlocked: false, progress: 60, category: 'streak', color: 'from-green-400 to-emerald-500' },
  { id: 7, title: 'Master Brusher', description: 'Achieve perfect technique', icon: Trophy, unlocked: false, progress: 40, category: 'lessons', color: 'from-purple-400 to-pink-500' },
  { id: 8, title: 'Kingdom Defender', description: 'Complete all chapters', icon: Award, unlocked: false, progress: 20, category: 'special', color: 'from-indigo-400 to-purple-600' },
];

export function AchievementsScreen({ navigateTo, userData }: ScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'streak' | 'lessons' | 'special'>('all');

  const filteredAchievements = achievements.map(a => ({
    ...a,
    unlocked: userData.achievements.some(ua => ua.id === a.id)
  })).filter(a => activeFilter === 'all' || a.category === activeFilter);

  const unlockedCount = userData.achievements.length;

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white px-5 pt-5 pb-6 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigateTo('profile')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1">Achievements</h1>
        </div>

        {/* Progress summary */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6" />
            <div className="flex-1">
              <p className="text-sm opacity-90">Achievement Progress</p>
              <p className="font-bold">{unlockedCount}/{achievements.length} Unlocked</p>
            </div>
          </div>
          <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 z-10 overflow-x-auto">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'streak', label: 'Streak' },
            { key: 'lessons', label: 'Lessons' },
            { key: 'special', label: 'Special' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter.key
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <button
              key={achievement.id}
              onClick={() => alert(`${achievement.title}: ${achievement.description}${achievement.unlocked ? ' (UNLOCKED)' : ` (Progress: ${achievement.progress}%)`}`)}
              className={`w-full text-left bg-white rounded-3xl p-5 shadow-md transition-all ${achievement.unlocked ? 'hover:shadow-lg' : 'opacity-75'
                }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-gray-900/40 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                  {achievement.unlocked ? (
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Trophy className="w-3.5 h-3.5" />
                      Unlocked
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-bold text-purple-600">{achievement.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-500`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
