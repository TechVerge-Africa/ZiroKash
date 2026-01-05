import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoneyPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  char: string;
  color: string;
}

const MONEY_TYPES = [
  { char: '₵', color: 'text-blue-500' },
  { char: '💵', color: 'text-emerald-500' },
  { char: '💰', color: 'text-amber-400' },
  { char: '💸', color: 'text-teal-400' },
  { char: '✨', color: 'text-primary' },
  { char: '🔥', color: 'text-orange-500' }
];

export const MoneyRain: React.FC = () => {
  const [pieces, setPieces] = useState<MoneyPiece[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 2.5 + Math.random() * 3,
      rotation: Math.random() * 720,
      scale: 0.7 + Math.random() * 0.8,
      ...MONEY_TYPES[Math.floor(Math.random() * MONEY_TYPES.length)]
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setIsVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {isVisible && pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -50, x: `${piece.x}vw`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '110vh', 
              opacity: [0, 1, 1, 0],
              rotate: piece.rotation 
            }}
            transition={{ 
              duration: piece.duration, 
              delay: piece.delay,
              ease: "linear",
            }}
            className={`absolute flex items-center justify-center select-none ${piece.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
            style={{ 
              fontSize: `${2 + piece.scale}rem`,
            }}
          >
            {piece.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
