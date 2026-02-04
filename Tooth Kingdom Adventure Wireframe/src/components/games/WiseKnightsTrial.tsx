import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowLeft, Clock, Brain } from 'lucide-react';
import { GameProps } from './types';

type Screen = 'start' | 'playing' | 'victory';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  emoji: string;
}

const QUESTIONS: Question[] = [
  {
    question: 'How many times should you brush your teeth daily?',
    options: ['Once', 'Twice', 'Three times', 'Never'],
    correctIndex: 1,
    emoji: '🪥',
  },
  {
    question: 'How long should you brush your teeth?',
    options: ['30 seconds', '1 minute', '2 minutes', '5 minutes'],
    correctIndex: 2,
    emoji: '⏱️',
  },
  {
    question: 'What helps make teeth stronger?',
    options: ['Sugar', 'Fluoride', 'Candy', 'Soda'],
    correctIndex: 1,
    emoji: '💪',
  },
  {
    question: 'Which food is good for your teeth?',
    options: ['Candy', 'Cheese', 'Lollipop', 'Soda'],
    correctIndex: 1,
    emoji: '🧀',
  },
  {
    question: 'What should you use to clean between teeth?',
    options: ['Toothpick', 'Dental floss', 'Pencil', 'Paper'],
    correctIndex: 1,
    emoji: '🧵',
  },
  {
    question: 'How often should you visit the dentist?',
    options: ['Every week', 'Every month', 'Every 6 months', 'Never'],
    correctIndex: 2,
    emoji: '👨‍⚕️',
  },
  {
    question: 'What causes cavities?',
    options: ['Water', 'Vegetables', 'Sugar and bacteria', 'Cheese'],
    correctIndex: 2,
    emoji: '🦷',
  },
  {
    question: 'When should you replace your toothbrush?',
    options: ['Every week', 'Every 3-4 months', 'Every year', 'Never'],
    correctIndex: 1,
    emoji: '🪥',
  },
  {
    question: 'Which drink is best for your teeth?',
    options: ['Soda', 'Juice', 'Water', 'Energy drink'],
    correctIndex: 2,
    emoji: '💧',
  },
  {
    question: 'What protects the outside of your tooth?',
    options: ['Sugar', 'Enamel', 'Candy', 'Plaque'],
    correctIndex: 1,
    emoji: '🛡️',
  },
];

export function WiseKnightsTrial({ onComplete, onExit }: GameProps) {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const maxScore = 500;
  const totalQuestions = 8;

  // Shuffle questions on start
  const startGame = useCallback(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    setShuffledQuestions(shuffled);
    setScreen('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  // Timer
  useEffect(() => {
    if (screen !== 'playing' || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleAnswer(-1); // Time's up, wrong answer
          return 15;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, selectedAnswer]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctIndex;

    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = Math.min(streak * 10, 30);
      setScore(s => Math.min(maxScore, s + 40 + timeBonus + streakBonus));
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    // Move to next question or victory
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        setScreen('victory');
      } else {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
      }
    }, 1200);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const stars = score >= 400 ? 3 : score >= 250 ? 2 : 1;

  return (
    <div className="w-full h-full bg-gradient-to-b from-indigo-500 via-purple-600 to-violet-700 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 relative"
          >
            {/* Floating elements */}
            {['🧠', '💡', '📚', '✨', '🎓', '🏆'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                animate={{
                  y: [-8, 8, -8],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                style={{ left: `${10 + i * 15}%`, top: `${25 + (i % 2) * 40}%` }}
              >
                {emoji}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-3">⚔️</div>
              <h1 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                Wise Knight's
              </h1>
              <h2 className="text-xl font-bold text-yellow-300">Trial!</h2>
            </motion.div>

            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              🛡️
            </motion.div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-[280px]">
              <p className="text-white/90 text-center text-sm">
                <Brain className="w-4 h-4 inline mr-1" />
                Test your dental knowledge!
              </p>
              <p className="text-white/70 text-center text-xs mt-2">
                Answer fast for bonus points!
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Begin Trial
            </motion.button>

            {onExit && (
              <button
                onClick={onExit}
                className="mt-4 text-white/60 text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </motion.div>
        )}

        {screen === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* HUD */}
            <div className="p-3 flex items-center justify-between bg-black/30">
              <div className="text-white text-sm font-bold">
                Q{currentQuestionIndex + 1}/{totalQuestions}
              </div>

              <div className="text-yellow-300 font-bold text-lg">
                {score}
              </div>

              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <span className="bg-orange-500 px-2 py-1 rounded text-white text-xs font-bold">
                    🔥 {streak}x
                  </span>
                )}
                <motion.div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 5 ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                    }`}
                  animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Clock className="w-4 h-4" />
                  {timeLeft}s
                </motion.div>
              </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <motion.div
                key={currentQuestionIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4"
              >
                <div className="text-4xl text-center mb-3">{currentQuestion.emoji}</div>
                <p className="text-white text-center text-lg font-semibold leading-snug">
                  {currentQuestion.question}
                </p>
              </motion.div>

              {/* Options */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                {currentQuestion.options.map((option: string, index: number) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === currentQuestion.correctIndex;
                  const showResult = selectedAnswer !== null;

                  let bgColor = 'bg-white/90';
                  if (showResult) {
                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-400';
                    } else if (isSelected && !isCorrect) {
                      bgColor = 'bg-red-400';
                    } else {
                      bgColor = 'bg-white/50';
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${bgColor} ${showResult ? '' : 'active:scale-98'
                        }`}
                    >
                      <span className="text-gray-800 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {showResult && isCorrectAnswer && (
                          <span className="ml-auto text-xl">✓</span>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <span className="ml-auto text-xl">✗</span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              {isCorrect !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-center py-3 rounded-xl mt-3 font-bold ${isCorrect ? 'bg-green-500/50 text-green-100' : 'bg-red-500/50 text-red-100'
                    }`}
                >
                  {isCorrect ? '🎉 Correct! +' + (40 + Math.floor(timeLeft * 2)) : '❌ Not quite!'}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative"
          >
            {/* Confetti */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: [0, 400],
                  x: Math.sin(i) * 50,
                  opacity: [1, 0],
                  rotate: 360,
                }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                style={{ left: `${5 + i * 10}%` }}
              >
                {['⭐', '🧠', '🏆', '✨'][i % 4]}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl mb-4"
            >
              🎓
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2">
              Trial Complete!
            </h2>

            <p className="text-yellow-300 text-3xl font-bold mb-4">
              {score} points
            </p>

            {/* Stars */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Star
                    className={`w-12 h-12 ${i <= stars
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                      }`}
                  />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(score, stars)}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg"
            >
              Continue ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
