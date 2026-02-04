import React, { useState } from 'react';
import { ScreenProps } from './types';
import { Mail, Lock, Eye, EyeOff, Sparkles, Scan, Fingerprint, MessageSquare } from 'lucide-react';
import logo from 'figma:asset/5b0695099dfd67c35f14fc4f047da4df5ed6aa0e.png';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function SignInScreen({ navigateTo }: ScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [use2FA, setUse2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Navigate to OTP if 2FA is enabled, otherwise go to onboarding
      if (use2FA) {
        navigateTo('otp-verification');
      } else {
        navigateTo('onboarding');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login - navigate to OTP if 2FA enabled
    if (use2FA) {
      navigateTo('otp-verification');
    } else {
      navigateTo('onboarding');
    }
  };

  const handleAILogin = (method: string) => {
    // Mock AI login - instant verification, go straight to onboarding
    navigateTo('onboarding');
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-50 flex flex-col overflow-y-auto relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-cyan-300 rounded-full opacity-30 blur-xl"></div>

      {/* Floating tooth icons */}
      <div className="absolute top-20 right-16 text-6xl animate-float-slow opacity-40">🦷</div>
      <div className="absolute bottom-40 left-12 text-4xl animate-float-delayed opacity-40">✨</div>
      <div className="absolute top-1/2 left-8 text-5xl animate-float opacity-40">🦷</div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="Tooth Kingdom Logo" className="w-64 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform" />
            </div>
            <p className="text-gray-600 text-base">
              Join the adventure to save smiles! 🌟
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border-2 border-purple-100">
            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isSignUp
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isSignUp
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hero Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your hero name"
                      className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hero@toothkingdom.com"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <button type="button" className="text-sm text-purple-600 font-medium hover:text-purple-700">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {isSignUp ? '🚀 Start Adventure' : '🦷 Login to Kingdom'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p>
                  New to Tooth Kingdom?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    Create account
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* AI Authentication Options */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl shadow-2xl p-1 mt-6">
            <div className="bg-white rounded-[22px] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <h3 className="font-extrabold text-gray-900">AI-Powered Login</h3>
                <span className="ml-auto px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Login instantly with our smart AI technology! 🚀
              </p>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleAILogin('face')}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl hover:scale-105 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Scan className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Face ID</span>
                </button>

                <button
                  onClick={() => handleAILogin('fingerprint')}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl hover:scale-105 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Touch ID</span>
                </button>

                <button
                  onClick={() => handleAILogin('voice')}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:scale-105 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Voice ID</span>
                </button>
              </div>

              {/* 2FA Toggle */}
              <div className="mt-5 pt-5 border-t-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                      <span className="text-base">🛡️</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">2FA Security</p>
                      <p className="text-xs text-gray-500">Extra protection with OTP</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUse2FA(!use2FA)}
                    className={`relative w-14 h-7 rounded-full transition-all ${use2FA ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${use2FA ? 'translate-x-7' : 'translate-x-0'
                        }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
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