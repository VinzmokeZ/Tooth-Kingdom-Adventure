import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Bell, Award, Calendar, Star, Flame, Trophy } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'reminder',
    icon: Bell,
    title: 'Time to Brush!',
    message: 'Evening brushing time. Keep your streak alive!',
    time: '5 min ago',
    read: false,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 2,
    type: 'achievement',
    icon: Award,
    title: 'New Achievement Unlocked!',
    message: 'You earned "Week Warrior" for 7-day streak',
    time: '1 hour ago',
    read: false,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 3,
    type: 'streak',
    icon: Flame,
    title: 'Streak Milestone!',
    message: 'Amazing! You reached a 7-day streak 🔥',
    time: '3 hours ago',
    read: true,
    color: 'from-orange-400 to-pink-500'
  },
  {
    id: 4,
    type: 'reward',
    icon: Star,
    title: 'New Reward Available!',
    message: 'Unlock "Golden Crown" with your stars',
    time: '1 day ago',
    read: true,
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 5,
    type: 'reminder',
    icon: Calendar,
    title: 'Perfect Week Possible!',
    message: 'You\'re on track for a perfect week',
    time: '2 days ago',
    read: true,
    color: 'from-green-400 to-emerald-500'
  },
];

export function NotificationsScreen({ navigateTo }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">Notifications</h1>
          <button className="text-purple-600 text-sm font-medium">Mark all</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === 'unread'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <button
              key={notification.id}
              className={`w-full flex items-start gap-4 p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${notification.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400">{notification.time}</span>
              </div>

              {/* Unread indicator */}
              {!notification.read && (
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              )}
            </button>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-sm text-gray-500 text-center">
              You have no unread notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
