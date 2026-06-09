import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ChevronLeft, Trophy, RefreshCw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { challengeQuestions } from '../utils/fileDetection';

export default function Challenge() {
  const { 
    setScreen, challengeIndex, challengeCorrect, challengeWrong, 
    addChallengeCorrect, addChallengeWrong, nextChallenge, resetChallenge 
  } = useGameStore();
  
  const [selected, setSelected] = useState<'structured' | 'unstructured' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  const question = challengeQuestions[challengeIndex];
  const total = challengeQuestions.length;
  const isLast = challengeIndex >= total - 1;

  const handleAnswer = (answer: 'structured' | 'unstructured') => {
    if (selected) return;
    setSelected(answer);
    setShowResult(true);
    
    if (answer === question.correctAnswer) {
      addChallengeCorrect();
    } else {
      addChallengeWrong();
    }
  };

  const handleNext = () => {
    if (isLast) {
      setDone(true);
    } else {
      nextChallenge();
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    resetChallenge();
    setSelected(null);
    setShowResult(false);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((challengeCorrect / (challengeCorrect + challengeWrong || 1)) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center max-w-md"
        >
          <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold mb-2">Challenge Complete!</h2>
          <div className="text-6xl font-bold text-primary mb-4">{pct}%</div>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-2">
            Sahi: {challengeCorrect} | Galat: {challengeWrong}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={handleRestart} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-all text-sm font-medium">
              <RefreshCw size={16} /> Pheri Khelne
            </button>
            <button onClick={() => { resetChallenge(); setScreen('summary'); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
              Summary <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <button onClick={() => setScreen('unstructured')} className="flex items-center gap-1 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-primary mb-6">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Data Type Guess Gara</h1>
          <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {challengeIndex + 1}/{total}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((challengeIndex) / total) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.fileName}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              {question.fileName.includes('.xl') || question.fileName.includes('.csv') ? '📊' :
               question.fileName.includes('.jp') || question.fileName.includes('.pn') ? '🖼️' :
               question.fileName.includes('.mp3') || question.fileName.includes('.wa') ? '🎵' :
               question.fileName.includes('.mp4') ? '🎬' :
               question.fileName.includes('.sql') ? '🗄️' :
               question.fileName.includes('.pd') ? '📄' :
               question.fileName.includes('.doc') || question.fileName.includes('.txt') ? '📝' :
               question.fileName.includes('.json') ? '📋' : '📁'}
            </div>
            <h2 className="text-3xl font-bold mb-2 font-mono">{question.fileName}</h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-8">
              Yo file kun data type ho?
            </p>

            <div className="flex gap-4 justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer('structured')}
                disabled={!!selected}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all ${
                  selected === 'structured'
                    ? question.correctAnswer === 'structured'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700'
                      : 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700'
                    : 'border-green-300 dark:border-green-700 hover:border-green-500 bg-white dark:bg-card-dark'
                } ${selected ? 'cursor-default' : 'cursor-pointer'}`}
              >
                📊 Structured
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer('unstructured')}
                disabled={!!selected}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all ${
                  selected === 'unstructured'
                    ? question.correctAnswer === 'unstructured'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700'
                      : 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700'
                    : 'border-orange-300 dark:border-orange-700 hover:border-orange-500 bg-white dark:bg-card-dark'
                } ${selected ? 'cursor-default' : 'cursor-pointer'}`}
              >
                🎲 Unstructured
              </motion.button>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl ${
                    selected === question.correctAnswer
                      ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {selected === question.correctAnswer
                      ? <CheckCircle2 size={24} className="text-green-600" />
                      : <XCircle size={24} className="text-red-600" />
                    }
                    <span className={`font-bold text-lg ${
                      selected === question.correctAnswer ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {selected === question.correctAnswer ? '✅ Sahi!' : '❌ Galat!'}
                    </span>
                  </div>
                  <p className="text-sm">{question.reason}</p>
                  <button
                    onClick={handleNext}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLast ? 'Result Herne' : 'Aglo'} <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-6 mt-8 text-sm text-text-secondary dark:text-text-dark-secondary">
          <span className="flex items-center gap-1">✅ Sahi: <strong className="text-green-600">{challengeCorrect}</strong></span>
          <span className="flex items-center gap-1">❌ Galat: <strong className="text-red-600">{challengeWrong}</strong></span>
        </div>
      </motion.div>
    </div>
  );
}
