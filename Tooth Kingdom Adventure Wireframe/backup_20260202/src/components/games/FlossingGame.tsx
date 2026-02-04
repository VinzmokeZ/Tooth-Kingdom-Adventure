import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { UserAvatar } from '../common/UserAvatar';
import bgImg from '../../assets/tooth_kingdom_bg.png';
import { Timer, Trophy, CheckCircle } from 'lucide-react';

interface Gap {
    id: number;
    x: number;
    y: number;
    flossed: boolean;
}

interface FlossingGameProps {
    onComplete: (score: number) => void;
    config: {
        timeLimit?: number;
    };
}

export const FlossingGame: React.FC<FlossingGameProps> = ({ onComplete, config }) => {
    const { userData } = useGame();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 30);
    const [isGameActive, setIsGameActive] = useState(true);

    const [gaps, setGaps] = useState<Gap[]>(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: 10 + i * 11.5,
            y: 50,
            flossed: false
        }))
    );

    useEffect(() => {
        if (!isGameActive) return;
        if (timeLeft <= 0) {
            handleGameOver();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isGameActive]);

    const handleFloss = (id: number) => {
        if (!isGameActive) return;
        setGaps((prev: Gap[]) => prev.map(gap => {
            if (gap.id === id && !gap.flossed) {
                setScore((s: number) => s + 15);
                return { ...gap, flossed: true };
            }
            return gap;
        }));
    };

    const handleGameOver = () => {
        setIsGameActive(false);
        onComplete(score);
    };

    useEffect(() => {
        if (gaps.length > 0 && gaps.every(g => g.flossed)) {
            handleGameOver();
        }
    }, [gaps]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-cyan-50">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 invert-[0.1]"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* HUD */}
            <div className="absolute top-6 left-4 right-4 flex justify-between z-50">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-cyan-100 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-cyan-600" />
                    <span className="font-extrabold text-cyan-900 tracking-tight">{timeLeft}s</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-extrabold text-yellow-900 tracking-tight">{score} 🪙</span>
                </div>
            </div>

            {/* Gaps */}
            <div className="absolute inset-0 flex items-center justify-around px-8">
                {gaps.map(gap => (
                    <div
                        key={gap.id}
                        onClick={() => handleFloss(gap.id)}
                        className={`w-12 h-40 cursor-pointer flex flex-col items-center justify-center transition-all duration-300
                            ${gap.flossed ? 'opacity-40' : 'opacity-100'}
                        `}
                    >
                        {/* 2D Tooth Pillars (Abstract) */}
                        <div className="w-8 h-full bg-white rounded-t-full shadow-inner border-2 border-cyan-100 flex items-center justify-center">
                            {gap.flossed && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hero */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none">
                <UserAvatar
                    characterId={userData.selectedCharacter}
                    showBackground={false}
                    className="w-full h-full drop-shadow-2xl brightness-110"
                />
            </div>

            <div className="absolute top-24 w-full text-center pointer-events-none px-10 z-10">
                <p className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-cyan-800 font-bold inline-block shadow-md border border-cyan-100 text-xs">
                    🦷 Tap the gaps between teeth to floss!
                </p>
            </div>
        </div>
    );
};
