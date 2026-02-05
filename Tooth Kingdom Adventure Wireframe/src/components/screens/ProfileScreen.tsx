import React from 'react';
import { ScreenProps } from './types';
import { getAIChatResponse, generateAIProgressReport } from '../../utils/aiMockService';
import { ArrowLeft, Edit2, Save, X, Trophy, Star, History, Calendar, CheckCircle, TrendingUp, Sparkles, Zap, Brain, Target, Award, ChevronLeft, Bot, Flame, Share2, Settings } from 'lucide-react';
import { UserAvatar, getCharacterName } from '../common/UserAvatar';

export function ProfileScreen({ navigateTo, userData, updateUserData }: ScreenProps) {
  const [aiReport, setAiReport] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedAchievement, setSelectedAchievement] = React.useState<any>(null);

  // Local edit state
  const [editName, setEditName] = React.useState(userData.name || 'Tooth Defender');
  const [editSettings, setEditSettings] = React.useState(userData.settings || { darkMode: false, notifications: true, sound: true });

  const isDarkMode = userData.settings?.darkMode || false;

  const handlePreSave = () => {
    // If name changed, ask for confirmation
    if (editName !== userData.name) {
      setShowConfirm(true);
    } else {
      // Just saving settings, no confirmation needed for name
      confirmSave();
    }
  };

  const confirmSave = () => {
    updateUserData({
      name: editName,
      settings: editSettings
    });
    setShowConfirm(false);
    setIsEditing(false);
  };

  const toggleSetting = (key: keyof typeof editSettings) => {
    setEditSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const report = generateAIProgressReport(userData);
        setAiReport(report);
      } catch (error) {
        console.error("AI Report Generation Failed:", error);
        setAiReport("⚠️ AI Connection Error. \n\nWe couldn't generate your report right now. Keep brushing and try again later! 🤖");
      } finally {
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className={`h-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-purple-50 to-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 px-5 pt-5 pb-8 z-10 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition">
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-white'}`} />
          </button>
          <h1 className="text-xl font-bold drop-shadow-sm text-white">My Profile</h1>
          <div className="flex items-center">
            <button
              onClick={() => {
                setEditSettings(userData.settings || { darkMode: false, notifications: true, sound: true });
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => {
                setEditName(userData.name || 'Tooth Defender');
                setIsEditing(true);
              }}
              className="p-2 -mr-2 rounded-full hover:bg-white/20 transition"
            >
              <Edit2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className={`backdrop-blur-md rounded-3xl p-6 border shadow-inner transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/20 border-white/30'}`}>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-4 animate-float-gentle z-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-2xl opacity-40 animate-pulse -z-10"></div>
              <UserAvatar
                characterId={userData.selectedCharacter}
                size="xlarge"
                className="filter drop-shadow-xl relative z-10"
                showBackground={false}
              />
            </div>
            <h2 className={`text-2xl font-extrabold mb-1 drop-shadow-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userData.name}
            </h2>
            <p className={`text-sm font-medium tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-100'}`}>Level {userData.level} Champion 🏆</p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              <span className="font-bold text-white drop-shadow-sm">{userData.totalStars} Stars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto px-5 py-5 space-y-5 ${isDarkMode ? 'bg-slate-950' : ''}`}>

        {/* AI Insight Section */}
        <div className={`rounded-3xl p-1 shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
          <div className={`rounded-[22px] p-5 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md ${isGenerating ? 'animate-spin' : ''}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Progress Report</h3>
              </div>
            </div>

            {aiReport ? (
              <div className="mt-4 p-4 bg-black/80 rounded-xl border border-green-500/30 font-mono text-sm text-green-400 relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors pointer-events-none"></div>
                <pre className="whitespace-pre-wrap font-mono relative z-20 leading-relaxed text-xs md:text-sm">
                  {aiReport}
                </pre>
                <button
                  onClick={() => setAiReport('')}
                  className="flex justify-end mt-2 w-full text-xs text-green-500/70 hover:text-green-400 underline"
                >
                  Clear Report
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Get a personalized analysis of your dental habits!</p>
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-70"
                >
                  {isGenerating ? 'Analyzing Stats...' : '✨ Generate AI Report'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, value: userData.totalStars, label: 'Total Stars', color: 'from-amber-400 to-orange-500' },
            { icon: Flame, value: userData.currentStreak, label: 'Day Streak', color: 'from-orange-400 to-pink-500' },
            { icon: Calendar, value: userData.totalDays, label: 'Total Days', color: 'from-blue-400 to-cyan-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`rounded-2xl p-4 shadow-md text-center border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50'}`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mb-2 flex items-center justify-center mx-auto shadow-md ring-2 ${isDarkMode ? 'ring-slate-700' : 'ring-white'}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`text-xs font-semibold mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Achievements (Interactable) */}
        <div className={`rounded-3xl p-5 shadow-md border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Achievements</h3>
            <button onClick={() => navigateTo('achievements')} className="text-sm font-bold text-purple-600">See All</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 1, title: 'Check-in Pro', desc: 'Brushed 3 days in a row!', icon: Trophy, color: 'from-amber-400 to-orange-500' },
              { id: 2, title: 'Star Hunter', desc: 'Collected 50 stars!', icon: Star, color: 'from-yellow-300 to-amber-500' },
              { id: 3, title: 'Skillful', desc: 'Completed Chapter 1', icon: Award, color: 'from-purple-400 to-pink-500' },
              { id: 4, title: 'Hero', desc: 'First Boss Defeated', icon: Zap, color: 'from-blue-400 to-cyan-500' },
            ].map((ach) => (
              <button
                key={ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className="flex flex-col items-center group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${ach.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mb-1`}>
                  <ach.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-[10px] font-bold text-center truncate w-full ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{ach.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          {[
            { id: 'achievements', icon: Award, label: 'Achievements', sub: `${userData.achievements.length} unlocked badges`, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-600', val: userData.achievements.length },
            { id: 'stats', icon: TrendingUp, label: 'Statistics', sub: 'View your progress & insights', color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-600', val: null },
            { id: 'calendar', icon: Calendar, label: 'Activity Calendar', sub: 'Track your daily progress', color: 'from-green-400 to-emerald-500', bg: 'bg-green-100', text: 'text-green-600', val: null }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all border group ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-gray-100'}`}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.sub}</p>
              </div>
              {item.val !== null && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-800 text-white' : `${item.bg} ${item.text}`}`}>
                  {item.val}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Progress summary */}
        <div className={`rounded-3xl p-5 text-white shadow-lg relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-gradient-to-br from-purple-600 to-indigo-700'}`}>
          {!isDarkMode && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-5"></div>
            </>
          )}
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
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slideUp ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 scrollbar-thin">
              {/* Name Input */}
              <div className="p-1">
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-4 py-4 rounded-2xl border-2 outline-none font-bold transition-all text-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-purple-500 text-gray-900'}`}
                  placeholder="Enter your name"
                  autoFocus
                />
                <p className={`mt-3 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Your name will be visible on the leaderboard and dashboard.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handlePreSave}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slideUp ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">App Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block">Dark Mode</span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Switch to a dark theme</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-14 h-8 rounded-full transition-colors relative ${editSettings.darkMode ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${editSettings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block">Notifications</span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Get game reminders</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('notifications')}
                  className={`w-14 h-8 rounded-full transition-colors relative ${editSettings.notifications ? 'bg-green-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${editSettings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block">Sound Effects</span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Enable game sounds</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('sound')}
                  className={`w-14 h-8 rounded-full transition-colors relative ${editSettings.sound ? 'bg-green-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${editSettings.sound ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  updateUserData({ settings: editSettings });
                  setIsSettingsOpen(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative text-center ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-24 h-24 bg-gradient-to-br ${selectedAchievement.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ring-8 ${isDarkMode ? 'ring-slate-800' : 'ring-purple-50'}`}>
              <selectedAchievement.icon className="w-12 h-12 text-white" />
            </div>

            <h3 className="text-2xl font-black mb-2">{selectedAchievement.title}</h3>
            <p className={`text-lg font-medium mb-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {selectedAchievement.desc}
            </p>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-gray-900'}`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Edit2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Change Name?</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Are you sure you want to change your name to <span className="font-bold text-purple-600">"{editName}"</span>?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className={`flex-1 py-3 rounded-xl font-bold ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Yes, Change It
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
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
        /* Custom scrollbar for dark mode */
        ${isDarkMode ? `
          div::-webkit-scrollbar-thumb {
            background-color: #475569;
          }
          div::-webkit-scrollbar-track {
            background-color: #020617;
          }
        ` : ''}
      ` }} />
    </div>
  );
}