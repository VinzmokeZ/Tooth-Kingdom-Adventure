import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { UserAvatar } from '../common/UserAvatar';
import bgImg from '../../assets/tooth_kingdom_bg.png';
import { Timer, Trophy, CheckCircle, XCircle, Brain } from 'lucide-react';

interface QuizGameProps {
    onComplete: (score: number) => void;
    config: {
        timeLimit?: number;
    };
}

const QUESTIONS = [
    {
        question: "How many times should you brush your teeth a day?",
        options: ["Once", "Twice", "Never"],
        correct: 1
    },
    {
        question: "How long should you brush for?",
        options: ["10 Seconds", "2 Minutes", "1 Hour"],
        correct: 1
    },
    {
        question: "What helps clean between teeth?",
        options: ["Floss", "Candy", "Soda"],
        correct: 0
    },
    {
        question: "Which food is good for teeth?",
        options: ["Lollipop", "Apple", "Cake"],
        correct: 1
    },
    {
        question: "Who fights the Sugar Bugs?",
        options: ["The Tooth Fairy", "Dentist", "You!"],
        correct: 2
    }
];

export const QuizGame: React.FC<QuizGameProps> = ({ onComplete, config }) => {
    const { userData } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 60);
    const [isGameActive, setIsGameActive] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const question = QUESTIONS[currentQuestionIndex];

    // Timer
    useEffect(() => {
        if (!isGameActive) return;
        if (timeLeft <= 0) {
            handleGameOver();
            return;
        }
        const t = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft, isGameActive]);

    const handleOptionSelect = (idx: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(idx);

        const isCorrect = idx === question.correct;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) setScore((s: number) => s + 20);

        setTimeout(() => {
            if (currentQuestionIndex < QUESTIONS.length - 1) {
                setCurrentQuestionIndex((prev: number) => prev + 1);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                handleGameOver();
            }
        }, 1200);
    };

    const handleGameOver = () => {
        setIsGameActive(false);
        onComplete(score);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-indigo-50">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* HUD */}
            <div className="absolute top-6 left-4 right-4 flex justify-between z-50">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-indigo-100 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-indigo-600" />
                    <span className="font-extrabold text-indigo-900 tracking-tight">{timeLeft}s</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-extrabold text-yellow-900 tracking-tight">{score} 🪙</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="absolute top-24 left-6 right-6 bg-white rounded-3xl p-6 shadow-xl border-2 border-indigo-100 flex flex-col items-center text-center animate-bounce-in">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
                    <Brain className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">{question.question}</h2>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                </span>
            </div>

            {/* Options */}
            <div className="absolute bottom-32 left-6 right-6 space-y-3">
                {question.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-between
                                ${isSelected
                                    ? (feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                    : 'bg-white text-gray-800 shadow-md border-2 border-transparent hover:border-indigo-200'}
                            `}
                        >
                            <span>{opt}</span>
                            {isSelected && (feedback === 'correct' ? <CheckCircle /> : <XCircle />)}
                        </button>
                    );
                })}
            </div>

            {/* Hero */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none">
                <UserAvatar
                    characterId={userData.selectedCharacter}
                    showBackground={false}
                    className={`w-full h-full drop-shadow-2xl ${feedback === 'correct' ? 'animate-bounce' : feedback === 'wrong' ? 'animate-shake' : ''}`}
                />
            </div>
        </div>
    );
};
