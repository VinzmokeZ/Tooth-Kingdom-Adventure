import React from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, TrendingUp, Trophy, Target, Clock, Bot, Sparkles, Brain } from 'lucide-react';

export function ProgressScreen({ navigateTo, userData }: ScreenProps) {
  const now = new Date();
  const weeklyData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = (userData.brushingLogs as any)[dateStr];
    const value = log ? (log.morning && log.evening ? 100 : (log.morning || log.evening ? 50 : 0)) : 0;
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      value: value,
      completed: value > 0
    };
  });

  const totalPossibleSessions = userData.totalDays * 2 || 1;
  const actualSessions = Object.values(userData.brushingLogs).reduce((acc, log) =>
    acc + (log.morning ? 1 : 0) + (log.evening ? 1 : 0), 0);
  const overallProgress = Math.min(100, Math.round((actualSessions / totalPossibleSessions) * 100));

  const skills = [
    { name: 'Brushing Technique', progress: 85, color: 'from-purple-500 to-purple-600' },
    { name: 'Consistency', progress: 95, color: 'from-blue-500 to-cyan-600' },
    { name: 'Duration Control', progress: 78, color: 'from-pink-500 to-rose-600' },
    { name: 'Coverage', progress: 90, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Progress Tracking</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Overall progress */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-4">Overall Progress</h3>
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - overallProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">68%</div>
                  <div className="text-sm opacity-90">Complete</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{userData.totalDays}</div>
              <div className="text-xs opacity-90">Total Days</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{userData.currentStreak}</div>
              <div className="text-xs opacity-90">Day Streak</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{userData.totalStars}</div>
              <div className="text-xs opacity-90">Stars</div>
            </div>
          </div>
        </div>

        {/* Weekly activity */}
        <div className="bg-white rounded-3xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Weekly Activity</h3>
            <button className="text-purple-600 text-sm font-medium">This Week</button>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-40 mb-3">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className={`w-full rounded-t-lg transition-all ${day.completed
                      ? 'bg-gradient-to-t from-purple-500 to-purple-400'
                      : 'bg-gray-200'
                      }`}
                    style={{ height: `${day.value}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${day.completed ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Progress Analysis */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1">
          <div className="bg-white rounded-[22px] p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-extrabold text-gray-900">AI Progress Analysis</h3>
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                </div>
                <p className="text-sm text-gray-600">
                  Smart insights powered by AI 🤖
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Insight Cards */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Excellent Progress!</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Your consistency score improved by 12% this week. Keep brushing twice daily to maintain momentum!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">AI Suggestion</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Your duration control is at 78%. Try focusing on back molars for 5 extra seconds to reach 85%!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Next Goal</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      You're 2 days away from your 10-day streak milestone. Our AI predicts 95% success rate!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm flex items-center justify-center gap-2">
              <Bot className="w-4 h-4" />
              Get Detailed AI Report
            </button>
          </div>
        </div>

        {/* Skills breakdown */}
        <div className="bg-white rounded-3xl p-5 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Skills Assessment</h3>
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-sm font-bold text-purple-600">{skill.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-3xl p-5 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Recent Milestones</h3>
          <div className="space-y-3">
            {[
              { icon: Trophy, title: '7-Day Streak', subtitle: 'Achieved today', color: 'from-amber-400 to-orange-500' },
              { icon: Target, title: 'Chapter Master', subtitle: '2 days ago', color: 'from-purple-400 to-purple-600' },
              { icon: TrendingUp, title: 'Level 5 Reached', subtitle: '5 days ago', color: 'from-blue-400 to-cyan-600' },
            ].map((milestone, i) => {
              const Icon = milestone.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className={`w-12 h-12 bg-gradient-to-br ${milestone.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{milestone.title}</h4>
                    <p className="text-xs text-gray-500">{milestone.subtitle}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}