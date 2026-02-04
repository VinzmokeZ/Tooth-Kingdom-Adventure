import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { UserAvatar } from '../common/UserAvatar';
import bgImg from '../../assets/tooth_kingdom_bg.png';
import { Timer, Trophy, Banana, Cherry, IceCream, Pizza } from 'lucide-react';

interface FoodSortingGameProps {
    onComplete: (score: number) => void;
    config: {
        timeLimit?: number;
    };
}

interface Item {
    id: number;
    x: number;
    y: number;
    type: 'good' | 'bad';
    icon: React.ReactNode;
}

export const FoodSortingGame: React.FC<FoodSortingGameProps> = ({ onComplete, config }) => {
    const { userData } = useGame();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 30);
    const [isGameActive, setIsGameActive] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [itemId, setItemId] = useState(0);
    const [heroX, setHeroX] = useState(50);

    // Spawn items
    useEffect(() => {
        if (!isGameActive) return;
        const interval = setInterval(() => {
            const isGood = Math.random() > 0.4;
            const newItem: Item = {
                id: itemId,
                x: 10 + Math.random() * 80,
                y: -10,
                type: isGood ? 'good' : 'bad',
                icon: isGood
                    ? (Math.random() > 0.5 ? <Banana className="text-yellow-400" /> : <Cherry className="text-red-500" />)
                    : (Math.random() > 0.5 ? <IceCream className="text-pink-400" /> : <Pizza className="text-orange-500" />)
            };
            setItems((prev: Item[]) => [...prev, newItem]);
            setItemId((id: number) => id + 1);
        }, 800);
        return () => clearInterval(interval);
    }, [isGameActive, itemId]);

    // Move items & Collision
    useEffect(() => {
        if (!isGameActive) return;
        const interval = setInterval(() => {
            setItems((prev: Item[]) => {
                const updated = prev.map(item => ({ ...item, y: item.y + 2 }));

                // Collision check
                const collided = updated.filter(item => {
                    // Character is at the bottom, so collision is around y > 85
                    const hit = item.y > 85 && item.y < 95 && Math.abs(item.x - heroX) < 12;
                    if (hit) {
                        if (item.type === 'good') setScore((s: number) => s + 25);
                        else setScore((s: number) => Math.max(0, s - 10));
                    }
                    return !hit && item.y < 110;
                });

                return collided;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isGameActive, heroX]);

    // Timer
    useEffect(() => {
        if (!isGameActive) return;
        if (timeLeft <= 0) {
            setIsGameActive(false);
            onComplete(score);
            return;
        }
        const t = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft, isGameActive, score]);

    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setHeroX(Math.max(10, Math.min(90, x)));
    };

    return (
        <div
            className="w-full h-full relative overflow-hidden bg-orange-50 touch-none"
            onPointerMove={handlePointerMove}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20 sepia-[0.3]"
                style={{ backgroundImage: `url(${bgImg})` }}
            />

            {/* HUD */}
            <div className="absolute top-6 left-4 right-4 flex justify-between z-50">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-orange-100 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-orange-600" />
                    <span className="font-extrabold text-orange-900 tracking-tight">{timeLeft}s</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-extrabold text-yellow-900 tracking-tight">{score} 🪙</span>
                </div>
            </div>

            {/* Falling Items */}
            {items.map(item => (
                <div
                    key={item.id}
                    className="absolute w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-white"
                    style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    {item.icon}
                </div>
            ))}

            <div
                className="absolute bottom-[-10px] w-24 h-24 pointer-events-none transition-all duration-75 ease-out"
                style={{ left: `${heroX}%`, transform: 'translateX(-50%)' }}
            >
                <UserAvatar
                    characterId={userData.selectedCharacter}
                    showBackground={false}
                    className="w-full h-full drop-shadow-2xl"
                />
            </div>

            <div className="absolute top-24 w-full text-center pointer-events-none px-4 z-10">
                <p className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-orange-800 font-bold inline-block shadow-md border border-orange-100 text-xs">
                    🍎 Catch the healthy food, avoid the sweets!
                </p>
            </div>
        </div>
    );
};
