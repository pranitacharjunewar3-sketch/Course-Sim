import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, FileType2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function Screen2() {
  const { setScreen } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Data ko Mukhya Prakar
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary">
          Data dui mukhya prakar ma bibhajit huncha
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -8 }}
          onClick={() => setScreen('simulation')}
          className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-3xl p-8 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
            <LayoutGrid size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">Structured Data</h2>
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-4">
            Organized data jo row ra column ma sajilo sanga rakhna milcha
          </p>
          <div className="flex flex-wrap gap-2">
            {['Excel', 'CSV', 'Database', 'JSON', 'XML'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 text-green-600 dark:text-green-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Explore <ArrowRight size={16} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -8 }}
          onClick={() => setScreen('simulation')}
          className="group cursor-pointer bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-950/30 dark:to-rose-950/30 rounded-3xl p-8 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4">
            <FileType2 size={32} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-orange-700 dark:text-orange-400">Unstructured Data</h2>
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-4">
            Non-organized data jasma fixed structure hudaina
          </p>
          <div className="flex flex-wrap gap-2">
            {['Image', 'Video', 'Audio', 'PDF', 'Text'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Explore <ArrowRight size={16} />
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setScreen('simulation')}
        className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        Simulation Suru Garne
        <ArrowRight size={18} />
      </motion.button>
    </div>
  );
}
