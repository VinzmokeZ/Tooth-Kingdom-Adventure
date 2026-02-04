import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Trophy, Check, X, Clock } from 'lucide-react';
import { GameProps, GameScreen, TriviaQuestion } from './types';
import { StarRating } from './StarRating';

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "How many times a day should you brush your teeth?",
    options: ["Once", "Twice", "Three times", "Only when dirty"],
    correctIndex: 1
  },
  {
    question: "How long should you brush your teeth each time?",
    options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
    correctIndex: 2
  },
  {
    question: "What helps protect your teeth from cavities?",
    options: ["Candy", "Fluoride", "Sugar", "Soda"],
    correctIndex: 1
  },
  {
    question: "What should you do after eating sugary foods?",
    options: ["Eat more", "Brush or rinse", "Sleep", "Nothing"],
    correctIndex: 1
  },
  {
    question: "Which food is BEST for healthy teeth?",
    options: ["Candy", "Chips", "Cheese", "Cake"],
    correctIndex: 2
  },
  {
    question: "How often should you visit the dentist?",
    options: ["Every week", "Every month", "Every 6 months", "Never"],
    correctIndex: 2
  },
  {
    question: "What causes cavities?",
    options: ["Vegetables", "Water", "Bacteria and sugar", "Milk"],
    correctIndex: 2
  },
  {
    question: "What tool helps clean between teeth?",
    options: ["Toothbrush", "Dental floss", "Spoon", "Comb"],
    correctIndex: 1
  },
  {
    question: "Which drink is BEST for your teeth?",
    options: ["Soda", "Juice", "Water", "Energy drink"],
    correctIndex: 2
  },
  {
    question: "When should you replace your toothbrush?",
    options: ["Every week", "Every 3-4 months", "Every year", "Never"],
    correctIndex: 1
  },
  {
    question: "What protects the outer layer of your teeth?",
    options: ["Gums", "Enamel", "Tongue", "Lips"],
    correctIndex: 1
  },
  {
    question: "What color should healthy gums be?",
    options: ["Blue", "Pink", "Yellow", "White"],
    correctIndex: 1
  }
];

