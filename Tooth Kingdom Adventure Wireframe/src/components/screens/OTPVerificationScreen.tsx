import React, { useState, useRef, useEffect } from 'react';
import { ScreenProps } from './types';
import { ArrowLeft, Shield, Sparkles, RefreshCw } from 'lucide-react';
import logo from 'figma:asset/5b0695099dfd67c35f14fc4f047da4df5ed6aa0e.png';

export function OTPVerificationScreen({ navigateTo }: ScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpToVerify = otp) => {
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    navigateTo('onboarding');
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-50 flex flex-col overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-cyan-300 rounded-full opacity-30 blur-xl"></div>

      {/* Floating elements */}
      <div className="absolute top-20 right-16 text-5xl animate-float-slow opacity-40">🛡️</div>
      <div className="absolute bottom-40 left-12 text-4xl animate-float-delayed opacity-40">✨</div>
      <div className="absolute top-1/2 left-8 text-4xl animate-float opacity-40">🔒</div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigateTo('signin')}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-2xl transform hover:scale-110 transition-transform relative">
              <Shield className="w-12 h-12 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center border-4 border-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Verification Code
            </h1>
            <p className="text-gray-600 text-sm px-4">
              We've sent a magic code to your email to keep your Tooth Kingdom safe! 🦷✨
            </p>
            <p className="text-purple-600 font-semibold text-sm mt-2">
              hero@toothkingdom.com
            </p>
          </div>

          {/* OTP Input Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border-2 border-purple-100 mb-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${digit ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || otp.some(digit => !digit)}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${isVerifying || otp.some(digit => !digit)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                '🚀 Verify & Continue'
              )}
            </button>

            {/* Resend */}
            <div className="mt-6 text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Didn't receive code?{' '}
                  <span className="text-purple-600 font-semibold">
                    Resend in {resendTimer}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-purple-600 font-semibold hover:text-purple-700 flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </button>
              )}
            </div>
          </div>

          {/* AI Helper Tip */}
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 border-2 border-cyan-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  AI Security Tip 💡
                </h3>
                <p className="text-xs text-gray-700">
                  Never share your verification code with anyone! Our AI protects your account 24/7 to keep your kingdom safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.1);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
      ` }} />
    </div>
  );
}