import React, { useState, useEffect } from 'react';
import { ScreenProps } from './types';
import { Calendar, Trophy, BookOpen, TrendingUp, Flame, Zap, Award, Star, ChevronRight, Bell, Sparkles as SparklesIcon, Bot, Brain, Target, Menu, Gift, Home, Check, X } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import logo from '../../assets/5b0695099dfd67c35f14fc4f047da4df5ed6aa0e.png';

const AI_TIPS = [
  "Brushing your tongue helps remove bacteria that causes bad breath. Don't skip it! 👅✨",
  "Try to brush for exactly 2 minutes. Our AI noticed you're usually around 1:45. Almost there! ⏱️",
  "Drink water after eating sugary snacks to help rinse away acids. Smart choice! 💧",
  "Flossing once a day removes plaque where your brush can't reach. Every little bit counts! 🧵",
  "A pea-sized amount of toothpaste is all you need for a hero-sized clean! 🧼",
  "Our AI predicts you'll reach Level 5 by Friday if you maintain your evening streak! 📈",
];

export function DashboardScreen({ navigateTo, userData }: ScreenProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTypingTip, setIsTypingTip] = useState(false);
  const [displayedTip, setDisplayedTip] = useState(AI_TIPS[0]);

  const handleGetMoreTips = () => {
    setIsTypingTip(true);
    const nextIndex = (currentTipIndex + 1) % AI_TIPS.length;
    setCurrentTipIndex(nextIndex);

    // Simulate typing effect
    setTimeout(() => {
      setDisplayedTip(AI_TIPS[nextIndex]);
      setIsTypingTip(false);
    }, 1000);
  };
  return (
    <div className="h-full bg-gradient-to-b from-purple-50 to-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div
        className="sticky top-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white px-5 pt-5 pb-6 z-10"
        style={{
          boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25)',
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => navigateTo('settings')}
            className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-extrabold text-xl">Dashboard</h1>
          <button
            onClick={() => navigateTo('notifications')}
            className="relative p-2 -mr-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <Bell className="w-6 h-6" />
            <div
              className="absolute top-1 right-1 w-5 h-5 bg-pink-500 rounded-full text-xs flex items-center justify-center font-bold text-white"
              style={{
                boxShadow: '0 2px 6px rgba(236, 72, 153, 0.5)',
              }}
            >3</div>
          </button>
        </div>

        {/* User profile card */}
        <div
          className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30"
          style={{
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <UserAvatar
                characterId={userData.selectedCharacter}
                showBackground={false}
                className="w-14 h-14 bg-purple-50 rounded-full ring-4 ring-white/40"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">Hey, Champion! 👋</h2>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold"
                >
                  Level {userData.level}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="font-bold text-sm">{userData.totalStars}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('profile')}
              className="bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all"
              style={{
                boxShadow: '0 4px 12px rgba(255,255,255,0.3)',
              }}
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 space-y-5">
        {/* Streak card */}
        <div
          className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-5 text-white"
          style={{
            boxShadow: '0 8px 28px rgba(236, 72, 153, 0.3)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-6 h-6 fill-white" />
                <h3 className="font-bold text-lg">Current Streak</h3>
              </div>
              <p className="text-white/80 text-sm">Keep it going!</p>
            </div>
            <button
              onClick={() => navigateTo('streak')}
              className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium"
            >
              Details
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
              <span className="text-3xl font-bold">{userData.currentStreak}</span>
            </div>
            <div className="flex-1">
              <div className="text-sm mb-2">
                <span className="font-bold text-2xl">{userData.currentStreak}</span> days in a row!
              </div>
              <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(userData.currentStreak / 14) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/80 mt-1">Next milestone: 14 days</p>
            </div>
          </div>
        </div>

        {/* AI Personalized Tip */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1">
          <div className="bg-white rounded-[22px] p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-extrabold text-gray-900">AI Daily Tip</h3>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                </div>
                <div className="min-h-[60px]">
                  {isTypingTip ? (
                    <div className="flex gap-1 py-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed animate-fadeIn">
                      {displayedTip}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleGetMoreTips}
              disabled={isTypingTip}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm disabled:opacity-50"
            >
              {isTypingTip ? '🤖 Generating...' : '🤖 Get More AI Tips'}
            </button>
          </div>
        </div>

        {/* Learning Resources Banner */}
        <button
          onClick={() => navigateTo('learning-resources')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-extrabold text-lg">Learning Resources</h3>
                <SparklesIcon className="w-5 h-5" />
              </div>
              <p className="text-sm text-white/90">Videos, PDFs & interactive lessons for everyone!</p>
            </div>
            <div className="text-2xl">📚</div>
          </div>
        </button>

        {/* Learning Academy Banner */}
        <button
          onClick={() => navigateTo('learning-academy')}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-extrabold text-lg">Learning Academy</h3>
                <span className="px-2 py-1 bg-white/30 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-sm text-white/90">Complete courses with AI tutor & offline access!</p>
            </div>
            <div className="text-2xl">🎓</div>
          </div>
        </button>

        {/* Quick actions */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigateTo('chapters')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-3 flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Chapters</h4>
              <p className="text-xs text-gray-500">{userData.completedChapters}/5 completed</p>
            </button>

            <button
              onClick={() => navigateTo('brushing-lesson')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-3 flex items-center justify-center shadow-md">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Daily Lesson</h4>
              <p className="text-xs text-gray-500">Start brushing</p>
            </button>

            <button
              onClick={() => navigateTo('rewards')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl mb-3 flex items-center justify-center shadow-md">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Rewards</h4>
              <p className="text-xs text-gray-500">{userData.unlockedRewards.length} unlocked</p>
            </button>

            <button
              onClick={() => navigateTo('calendar')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-3 flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Calendar</h4>
              <p className="text-xs text-gray-500">{userData.totalDays} days total</p>
            </button>
          </div>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Today's Progress</h3>
            <button
              onClick={() => navigateTo('progress')}
              className="text-purple-600 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'morning', label: 'Morning Brushing', time: '8:00 AM' },
              { id: 'evening', label: 'Evening Brushing', time: '8:00 PM' }
            ].map(session => {
              const today = new Date().toISOString().split('T')[0];
              const logs = userData.brushingLogs || {};
              const log = logs[today];
              const isDone = log ? log[session.id as 'morning' | 'evening'] : false;

              return (
                <div key={session.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                    {isDone ? <Check className="w-5 h-5 text-green-600" /> : <Star className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{session.label}</span>
                      <span className={`text-xs font-bold ${isDone ? 'text-green-600' : 'text-gray-400'}`}>
                        {isDone ? '✓ Done' : 'Pending'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${isDone ? 'from-green-400 to-emerald-500 w-full' : 'from-gray-300 to-gray-300 w-0'
                        }`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent achievements */}
        <div className="bg-white rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Achievements</h3>
            <button
              onClick={() => navigateTo('achievements')}
              className="text-purple-600 text-sm font-medium"
            >
              See All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => navigateTo('achievements')}
                className="flex-shrink-0 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-center text-gray-600 w-16">Week {i}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 shadow-lg">
        <div className="flex justify-around items-center">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-purple-600">Home</span>
          </button>
          <button onClick={() => navigateTo('chapters')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-400">Chapters</span>
          </button>
          <button onClick={() => navigateTo('progress')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-400">Progress</span>
          </button>
          <button onClick={() => navigateTo('profile')} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <UserAvatar
                characterId={userData.selectedCharacter}
                showBackground={false}
                className="w-full h-full object-cover rounded-full ring-2 ring-gray-200"
              />
            </div>
            <span className="text-xs font-medium text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
