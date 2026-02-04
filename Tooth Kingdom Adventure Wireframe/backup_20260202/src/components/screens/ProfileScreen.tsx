import React from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Edit2, Award, Calendar, TrendingUp, Star, Trophy, Flame, Share2 } from 'lucide-react';
import { UserAvatar, getCharacterName } from '../common/UserAvatar';

export function ProfileScreen({ navigateTo, userData }: ScreenProps) {
  return (
    <div className="h-full bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white px-5 pt-5 pb-8 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold drop-shadow-sm">My Profile</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition">
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        {/* Profile card */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-inner">
          <div className="flex flex-col items-center text-center mb-4">
            {/* Enhanced character avatar with glow effect */}
            <div className="relative mb-4 animate-float-gentle">
              <UserAvatar
                characterId={userData.selectedCharacter}
                size="xlarge"
                className="filter drop-shadow-xl"
                showBackground={false}
              />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-2xl opacity-40 animate-pulse -z-10"></div>
            </div>
            <h2 className="text-2xl font-extrabold mb-1 drop-shadow-md">
              {getCharacterName(userData.selectedCharacter)} the Champion 🏆
            </h2>
            <p className="text-white/90 text-sm font-medium tracking-wide drop-shadow-sm">Joined January 2026</p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500/80 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-white/20">
                {userData.level}
              </div>
              <span className="text-sm font-bold text-white drop-shadow-sm">Level {userData.level}</span>
            </div>
            <div className="w-px h-6 bg-white/40"></div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              <span className="font-bold text-white drop-shadow-sm">{userData.totalStars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, value: userData.totalStars, label: 'Total Stars', color: 'from-amber-400 to-orange-500' },
            { icon: Flame, value: userData.currentStreak, label: 'Day Streak', color: 'from-orange-400 to-pink-500' },
            { icon: Calendar, value: userData.totalDays, label: 'Total Days', color: 'from-blue-400 to-cyan-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-50">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mb-2 flex items-center justify-center mx-auto shadow-md ring-2 ring-white`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-semibold text-gray-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <button
            onClick={() => navigateTo('achievements')}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 mb-1">Achievements</h3>
              <p className="text-sm font-medium text-gray-500">{userData.achievements.length} unlocked badges</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-600">
              {userData.achievements.length}
            </div>
          </button>

          <button
            onClick={() => navigateTo('stats')}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 mb-1">Statistics</h3>
              <p className="text-sm font-medium text-gray-500">View your progress & insights</p>
            </div>
          </button>

          <button
            onClick={() => navigateTo('calendar')}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900 mb-1">Activity Calendar</h3>
              <p className="text-sm font-medium text-gray-500">Track your daily progress</p>
            </div>
          </button>
        </div>

        {/* Recent achievements showcase */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Achievements</h3>
            <button
              onClick={() => navigateTo('achievements')}
              className="text-purple-600 text-sm font-bold hover:underline"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { emoji: '🏆', name: 'Master', color: 'from-amber-400 to-orange-500' },
              { emoji: '🔥', name: 'Week', color: 'from-orange-400 to-pink-500' },
              { emoji: '⭐', name: 'First', color: 'from-purple-400 to-purple-600' },
              { emoji: '🎯', name: 'Goal', color: 'from-blue-400 to-cyan-500' },
            ].map((achievement, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <div className={`w-full aspect-square bg-gradient-to-br ${achievement.color} rounded-2xl mb-2 flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition-transform`}>
                  {achievement.emoji}
                </div>
                <p className="text-xs text-gray-700 font-bold truncate">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress summary */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          {/* Decorative bg shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-5"></div>

          <h3 className="font-bold mb-4 relative z-10 drop-shadow-md">Progress Summary</h3>
          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium opacity-90">Chapters Completed</span>
                <span className="font-bold">{userData.completedChapters}/5</span>
              </div>
              <div className="h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${(userData.completedChapters / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium opacity-90">Rewards Unlocked</span>
                <span className="font-bold">{userData.unlockedRewards.length}/10</span>
              </div>
              <div className="h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  style={{ width: `${(userData.unlockedRewards.length / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Share profile */}
        <button className="w-full h-14 bg-white border-2 border-purple-600 text-purple-600 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4 hover:bg-purple-50">
          <Share2 className="w-5 h-5" />
          Share My Progress
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
      ` }} />
    </div>
  );
}