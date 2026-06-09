import { motion } from 'framer-motion';
import { ArrowRight, Brain, User, Monitor, Database, FileType } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const steps = [
  { icon: User, label: 'Manche', color: '#6366f1' },
  { icon: FileType, label: 'Jankari', color: '#06b6d4' },
  { icon: Monitor, label: 'Computer', color: '#8b5cf6' },
  { icon: Brain, label: 'Result', color: '#22c55e' },
];

const examples = ['Naam', 'Photo', 'Video', 'Excel', 'Audio', 'Document'];

export default function Screen1() {
  const { setScreen } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Database size={16} />
          Interactive Data Types Simulation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Data K Ho?
        </h1>

        <p className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
          Data bhaneko kunai pani jankari ho jun computer le bujhna ra process garna sakcha.
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg mb-2"
                style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
              >
                <step.icon size={32} color={step.color} />
              </motion.div>
              <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">{step.label}</span>
              {i < steps.length - 1 && (
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                  className="hidden md:block absolute ml-20"
                >
                  <ArrowRight size={20} className="text-primary/40" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {examples.map((ex, i) => (
            <motion.span
              key={ex}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, type: 'spring' }}
              className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-border-light dark:border-border-dark text-sm font-medium shadow-sm"
            >
              {ex}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('data-types')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            📊 Data Types Sikne
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('programming')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            💻 Programming Sikne
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('ml')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            🤖 ML Sikne
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('algorithms')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            🧠 Algorithms Sikne
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
