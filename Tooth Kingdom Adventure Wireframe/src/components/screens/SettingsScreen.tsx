import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, ChevronRight, Bell, Lock, Globe, HelpCircle, Info, User, Moon, Volume2, Shield, Bot, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export function SettingsScreen({ navigateTo, userData }: ScreenProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account section */}
        <div className="px-5 py-4 border-b-8 border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Account</h3>
          
          <button
            onClick={() => navigateTo('profile')}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <UserAvatar characterId={userData.selectedCharacter} size="medium" />
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-900">Champion User</h4>
              <p className="text-sm text-gray-500">Level {userData.level} • View Profile</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Preferences section */}
        <div className="px-5 py-4 border-b-8 border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Preferences</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('notifications')}
              className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">Notifications</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">Language</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">English</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">Privacy</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* App settings */}
        <div className="px-5 py-4 border-b-8 border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">App Settings</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-pink-600" />
                </div>
                <span className="font-medium text-gray-900">Sound Effects</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  soundEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                  soundEnabled ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium text-gray-900">Push Notifications</span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  notificationsEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                  notificationsEnabled ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-900">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  darkMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                  darkMode ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-medium text-gray-900">AI Assistant</span>
              </div>
              <button
                onClick={() => setAiAssistantEnabled(!aiAssistantEnabled)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  aiAssistantEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                  aiAssistantEnabled ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* AI & Learning Section */}
        <div className="px-5 py-4 border-b-8 border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase">AI & Learning</h3>
            <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-bold rounded-full">
              NEW
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('learning-academy')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-white block">Learning Academy</span>
                <span className="text-xs text-white/90">Courses with AI tutor</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => navigateTo('learning-resources')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-white block">Learning Resources</span>
                <span className="text-xs text-white/90">Videos, PDFs & lessons</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-md p-1">
              <div className="bg-white rounded-[14px] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      AI Features
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                    </h4>
                    <p className="text-xs text-gray-600">Smart assistance & insights</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base mt-0.5">🤖</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">Daily AI Tips</p>
                      <p className="text-xs text-gray-500">Personalized recommendations</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${aiAssistantEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base mt-0.5">📊</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">Progress Analysis</p>
                      <p className="text-xs text-gray-500">Smart insights on habits</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${aiAssistantEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base mt-0.5">💬</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">AI Chat Assistant</p>
                      <p className="text-xs text-gray-500">Ask dental questions</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${aiAssistantEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base mt-0.5">🎯</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">Goal Predictions</p>
                      <p className="text-xs text-gray-500">AI forecasts your success</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${aiAssistantEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="px-5 py-4 border-b-8 border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Support</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">Help & FAQ</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-rose-600" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">About</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Version & logout */}
        <div className="px-5 py-6">
          <p className="text-center text-sm text-gray-400 mb-4">
            Tooth Kingdom Adventure v1.0.0
          </p>
          <button className="w-full h-12 bg-red-50 text-red-600 rounded-2xl font-medium hover:bg-red-100 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}