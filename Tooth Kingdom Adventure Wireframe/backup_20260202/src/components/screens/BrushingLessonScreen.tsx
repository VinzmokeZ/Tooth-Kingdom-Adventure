import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ChevronLeft, X, CheckCircle, Circle, ArrowRight, Lightbulb } from 'lucide-react';

const lessonSteps = [
  {
    title: 'Outer Surfaces',
    subtitle: 'It\'s time to brush like a hero!',
    instruction: 'Brush the outer surfaces of your upper teeth using gentle circular motions. Angle the brush at 45 degrees toward the gum line.',
    tips: ['Use gentle circular motions', 'Angle brush at 45 degrees', 'Take your time'],
    duration: '30 seconds',
    illustration: 'https://images.unsplash.com/photo-1584516151140-f79fde30d55f?w=400&h=300&fit=crop'
  },
  {
    title: 'Inner Surfaces',
    subtitle: 'Don\'t forget the inside!',
    instruction: 'Clean the inner surfaces of all teeth. For front teeth, tilt the brush vertically and use up-and-down strokes.',
    tips: ['Tilt brush vertically for front teeth', 'Use up-and-down strokes', 'Reach all inner surfaces'],
    duration: '30 seconds',
    illustration: 'https://images.unsplash.com/photo-1612446485216-2dc52fc0bb05?w=400&h=300&fit=crop'
  },
  {
    title: 'Chewing Surfaces',
    subtitle: 'Time to clean the tops!',
    instruction: 'Brush the chewing surfaces of your teeth with gentle back-and-forth motions. Make sure to reach all the way to the back molars.',
    tips: ['Use back-and-forth motions', 'Don\'t forget back molars', 'Be thorough'],
    duration: '20 seconds',
    illustration: 'https://images.unsplash.com/photo-1584516151140-f79fde30d55f?w=400&h=300&fit=crop'
  },
  {
    title: 'Tongue Cleaning',
    subtitle: 'Fresh breath power!',
    instruction: 'Gently brush your tongue from back to front to remove bacteria and freshen your breath.',
    tips: ['Brush from back to front', 'Be gentle', 'This prevents bad breath'],
    duration: '15 seconds',
    illustration: 'https://images.unsplash.com/photo-1612446485216-2dc52fc0bb05?w=400&h=300&fit=crop'
  },
];

export function BrushingLessonScreen({ navigateTo }: ScreenProps) {
  const [step, setStep] = useState(0);
  const currentStep = lessonSteps[step];

  const handleNext = () => {
    if (step < lessonSteps.length - 1) {
      setStep(step + 1);
    } else {
      navigateTo('lesson-complete');
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigateTo('chapters')} 
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-base">The Brushing Quest</h1>
          <button 
            onClick={() => navigateTo('dashboard')} 
            className="p-2 -mr-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 progress-bar-child">
            <div
              className="progress-bar-fill"
              style={{ width: `${((step + 1) / lessonSteps.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-gray-600">
            {step + 1}/{lessonSteps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Step badge */}
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
            Lesson {step + 1}
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
            {currentStep.duration}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
            {currentStep.title}
          </h2>
          <p className="text-purple-600 font-semibold text-base">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Illustration */}
        <div 
          className="w-full aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <img
            src={currentStep.illustration}
            alt={currentStep.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Instruction */}
        <div 
          className="bg-white rounded-2xl p-5 border-2 border-purple-100"
          style={{
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)',
          }}
        >
          <p className="text-gray-700 leading-relaxed text-base">
            {currentStep.instruction}
          </p>
        </div>

        {/* Tips */}
        <div 
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">Pro Tips</h3>
          </div>
          <ul className="space-y-2">
            {currentStep.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                <span className="text-amber-600 font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Step indicators */}
        <div className="grid grid-cols-4 gap-3 pt-2">
          {lessonSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-purple-600 text-white scale-110'
                  : 'bg-gray-100 text-gray-400'
              }`}
              style={{
                boxShadow: i <= step ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {i < step ? (
                <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                <span className="text-xl font-bold">{i + 1}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border-t border-gray-100 p-5">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 h-14 bg-gray-100 text-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-200 active:scale-95"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            style={{
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
            }}
          >
            {step < lessonSteps.length - 1 ? (
              <>
                Next Step
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              'Complete Lesson'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
