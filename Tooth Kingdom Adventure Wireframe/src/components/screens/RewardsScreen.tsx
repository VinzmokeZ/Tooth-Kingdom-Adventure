import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, Star, Lock, Sparkles } from 'lucide-react';

const rewards = [
  { id: 1, name: 'Golden Crown', emoji: '👑', stars: 0, unlocked: true, equipped: true },
  { id: 2, name: 'Magic Wand', emoji: '🪄', stars: 0, unlocked: true, equipped: false },
  { id: 3, name: 'Rainbow Shield', emoji: '🛡️', stars: 0, unlocked: true, equipped: false },
  { id: 4, name: 'Super Cape', emoji: '🦸', stars: 0, unlocked: true, equipped: false },
  { id: 5, name: 'Sparkle Stars', emoji: '✨', stars: 0, unlocked: true, equipped: false },
  { id: 6, name: 'Diamond Ring', emoji: '💎', stars: 50, unlocked: false, equipped: false },
  { id: 7, name: 'Fire Wings', emoji: '🔥', stars: 75, unlocked: false, equipped: false },
  { id: 8, name: 'Mystic Orb', emoji: '🔮', stars: 100, unlocked: false, equipped: false },
  { id: 9, name: 'Trophy Cup', emoji: '🏆', stars: 150, unlocked: false, equipped: false },
  { id: 10, name: 'Royal Scepter', emoji: '👑', stars: 200, unlocked: false, equipped: false },
];

export function RewardsScreen({ navigateTo, userData, updateUserData }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked'>('all');

  const filteredRewards = rewards.map(reward => {
    const isUnlocked = userData.unlockedRewards.includes(reward.id) || reward.stars === 0;
    const isEquipped = userData.selectedCharacter === reward.id; // Using as simplified equipment for now
    return { ...reward, unlocked: isUnlocked, equipped: isEquipped };
  }).filter(r => activeTab === 'all' || r.unlocked);

  const handleAction = (reward: any) => {
    if (reward.unlocked) {
      updateUserData({ selectedCharacter: reward.id });
    } else if (userData.totalStars >= reward.stars) {
      updateUserData({
        totalStars: userData.totalStars - reward.stars,
        unlockedRewards: [...userData.unlockedRewards, reward.id]
      });
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-pink-500 to-purple-600 text-white px-5 pt-5 pb-6 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1">Rewards Collection</h1>
        </div>

        {/* Stars balance */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 flex items-center justify-center gap-3">
          <Star className="w-7 h-7 fill-yellow-300 text-yellow-300" />
          <div>
            <p className="text-white/80 text-xs">Your Stars</p>
            <p className="text-2xl font-bold">{userData.totalStars}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 z-10">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
              }`}
          >
            All Rewards
          </button>
          <button
            onClick={() => setActiveTab('unlocked')}
            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${activeTab === 'unlocked'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
              }`}
          >
            Unlocked ({userData.unlockedRewards.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className={`bg-white rounded-3xl p-5 shadow-md transition-all ${reward.unlocked ? 'hover:shadow-lg' : 'opacity-75'
                }`}
            >
              {/* Reward image */}
              <div className="relative">
                <div className={`aspect-square bg-gradient-to-br ${reward.unlocked
                    ? 'from-purple-100 to-pink-100'
                    : 'from-gray-100 to-gray-200'
                  } rounded-2xl flex items-center justify-center text-6xl mb-3 shadow-md`}>
                  {reward.emoji}
                  {!reward.unlocked && (
                    <div className="absolute inset-0 bg-gray-900/40 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                {reward.equipped && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                    Equipped
                  </div>
                )}
              </div>

              {/* Reward info */}
              <h3 className="font-bold text-gray-900 text-sm mb-1 text-center">
                {reward.name}
              </h3>

              {/* Action */}
              <button
                onClick={() => handleAction(reward)}
                className={`w-full h-9 rounded-xl text-sm font-medium transition-all ${reward.unlocked
                    ? reward.equipped
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : userData.totalStars >= reward.stars
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {reward.unlocked
                  ? reward.equipped ? 'Equipped' : 'Equip'
                  : userData.totalStars >= reward.stars ? `Unlock (${reward.stars})` : `${reward.stars} Stars Needed`}
              </button>
            </div>
          ))}
        </div>

        {/* How to earn section */}
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-5 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-900">How to Earn Stars</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: '📚', text: 'Complete lessons & chapters' },
              { icon: '🔥', text: 'Maintain your daily streak' },
              { icon: '🎯', text: 'Achieve daily goals' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                  {item.icon}
                </div>
                <p className="text-gray-700 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
