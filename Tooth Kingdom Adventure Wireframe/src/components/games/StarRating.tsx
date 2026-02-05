import { motion } from 'framer-motion';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ stars, maxStars = 3, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180, y: 50 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{
            delay: i * 0.2 + 0.3,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          className="relative"
        >
          {/* Glow effect for earned stars */}
          {i < stars && (
            <motion.div
              className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          <motion.div
            animate={i < stars ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {/* SVG STAR ICON - Using inline generic star if import fails, but here we assume Lucide is available */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={i < stars ? 2 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${sizeClasses[size]} ${i < stars
                ? 'text-yellow-300 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                : 'text-purple-400 fill-purple-600/50 opacity-50'}`}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </motion.div>

          {/* Sparkle on earned stars */}
          {i < stars && (
            <motion.div
              className="absolute -top-2 -right-2 text-lg"
              animate={{ scale: [0, 1, 0], rotate: [0, 180] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              ✨
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
