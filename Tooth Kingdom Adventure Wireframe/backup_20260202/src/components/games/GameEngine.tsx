import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { chapters } from '../../data/chapters';
import { BrushingGame } from './BrushingGame';
import { GermAttackGame } from './GermAttackGame';
import { FlossingGame } from './FlossingGame';
import { FoodSortingGame } from './FoodSortingGame';
import { QuizGame } from './QuizGame';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';

interface GameEngineProps {
    chapterId: number;
    onExit: () => void;
    onComplete: (score: number, stars: number) => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({ chapterId, onExit, onComplete }) => {
    const { userData } = useGame();
    const chapter = chapters.find(c => c.id === chapterId);

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
    const [score, setScore] = useState(0);

    if (!chapter) return <div>Chapter not found</div>;

    const handleGameComplete = (finalScore: number) => {
        setScore(finalScore);
        setGameState('won'); // Simplified for now, can add success/failure logic based on score
    };

    const handleGameWin = () => {
        onComplete(score, chapter.stars);
    };

    // Render the specific game based on type
    const renderGame = () => {
        switch (chapter.gameType) {
            case 'brushing':
                return <BrushingGame onComplete={handleGameComplete} config={chapter.gameConfig} />;
            case 'germs':
                return <GermAttackGame onComplete={handleGameComplete} config={chapter.gameConfig} />;
            case 'flossing':
                return <FlossingGame onComplete={handleGameComplete} config={chapter.gameConfig} />;
            case 'food-sort':
                return <FoodSortingGame onComplete={handleGameComplete} config={chapter.gameConfig} />;
            case 'quiz-master':
                return <QuizGame onComplete={handleGameComplete} config={chapter.gameConfig} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                        <h3 className="text-xl font-bold mb-2">Game Under Construction 🚧</h3>
                        <p>The {chapter.gameType} game is coming soon!</p>
                        <button
                            onClick={() => handleGameComplete(100)}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl"
                        >
                            Simulate Win
                        </button>
                    </div>
                );
        }
    };

    if (gameState === 'intro') {
        return (
            <div className="h-full flex flex-col bg-white">
                <div className="relative h-64">
                    <img
                        src={chapter.illustration}
                        alt={chapter.title}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onExit}
                        className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                        🦷
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{chapter.title}</h2>
                    <p className="text-gray-600 mb-8">{chapter.description}</p>

                    <button
                        onClick={() => setGameState('playing')}
                        className="w-full py-4 bg-purple-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                    >
                        Play Now!
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Excellent Work!</h2>
                <p className="text-xl opacity-90 mb-8">You completed the chapter successfully!</p>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => setGameState('playing')}
                        className="flex-1 py-3 bg-white/20 rounded-xl font-bold backdrop-blur"
                    >
                        Replay
                    </button>
                    <button
                        onClick={handleGameWin}
                        className="flex-1 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    // Playing State
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Game Header */}
            <div className="h-14 bg-white shadow-sm flex items-center justify-between px-4 z-10">
                <button onClick={() => setGameState('intro')} className="p-2">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <span className="font-bold text-gray-900">{chapter.title}</span>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Game Canvas/Container */}
            <div className="flex-1 overflow-hidden relative">
                {renderGame()}
            </div>
        </div>
    );
};
