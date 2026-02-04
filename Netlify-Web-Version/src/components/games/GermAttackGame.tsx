import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { UserAvatar } from '../common/UserAvatar';
import bgImg from '../../assets/mouth_bg.png';
import bugImg from '../../assets/sugar_bug.png';
import { Timer, Trophy, Zap } from 'lucide-react';

interface GermAttackGameProps {
    onComplete: (score: number) => void;
    config: {
        timeLimit?: number;
        spawnRate?: number;
    };
}

interface Germ {
    id: number;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    alive: boolean;
}

export const GermAttackGame: React.FC<GermAttackGameProps> = ({ onComplete, config }) => {
    const { userData } = useGame();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 30);
    const [isGameActive, setIsGameActive] = useState(true);
    const [germs, setGerms] = useState<Germ[]>([]);
    const [germIdCounter, setGermIdCounter] = useState(0);

    // Spawning logic
    useEffect(() => {
        if (!isGameActive) return;
        const spawnInterval = setInterval(() => {
            const newGerm: Germ = {
                id: germIdCounter,
                x: 10 + Math.random() * 80,
                y: -10, // Start above
                speedX: (Math.random() - 0.5) * 2,
                speedY: 1 + Math.random() * 2,
                alive: true
            };
            setGerms((prev: Germ[]) => [...prev, newGerm]);
            setGermIdCounter((c: number) => c + 1);
        }, config.spawnRate || 1000);

        return () => clearInterval(spawnInterval);
    }, [isGameActive, germIdCounter]);

    // Movement & Collision
    useEffect(() => {
        if (!isGameActive) return;
        const moveInterval = setInterval(() => {
            setGerms((prev: Germ[]) => prev.map(g => ({
                ...g,
                x: g.x + g.speedX,
                y: g.y + g.speedY
            })).filter(g => g.y < 110 && g.alive)); // Remove if off screen or dead
        }, 50);

        return () => clearInterval(moveInterval);
    }, [isGameActive]);

    // Timer
    useEffect(() => {
        if (!isGameActive) return;
        if (timeLeft <= 0) {
            onComplete(score);
            setIsGameActive(false);
            return;
        }
        const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isGameActive, score]);

    const zapGerm = (id: number) => {
        setGerms((prev: Germ[]) => prev.map(g => {
            if (g.id === id) {
                setScore((s: number) => s + 20);
                return { ...g, alive: false };
            }
            return g;
        }));
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-blue-50">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* HUD */}
            <div className="absolute top-6 left-4 right-4 flex justify-between z-50">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-blue-100 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <span className="font-extrabold text-blue-900 tracking-tight">{timeLeft}s</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-extrabold text-yellow-900 tracking-tight">{score} 🪙</span>
                </div>
            </div>

            {/* Germs */}
            {germs.map(germ => (
                <div
                    key={germ.id}
                    onClick={() => zapGerm(germ.id)}
                    className="absolute w-16 h-16 cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                    style={{ left: `${germ.x}%`, top: `${germ.y}%` }}
                >
                    <img src={bugImg} alt="Germ" className="w-full h-full object-contain drop-shadow-lg" />
                    <Zap className="absolute inset-0 w-full h-full text-yellow-400 opacity-0 active:opacity-100 transition-opacity" />
                </div>
            ))}

            {/* Hero */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none">
                <UserAvatar
                    characterId={userData.selectedCharacter}
                    showBackground={false}
                    className="w-full h-full drop-shadow-2xl"
                />
            </div>

            <div className="absolute top-24 left-0 w-full text-center pointer-events-none px-10 z-10">
                <p className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-blue-800 font-bold inline-block shadow-md border border-blue-100 text-xs">
                    ⚡ Tap the Sugar Bugs to zap them away!
                </p>
            </div>
        </div>
    );
};
