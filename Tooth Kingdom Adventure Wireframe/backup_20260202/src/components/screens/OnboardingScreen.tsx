import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronRight, Sparkles, Shield, Trophy } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Sparkles,
    title: 'Learn Proper Brushing',
    description: 'Master the art of brushing with fun interactive lessons and defeat the Sugar Bugs!',
    color: 'from-purple-400 to-pink-400'
  },
  {
    icon: Shield,
    title: 'Build Healthy Habits',
    description: 'Track your daily brushing routine and build a powerful streak to protect your smile!',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    icon: Trophy,
    title: 'Earn Rewards & Unlock Treasures',
    description: 'Complete chapters, earn stars, and unlock amazing rewards in the Tooth Kingdom!',
    color: 'from-amber-400 to-orange-400'
  }
];

export function OnboardingScreen({ navigateTo }: ScreenProps) {
  const [step, setStep] = useState(0);
  const currentStep = onboardingSteps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      navigateTo('character-select');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Skip button */}
      <div className="p-5 flex justify-end">
        <button
          onClick={() => navigateTo('character-select')}
          className="text-purple-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-purple-50 transition-all"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon with gradient background */}
        <div 
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentStep.color} flex items-center justify-center mb-8 float-gentle`}
          style={{
            boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Icon 
            className="w-24 h-24 text-white" 
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4 leading-tight">
          {currentStep.title}
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 leading-relaxed max-w-sm text-base">
          {currentStep.description}
        </p>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-3 mb-8">
        {onboardingSteps.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-10 bg-purple-600' : 'w-2.5 bg-gray-200'
            }`}
            style={
              i === step
                ? { boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)' }
                : undefined
            }
          />
        ))}
      </div>

      {/* Next button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          style={{
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3), 0 4px 12px rgba(124, 58, 237, 0.2)',
          }}
        >
          {step < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
