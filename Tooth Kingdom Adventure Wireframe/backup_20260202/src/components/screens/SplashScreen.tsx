import React from 'react';
import { ScreenProps } from './types';
import logoImage from 'figma:asset/0e08d80797dd9be25d0e92064648e8bd56d6c30c.png';

export function SplashScreen({ navigateTo }: ScreenProps) {
  return (
    <div className="h-full bg-gradient-to-b from-purple-50 via-blue-50 to-white flex flex-col items-center justify-between p-8 relative overflow-hidden">
      {/* Playful background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo */}
        <div 
          className="w-80 h-64 mb-6 rounded-3xl overflow-hidden bg-white p-4 float-gentle"
          style={{
            boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <img 
            src={logoImage}
            alt="Tooth Kingdom"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-3 text-gray-900">
          Tooth Kingdom
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-base max-w-xs leading-relaxed">
          Embark on a magical journey to save your smile and defeat the Sugar Bugs!
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigateTo('onboarding')}
        className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3), 0 4px 12px rgba(124, 58, 237, 0.2)',
        }}
      >
        Start Adventure
      </button>
    </div>
  );
}
