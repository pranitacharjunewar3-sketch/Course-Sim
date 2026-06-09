import { Moon, Sun, Home, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { Screen } from '../types';

const screenNames: Record<Screen, string> = {
  intro: 'Data K Ho',
  'data-types': 'Data Types',
  structured: 'Structured',
  unstructured: 'Unstructured',
  simulation: 'Simulation',
  challenge: 'Challenge',
  'final-sim': 'Final Sim',
  summary: 'Summary',
  programming: 'Programming',
  algorithms: 'Algorithms',
  ml: 'Machine Learning',
};

export default function Navbar() {
  const { theme, toggleTheme, screen, setScreen, score } = useGameStore();

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-border-light dark:border-border-dark"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('intro')}
            className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            <Home size={18} className="text-primary" />
            Data Types Sim
          </button>
          {screen !== 'intro' && (
            <span className="hidden sm:inline text-sm text-text-secondary dark:text-text-dark-secondary">
              / {screenNames[screen]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {score > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium"
            >
              <Trophy size={14} />
              {score}
            </motion.div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-yellow-400" />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
