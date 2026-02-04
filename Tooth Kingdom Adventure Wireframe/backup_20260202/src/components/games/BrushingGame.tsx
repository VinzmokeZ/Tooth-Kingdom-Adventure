import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { UserAvatar } from '../common/UserAvatar';
import bgImg from '../../assets/tooth_kingdom_bg.png';
import { Sparkles, Timer, Trophy } from 'lucide-react';

interface PlaqueSpot {
    id: number;
    x: number;
    y: number;
    cleaned: boolean;
    scale: number;
}

interface BrushingGameProps {
    onComplete: (score: number) => void;
    config: {
        timeLimit?: number;
        plaqueAmount?: number;
    };
}

export const BrushingGame: React.FC<BrushingGameProps> = ({ onComplete, config }) => {
    const { userData } = useGame();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 30);
    const [isGameActive, setIsGameActive] = useState(true);

    // 2D Plaque spots
    const [plaqueSpots, setPlaqueSpots] = useState<PlaqueSpot[]>(() =>
        Array.from({ length: config.plaqueAmount || 12 }, (_, i) => ({
            id: i,
            x: 15 + Math.random() * 70,
            y: 20 + Math.random() * 60,
            cleaned: false,
            scale: 0.8 + Math.random() * 0.5
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

    const handleClean = (id: number) => {
        if (!isGameActive) return;
        setPlaqueSpots((prev: PlaqueSpot[]) => prev.map(spot => {
            if (spot.id === id && !spot.cleaned) {
                setScore((s: number) => s + 10);
                return { ...spot, cleaned: true };
            }
            return spot;
        }));
    };

    const handleGameOver = () => {
        setIsGameActive(false);
        onComplete(score);
    };

    useEffect(() => {
        if (plaqueSpots.every(s => s.cleaned)) {
            handleGameOver();
        }
    }, [plaqueSpots]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-purple-50">
            {/* Background - Flat 2D */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* HUD */}
            <div className="absolute top-6 left-4 right-4 flex justify-between z-50">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-purple-100 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-purple-600" />
                    <span className="font-extrabold text-purple-900 tracking-tight">{timeLeft}s</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-extrabold text-yellow-900 tracking-tight">{score} 🪙</span>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full h-full">
                {plaqueSpots.map(spot => (
                    <div
                        key={spot.id}
                        onMouseEnter={() => handleClean(spot.id)}
                        onPointerDown={() => handleClean(spot.id)}
                        className={`absolute w-16 h-16 cursor-pointer transition-all duration-300 flex items-center justify-center
                            ${spot.cleaned ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}
                        `}
                        style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            transform: `translate(-50%, -50%) scale(${spot.scale})`
                        }}
                    >
                        {!spot.cleaned ? (
                            <div className="w-12 h-12 bg-yellow-200/80 rounded-full blur-md border-4 border-yellow-400 rotate-12 shadow-inner group overflow-hidden">
                                <div className="w-2 h-2 bg-yellow-600 rounded-full absolute top-2 left-2 opacity-30"></div>
                                <div className="w-3 h-3 bg-yellow-700 rounded-full absolute bottom-3 right-4 opacity-20"></div>
                            </div>
                        ) : (
                            <Sparkles className="w-12 h-12 text-yellow-400 animate-ping" />
                        )}
                    </div>
                ))}

                {/* Hero Cursor */}
                <div
                    className="absolute w-20 h-20 pointer-events-none z-30 transition-all duration-75 ease-out"
                    style={{
                        // Note: Hero follows cursor/pointer would need a mouse hook, 
                        // but for simplicity in this 2D view, we can just show the avatar near the center
                        // or have it follow mouse via state if needed.
                        left: '50%',
                        top: '80%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <UserAvatar
                        characterId={userData.selectedCharacter}
                        showBackground={false}
                        className="w-full h-full drop-shadow-xl"
                    />
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-24 w-full text-center px-4 pointer-events-none z-10">
                <p className="bg-white/90 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-xs font-bold text-purple-700 shadow-md border border-purple-100">
                    ✨ Swipe over the plaque spots to clean them!
                </p>
            </div>
        </div>
    );
};
