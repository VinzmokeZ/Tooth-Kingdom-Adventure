import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative bg-black rounded-[3.5rem] p-3.5 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black h-7 w-40 rounded-b-3xl z-20 flex items-end justify-center pb-1">
        <div className="w-14 h-1 bg-gray-900 rounded-full"></div>
      </div>
      
      {/* Screen */}
      <div className="relative bg-white rounded-[3rem] overflow-hidden w-[375px] h-[812px]">
        {children}
      </div>

      {/* Side buttons */}
      <div className="absolute -left-1 top-24 w-1 h-8 bg-black rounded-l"></div>
      <div className="absolute -left-1 top-36 w-1 h-16 bg-black rounded-l"></div>
      <div className="absolute -right-1 top-32 w-1 h-16 bg-black rounded-r"></div>
    </div>
  );
}
