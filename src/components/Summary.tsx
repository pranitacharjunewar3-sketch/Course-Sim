import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, CheckCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const summaryItems = [
  { label: 'Data = Information', desc: 'Kunai pani jankari data ho', color: 'primary' },
  { label: 'Structured Data = Organized Data', desc: 'Row ra column ma milne data .csv .xlsx .sql', color: 'green' },
  { label: 'Unstructured Data = Non-Organized', desc: 'Fixed structure nahune data .jpg .mp4 .pdf', color: 'orange' },
];

const examples = [
  { icon: '📊', label: 'Excel', type: 'Structured', color: 'green' },
  { icon: '🖼️', label: 'Photo', type: 'Unstructured', color: 'orange' },
  { icon: '🗄️', label: 'Database', type: 'Structured', color: 'green' },
  { icon: '🎬', label: 'Video', type: 'Unstructured', color: 'orange' },
];

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: number;
  size: number;
}

export default function Summary() {
  const { setScreen, resetSimulation, score } = useGameStore();
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 40 }, (_, idx) => ({
      id: idx,
      left: Math.random() * 100 + '%',
      color: ['#6366f1', '#22c55e', '#f97316', '#c084fc', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
    }));
    setConfettiPieces(pieces);
  }, []);

  const handleRestart = () => {
    resetSimulation();
    setScreen('intro');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {confettiPieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: '100vh', rotate: 720, opacity: 0 }}
          transition={{ duration: 3, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-lg w-full text-center relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Trophy size={80} className="mx-auto mb-4 text-yellow-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Learning Complete! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary dark:text-text-dark-secondary mb-6"
        >
          Timile data ra data types barema sikihalyo!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="text-3xl font-bold text-primary mb-8"
        >
          Total Score: {score}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3 mb-8"
        >
          {summaryItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
              className={`p-4 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-950/30 border border-${item.color}-200 dark:border-${item.color}-800`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className={`text-${item.color}-600`} />
                <span className="font-semibold">{item.label}</span>
              </div>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {examples.map((ex) => (
            <motion.div
              key={ex.label}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-2xl bg-${ex.color}-50 dark:bg-${ex.color}-950/30 border border-${ex.color}-200 dark:border-${ex.color}-800`}
            >
              <div className="text-2xl mb-1">{ex.icon}</div>
              <span className="font-semibold text-sm">{ex.label}</span>
              <span className={`block text-xs text-${ex.color}-600`}>→ {ex.type}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <RotateCcw size={20} /> Restart Simulation
        </motion.button>
      </motion.div>
    </div>
  );
}
