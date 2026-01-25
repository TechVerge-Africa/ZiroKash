import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  isVisible: boolean;
  className?: string;
}

/**
 * Animated counter component for stats section
 * Animates in when visible with smooth transition
 */
export function AnimatedCounter({ value, isVisible, className = "" }: AnimatedCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`text-3xl sm:text-4xl md:text-5xl font-bold gradient-shimmer ${className}`}
    >
      {value}
    </motion.div>
  );
}