export function WiseKnightsTrial({ onComplete }: GameProps) {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [health, setHealth] = useState(100);

  const totalQuestions = 8;

  const calculateStars = (finalScore: number): number => {
    if (finalScore >= 700) return 3;
    if (finalScore >= 400) return 2;
    if (finalScore >= 200) return 1;
    return 0;
  };

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const correct = answerIndex === questions[currentQuestion].correctIndex;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.floor(timeLeft * 5);
      const streakBonus = streak * 10;
      setScore(s => s + 50 + timeBonus + streakBonus);
      setStreak(s => s + 1);
    } else {
      setHealth(h => Math.max(0, h - 25));
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions || health <= 25) {
        setScreen('victory');
      } else {
        setCurrentQuestion(q => q + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
      }
    }, 1500);
  }, [selectedAnswer, questions, currentQuestion, timeLeft, streak, health]);

  // Timer
  useEffect(() => {
    if (screen !== 'gameplay' || selectedAnswer !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, selectedAnswer, handleAnswer]);

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [health, screen]);

  const handleStart = () => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
    setScreen('gameplay');
    setScore(0);
    setCurrentQuestion(0);
    setStreak(0);
    setTimeLeft(15);
    setHealth(100);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleComplete = () => {
    const stars = calculateStars(score);
    onComplete(score, stars);
  };

  const question = questions[currentQuestion];

  const optionColors = [
    { bg: 'from-pink-400 to-pink-600', border: 'border-pink-300', letter: '🅰️' },
    { bg: 'from-cyan-400 to-cyan-600', border: 'border-cyan-300', letter: '🅱️' },
    { bg: 'from-green-400 to-green-600', border: 'border-green-300', letter: '🅲' },
    { bg: 'from-orange-400 to-orange-600', border: 'border-orange-300', letter: '🅳' }
  ];

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-3xl overflow-hidden border-4 border-blue-300 shadow-2xl"
          >
            {/* Magic Particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
              >
                {['✨', '⭐', '💫', '🌟', '📚', '🧠'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🧠
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: '3px 3px 0 #4338CA, 6px 6px 0 #7C3AED' }}>
                Wise Knight's Trial
              </h1>

              <p className="text-xl text-white font-medium mb-2">
                🦷 Test your dental wisdom! 🦷
              </p>
              <p className="text-white/80 mb-8 max-w-md">
                Answer questions correctly and quickly to earn bonus points!
              </p>

              <motion.button
                onClick={handleStart}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #D97706' }}
              >
                <Brain className="w-8 h-8" />
                BEGIN!
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === 'gameplay' && question && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 rounded-3xl overflow-hidden border-4 border-indigo-300 select-none"
          >
            {/* Sparkles Background */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
              >
                ✨
              </motion.div>
            ))}

            {/* UI Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-40">
              {/* Health */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-pink-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-pink-600 font-bold text-sm">Wisdom</span>
                </div>
                <div className="w-24 h-4 bg-pink-200 rounded-full overflow-hidden border-2 border-pink-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-red-400 rounded-full"
                    animate={{ width: `${health}%` }}
                  />
                </div>
              </div>

              {/* Score & Progress */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-500">{score}</div>
                <div className="text-xs text-orange-400 font-bold">SCORE</div>
                <div className="text-purple-600 font-bold mt-1">
                  Q{currentQuestion + 1}/{totalQuestions}
                </div>
              </div>

              {/* Timer */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-cyan-400 shadow-lg text-center">
                <div className="flex items-center gap-2">
                  <Clock className={`w-6 h-6 ${timeLeft <= 5 ? 'text-red-500' : 'text-cyan-500'}`} />
                  <span className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-cyan-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
                {streak > 1 && (
                  <motion.div
                    className="text-sm text-green-500 font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                  >
                    🔥 {streak}x Streak!
                  </motion.div>
                )}
              </div>
            </div>

            {/* Question Card */}
            <div className="absolute top-24 left-4 right-4">
              <motion.div
                key={currentQuestion}
                initial={{ x: 100, opacity: 0, rotate: 5 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                className="bg-white rounded-3xl p-5 shadow-xl border-4 border-purple-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">📜</span>
                  <h2 className="text-lg md:text-xl font-bold text-purple-700">
                    {question.question}
                  </h2>
                </div>

                {/* Timer Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-purple-300">
                  <motion.div
                    className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                    animate={{ width: `${(timeLeft / 15) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Answer Options */}
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === question.correctIndex;
                const showResult = selectedAnswer !== null;

                let bgClass = optionColors[index].bg;
                let borderClass = optionColors[index].border;

                if (showResult) {
                  if (isCorrectAnswer) {
                    bgClass = 'from-green-400 to-green-600';
                    borderClass = 'border-green-300';
                  } else if (isSelected) {
                    bgClass = 'from-red-400 to-red-600';
                    borderClass = 'border-red-300';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`relative p-4 bg-gradient-to-br ${bgClass} rounded-2xl border-4 ${borderClass} text-white font-bold text-base shadow-lg ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
                    whileHover={selectedAnswer === null ? { scale: 1.03, y: -3 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={selectedAnswer === null ? { boxShadow: '0 6px 0 rgba(0,0,0,0.2)' } : {}}
                  >
                    <span className="mr-2">{['🅰️', '🅱️', '©️', '🅳'][index]}</span>
                    {option}

                    {showResult && isCorrectAnswer && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                      </motion.div>
                    )}

                    {showResult && isSelected && !isCorrectAnswer && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <X className="w-8 h-8 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-9xl"
                  >
                    {isCorrect ? '✅' : '❌'}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-3xl overflow-hidden border-4 border-blue-300 shadow-2xl"
          >
            {/* Confetti */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%` }}
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: 600,
                  opacity: [0, 1, 1, 0],
                  rotate: 360 * 3
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              >
                {['🧠', '✨', '⭐', '🎉', '📚', '🌟'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-4"
              >
                🎓
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: '3px 3px 0 #4338CA' }}
              >
                TRIAL COMPLETE!
              </motion.h1>

              <motion.div
                className="text-6xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                style={{ textShadow: '4px 4px 0 #7C3AED' }}
              >
                {score} pts
              </motion.div>

              <motion.div
                className="text-xl text-white mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                🧠 You've proven your dental wisdom! 📚
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <StarRating stars={calculateStars(score)} size="lg" />
              </motion.div>

              <motion.button
                onClick={handleComplete}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #059669' }}
              >
                <Trophy className="w-8 h-8" />
                CONTINUE! ➡️
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
