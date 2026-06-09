import { Suspense, lazy } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import Navbar from './components/Navbar';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import SimulationScreen from './components/SimulationScreen';
import Challenge from './components/Challenge';
import Summary from './components/Summary';
import ErrorBoundary from './components/ErrorBoundary';

const ProgrammingSimulation = lazy(() => import('./programming/ProgrammingSimulation'));
const AlgorithmsSimulation = lazy(() => import('./algorithms/AlgorithmsSimulation'));
const MachineLearningSimulation = lazy(() => import('./ml/MachineLearningSimulation'));

const screenVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { screen, theme } = useGameStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-surface-dark dark:via-surface-dark dark:to-slate-900 text-text-primary dark:text-text-dark transition-colors duration-300">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {screen === 'intro' && <Screen1 />}
              {screen === 'data-types' && <Screen2 />}
              {screen === 'simulation' && (
                <ErrorBoundary><SimulationScreen /></ErrorBoundary>
              )}
              {screen === 'challenge' && <Challenge />}
              {screen === 'summary' && <Summary />}
              {screen === 'programming' && (
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <ProgrammingSimulation />
                  </Suspense>
                </ErrorBoundary>
              )}
              {screen === 'algorithms' && (
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <AlgorithmsSimulation />
                  </Suspense>
                </ErrorBoundary>
              )}
              {screen === 'ml' && (
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <MachineLearningSimulation />
                  </Suspense>
                </ErrorBoundary>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
}
