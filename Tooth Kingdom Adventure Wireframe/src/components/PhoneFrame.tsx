import React from 'react';
import { useGame } from '../context/GameContext';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const { userData } = useGame();
  const isDarkMode = userData.settings?.darkMode || false;

  return (
    <div className="relative bg-black rounded-[3.5rem] p-3.5 shadow-2xl transition-all duration-500">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black h-7 w-40 rounded-b-3xl z-20 flex items-end justify-center pb-1">
        <div className="w-14 h-1 bg-gray-900 rounded-full"></div>
      </div>

      {/* Screen */}
      <div className={`relative rounded-[3rem] overflow-hidden w-[375px] h-[812px] transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        {children}

        {/* Global Dark Mode Overrides */}
        {isDarkMode && (
          <style>{`
            /* Force dark backgrounds on common white/light containers */
            .bg-white, .bg-slate-50, .bg-gray-50, .bg-purple-50, .bg-blue-50, .bg-pink-50, .bg-slate-100, .bg-gray-100 {
              background-color: #0f172a !important; /* slate-900 */
              color: #f8fafc !important; /* slate-50 */
            }
            
            /* Secondary dark background for nested cards */
            .bg-gray-100/50, .bg-white/50, .bg-slate-50/50 {
              background-color: #1e293b !important; /* slate-800 */
            }

            /* Text Colors */
            .text-gray-900, .text-gray-800, .text-slate-900, .text-slate-800 {
              color: #ffffff !important;
            }
            .text-gray-600, .text-gray-500, .text-slate-600, .text-slate-500 {
              color: #cbd5e1 !important; /* slate-300 */
            }
            
            /* Inputs & Selection */
            input, select, textarea {
              background-color: #1e293b !important;
              color: #ffffff !important;
              border-color: #334155 !important;
            }
            
            /* Borders */
            .border-gray-100, .border-gray-200, .border-slate-100, .border-slate-200, .border-purple-100 {
              border-color: #334155 !important; /* slate-700 */
            }

            /* Button text visibility */
            .bg-white .text-gray-900 {
              color: #ffffff !important;
            }
          `}</style>
        )}
      </div>

      {/* Side buttons */}
      <div className="absolute -left-1 top-24 w-1 h-8 bg-black rounded-l"></div>
      <div className="absolute -left-1 top-36 w-1 h-16 bg-black rounded-l"></div>
      <div className="absolute -right-1 top-32 w-1 h-16 bg-black rounded-r"></div>
    </div>
  );
}
