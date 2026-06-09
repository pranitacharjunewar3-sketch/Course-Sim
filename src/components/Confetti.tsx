import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#ec4899', '#f59e0b', '#3b82f6', '#ef4444'];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square';
}

export default function Confetti({ count = 40, duration = 3000 }: { count?: number; duration?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }));
    setParticles(items);

    const t = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(t);
  }, [count, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            backgroundColor: p.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: 720 + p.rotation,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: 'easeIn',
            delay: Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
}
