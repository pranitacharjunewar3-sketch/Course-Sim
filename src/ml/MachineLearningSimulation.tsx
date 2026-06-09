import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Trophy, Play, ArrowRight, CheckCircle2,
  Cpu, Award, GripVertical, Sparkles, Zap, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Confetti from '../components/Confetti';

type MlScreen = 'intro' | 'human' | 'train' | 'predict' | 'data' | 'classify' | 'quality' | 'progress' | 'build' | 'real' | 'final';

const SCREENS: MlScreen[] = ['intro', 'human', 'train', 'predict', 'data', 'classify', 'quality', 'progress', 'build', 'real', 'final'];
const SCREEN_LABELS: Record<MlScreen, string> = {
  intro: 'Introduction', human: 'Human vs Machine', train: 'Training',
  predict: 'Prediction', data: 'Data Effect', classify: 'Classification',
  quality: 'Data Quality', progress: 'Progress', build: 'Build Your Own',
  real: 'Real Life', final: 'Complete',
};

function getMlLevel(xp: number) {
  if (xp >= 100) return { name: 'ML Master', icon: '👑', color: '#8b5cf6' };
  if (xp >= 50) return { name: 'ML Explorer', icon: '🔍', color: '#06b6d4' };
  return { name: 'ML Beginner', icon: '🌱', color: '#22c55e' };
}

const trainingExamples = [
  { id: '1', emoji: '🍎', color: 'Red', label: 'Apple' },
  { id: '2', emoji: '🍌', color: 'Yellow', label: 'Banana' },
  { id: '3', emoji: '🍎', color: 'Red', label: 'Apple' },
  { id: '4', emoji: '🍌', color: 'Yellow', label: 'Banana' },
];

const screenVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.97 },
};

/* ===== Confirmation Modal ===== */
function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border-light dark:border-border-dark">
        <AlertTriangle size={36} className="mx-auto text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border-2 border-border-light font-medium text-sm hover:bg-gray-50 dark:hover:bg-card-dark transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm shadow-lg">
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ===== 1: Intro ===== */
function IntroMl({ onNext }: { onNext: () => void }) {
  const flowSteps = ['📊 Data', '🧠 Learning', '🎯 Prediction'];
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center" role="region" aria-label="Introduction">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium mb-6">
          <Cpu size={16} aria-hidden="true" /> Interactive ML Simulation
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          Machine Learning K Ho?
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-8 leading-relaxed">
          Machine Learning bhaneko <strong>computer lai example dekhayera sikhaune process</strong> ho.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
            <span className="text-3xl block mb-1" aria-hidden="true">👤</span>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Manche: Rule banauncha</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <span className="text-3xl block mb-1" aria-hidden="true">🤖</span>
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400">Machine: Pattern sikcha</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-8" role="list" aria-label="ML flow steps">
          {flowSteps.map((s, i) => (
            <div key={s} className="flex flex-col items-center" role="listitem">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md text-lg"
                style={{ background: '#8b5cf615', border: '2px solid #8b5cf630' }}
                aria-label={s}
              >
                {s.split(' ')[0]}
              </motion.div>
              <span className="text-[10px] font-medium mt-1">{s.split(' ').slice(1).join(' ')}</span>
              {i < flowSteps.length - 1 && <ArrowRight size={14} className="text-purple-400 mt-1" aria-hidden="true" />}
            </div>
          ))}
        </div>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Start Machine Learning lesson"
        >
          Machine Learning Sikna Suru Gara <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ===== 2: Human vs Machine ===== */
function HumanMl({ onNext }: { onNext: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStage(p => { if (p >= 2) { clearInterval(t); return p; } return p + 1; }), 800);
    return () => clearInterval(t);
  }, []);

  const humanSteps = ['📖 Book', '✏️ Practice', '📝 Exam'];
  const mlSteps = ['📊 Data', '⚙️ Training', '🎯 Prediction'];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Human vs Machine learning comparison">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        Manche Ra Machine Kasari Sikcha?
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-8">Dui tira compare gara — same process!</p>
      <div className="grid md:grid-cols-2 gap-6 max-w-xl w-full mb-6">
        {[
          { title: '👦 Student', steps: humanSteps, color: '#6366f1', bg: 'indigo' },
          { title: '🤖 Machine', steps: mlSteps, color: '#8b5cf6', bg: 'purple' },
        ].map((side, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, x: si === 0 ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl border-2"
            style={{ borderColor: side.color + '30', background: side.color + '08' }}
            role="region"
            aria-label={side.title}
          >
            <h2 className="text-xl font-bold mb-4 text-center">{side.title}</h2>
            <div className="space-y-3">
              {side.steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: i <= stage ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${i <= stage ? 'shadow-md' : 'opacity-30'}`}
                  style={{ borderColor: i <= stage ? side.color : '#e2e8f0', background: i <= stage ? side.color + '15' : '' }}
                  role="listitem"
                  aria-current={i === stage ? 'step' : undefined}
                >
                  <span className="text-lg" aria-hidden="true">{s.split(' ')[0]}</span>
                  <span>{s}</span>
                  {i < stage && <CheckCircle2 size={16} className="ml-auto" style={{ color: side.color }} aria-hidden="true" />}
                  {i === stage && <span className="ml-auto text-[10px] font-bold" style={{ color: side.color }}>◀ active</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-4"
      >
        Computer le ni example bata sikna sakcha! 🤯
      </motion.p>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Machine Lai Sikau <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ===== 3: Training ===== */
function TrainMl({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [trainedItems, setTrainedItems] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id && !trainedItems.includes(id)) {
      setTrainedItems(p => [...p, id]);
    }
  };

  const trainModel = () => {
    if (trainedItems.length < 2 || training) return;
    setTraining(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 5;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTraining(false);
          setDone(true);
          addXp(20);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Training simulation">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        🏋️ Machine Lai Sikau
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Examples lai TRAIN area ma drag gara</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-xl w-full mb-6">
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border p-3" role="region" aria-label="Available examples">
          <h3 className="text-xs font-bold mb-3">📦 Examples:</h3>
          <div className="space-y-2" role="list" aria-label="Draggable training examples">
            {trainingExamples.filter(e => !trainedItems.includes(e.id)).map(e => (
              <div
                key={e.id}
                draggable
                onDragStart={(ev) => handleDragStart(ev, e.id)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium cursor-grab active:cursor-grabbing border border-purple-200 bg-purple-50 dark:bg-purple-950/30 select-none"
                role="listitem"
                aria-label={`Drag ${e.emoji} ${e.color} ${e.label}`}
                tabIndex={0}
                onKeyDown={(ev) => { if (ev.key === 'Enter') handleDrop(ev as unknown as React.DragEvent); }}
              >
                <GripVertical size={12} className="text-purple-400" aria-hidden="true" />
                <span className="text-xl" aria-hidden="true">{e.emoji}</span>
                <span>{e.color} → <strong>{e.label}</strong></span>
              </div>
            ))}
            {trainingExamples.filter(e => !trainedItems.includes(e.id)).length === 0 && (
              <p className="text-xs text-green-600 font-medium text-center py-4">✅ All examples trained!</p>
            )}
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`min-h-[220px] rounded-2xl border-2 border-dashed p-3 transition-all ${
            dragOver ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 scale-[1.02]' : 'border-border-light bg-white/40 dark:bg-card-dark/40'
          }`}
          role="region"
          aria-label="Training area - drop examples here"
          aria-dropeffect="move"
        >
          <h3 className="text-xs font-bold mb-3">🎯 TRAINING BOX</h3>
          {trainedItems.length === 0 && (
            <p className="text-xs text-text-secondary text-center py-8">Yaha drag gara</p>
          )}
          <div className="space-y-2" role="list" aria-label="Trained examples">
            {trainingExamples.filter(e => trainedItems.includes(e.id)).map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium border border-purple-300 bg-purple-50 dark:bg-purple-950/30"
                role="listitem"
              >
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                <span className="text-lg" aria-hidden="true">{e.emoji}</span>
                <span>{e.color} → {e.label}</span>
                {training && <Sparkles size={14} className="ml-auto text-purple-500 animate-pulse" aria-hidden="true" />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {training && (
        <div className="w-full max-w-md mb-4">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
            <span>Training Progress</span>
            <span className="font-bold text-purple-600" role="status" aria-label={`${progress} percent complete`}>{progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-secondary mt-1">
            <span>🧠 Learning</span>
            <span>🔍 Pattern Detect</span>
            <span>✅ Mastered</span>
          </div>
        </div>
      )}

      {!training && !done && trainedItems.length >= 2 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={trainModel}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Start training the model"
        >
          <Play size={16} aria-hidden="true" /> TRAIN MODEL
        </motion.button>
      )}

      {done && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-4xl mb-2" aria-hidden="true">✅</div>
          <p className="font-bold text-green-600 text-lg">Machine Ready! +20 XP</p>
          <p className="text-xs text-text-secondary mt-1">Computer le examples bata pattern sikyoo!</p>
          <button
            onClick={onNext}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Test Gara <ChevronRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 4: Prediction ===== */
function PredictMl({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [answer, setAnswer] = useState<'Apple' | 'Banana' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!showResult) return;
    const t = setInterval(() => setStage(p => { if (p >= 2) { clearInterval(t); return p; } return p + 1; }), 500);
    return () => clearInterval(t);
  }, [showResult]);

  const predict = (ans: 'Apple' | 'Banana') => {
    if (showResult) return;
    setAnswer(ans);
    setShowResult(true);
    if (ans === 'Apple') addXp(10);
  };

  const flowSteps = ['📥 Input', '🔍 Compare', '🎯 Predict'];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Prediction test">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        Machine Le K Sikyo? 🤔
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Naya object dekhaucha — predict gara!</p>

      <motion.div
        key={showResult ? 'result' : 'question'}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center mb-6"
      >
        <div className="text-8xl mb-2" aria-hidden="true">🍎</div>
        <p className="text-lg font-bold">Red</p>
      </motion.div>

      {!showResult && (
        <div className="flex gap-3 mb-6" role="group" aria-label="Choose your prediction">
          <button
            onClick={() => predict('Apple')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:shadow-xl transition-all"
          >
            🍎 Apple
          </button>
          <button
            onClick={() => predict('Banana')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 hover:shadow-xl transition-all"
          >
            🍌 Banana
          </button>
        </div>
      )}

      {showResult && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4" role="list" aria-label="Prediction flow">
            {flowSteps.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0 }}
                animate={{ opacity: i <= stage ? 1 : 0.3 }}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${i <= stage ? 'shadow-md' : ''}`}
                style={{ background: i <= stage ? '#8b5cf615' : '' }}
                role="listitem"
              >
                <span className="text-xl" aria-hidden="true">{s.split(' ')[0]}</span>
                <span className="text-[10px] font-medium">{s.split(' ').slice(1).join(' ')}</span>
                {i < flowSteps.length - 1 && <ArrowRight size={10} className="text-purple-400" aria-hidden="true" />}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 }}
            className="p-6 rounded-2xl border-2 border-green-300 bg-green-50 dark:bg-green-950/30"
          >
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">🍎 Apple</p>
            <p className="text-lg font-bold text-green-600 mt-1">
              {answer === 'Apple' ? '✅ Sahi!' : '❌ Galat'} — 95% Confidence
            </p>
            {answer === 'Apple' && <p className="text-xs text-green-500 mt-1">+10 XP</p>}
            <p className="text-xs text-text-secondary mt-2">Machine example bata sikeko ho</p>
          </motion.div>

          <button
            onClick={onNext}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Data Effect Herne <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== 5: Data Effect ===== */
function DataMl({ onNext }: { onNext: () => void }) {
  const [dataSize, setDataSize] = useState(5);
  const accuracy = dataSize === 5 ? 50 : dataSize === 20 ? 80 : 95;
  const points = [5, 20, 100];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Data size effect on accuracy">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        Data Badhyo Bhane 📈
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Training data adjust gara — accuracy ma effect hera</p>

      <div className="max-w-md w-full mb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Training Data: <span className="text-purple-600">{dataSize}</span></span>
            <span className="text-2xl" aria-hidden="true">{dataSize <= 5 ? '📉' : dataSize >= 100 ? '📈' : '📊'}</span>
          </div>
          <div className="flex gap-2" role="radiogroup" aria-label="Select training data size">
            {points.map(p => (
              <button
                key={p}
                onClick={() => setDataSize(p)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                  dataSize === p
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 shadow-md'
                    : 'border-border-light bg-white/50 dark:bg-card-dark/50 hover:border-purple-300'
                }`}
                role="radio"
                aria-checked={dataSize === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-2xl border-2 text-center"
          style={{ borderColor: '#8b5cf630', background: '#8b5cf610' }}
        >
          <div
            className="text-5xl font-black mb-2"
            style={{ color: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }}
            role="status"
            aria-label={`Accuracy ${accuracy} percent`}
          >
            {accuracy}%
          </div>
          <p className="text-sm font-medium text-text-secondary">Prediction Accuracy</p>
          <div className="w-full h-3 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${accuracy}%` }}
              style={{ background: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }}
              transition={{ duration: 0.5 }}
              role="progressbar"
              aria-valuenow={accuracy}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <motion.p
          key={dataSize}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-medium"
        >
          {dataSize === 5 ? '💡 Thorai data = Limited learning' : dataSize === 20 ? '👍 Better data = Better result' : '🔥 Dherai data = Ramro Machine Learning!'}
        </motion.p>
      </div>

      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Classify Gara <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ===== 6: Classification ===== */
function ClassifyMl({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const items = [
    { id: '1', emoji: '🐱', label: 'Cat' },
    { id: '2', emoji: '🐶', label: 'Dog' },
    { id: '3', emoji: '🐱', label: 'Cat' },
    { id: '4', emoji: '🐶', label: 'Dog' },
  ];
  const testItems = [
    { emoji: '🐱', label: 'Cat' },
    { emoji: '🐶', label: 'Dog' },
  ];

  const [trained, setTrained] = useState<string[]>([]);
  const [phase, setPhase] = useState<'train' | 'test' | 'done'>('train');
  const [testIdx, setTestIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const bonusRef = useRef(false);

  const train = (id: string) => {
    if (trained.includes(id) || phase !== 'train') return;
    const newTrained = [...trained, id];
    setTrained(newTrained);
    if (newTrained.length === items.length) {
      setTimeout(() => setPhase('test'), 400);
    }
  };

  const answer = (ans: string) => {
    if (selected || phase !== 'test') return;
    setSelected(ans);
    const correct = ans === testItems[testIdx].label;
    if (correct) {
      setScore(p => p + 1);
      addXp(5);
    }
    const newScore = score + (correct ? 1 : 0);
    setTimeout(() => {
      setSelected(null);
      if (testIdx >= testItems.length - 1) {
        setPhase('done');
        if (newScore >= 2 && !bonusRef.current) {
          bonusRef.current = true;
          addXp(5);
        }
      } else {
        setTestIdx(p => p + 1);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Classification game">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        🔤 Classify Gara
      </h1>

      {phase === 'train' && (
        <>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Cards click gare train gara machine lai</p>
          <div className="flex flex-wrap gap-3 justify-center mb-6" role="group" aria-label="Training cards">
            {items.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => train(item.id)}
                disabled={trained.includes(item.id)}
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 text-sm font-bold transition-all ${
                  trained.includes(item.id)
                    ? 'border-green-400 bg-green-50 dark:bg-green-950/30 cursor-default'
                    : 'border-border-light bg-white/60 dark:bg-card-dark/60 hover:border-purple-300 cursor-pointer'
                }`}
                aria-label={`${trained.includes(item.id) ? 'Trained' : 'Train'} ${item.emoji} ${item.label}`}
                aria-pressed={trained.includes(item.id)}
              >
                <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                <span className="text-[10px] mt-1">{item.label}</span>
                {trained.includes(item.id) && <CheckCircle2 size={12} className="text-green-500" aria-hidden="true" />}
              </motion.button>
            ))}
          </div>
          {trained.length > 0 && (
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(trained.length / items.length) * 100}%` }}
              />
            </div>
          )}
          <p className="text-xs text-text-secondary mt-2" role="status">{trained.length}/{items.length} trained</p>
        </>
      )}

      {phase === 'test' && (
        <>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
            Score: <span className="font-bold text-purple-600">{score}</span> / {testIdx + (selected ? 1 : 0)}
          </p>
          <motion.div
            key={testIdx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4"
          >
            <div className="text-7xl mb-2" aria-hidden="true">{testItems[testIdx].emoji}</div>
            <p className="text-sm font-medium text-text-secondary">Yo k ho?</p>
          </motion.div>
          <div className="flex gap-3" role="group" aria-label="Choose classification">
            {['Cat', 'Dog'].map(a => (
              <button
                key={a}
                onClick={() => answer(a)}
                disabled={selected !== null}
                className={`px-6 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  selected === a
                    ? (a === testItems[testIdx].label ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-border-light bg-white/60 dark:bg-card-dark/60 hover:border-purple-300'
                }`}
                aria-label={`${selected === a ? (a === testItems[testIdx].label ? 'Correct' : 'Wrong') : ''} ${a}`}
              >
                {a === 'Cat' ? '🐱' : '🐶'} {a}
              </button>
            ))}
          </div>
          {selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-3 text-sm font-bold ${selected === testItems[testIdx].label ? 'text-green-600' : 'text-red-500'}`}
            >
              {selected === testItems[testIdx].label ? '✅ Sahi!' : '❌ Galat'}
            </motion.p>
          )}
        </>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <Award size={64} className="mx-auto text-yellow-500 mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-2">Classification Done!</h2>
          <p className="text-4xl font-bold text-purple-600 mb-2">{score}/2 Sahi</p>
          <p className="text-sm text-text-secondary mb-4">Machine le classify garna sikyo!</p>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Data Quality <ChevronRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 7: Data Quality ===== */
function QualityMl({ onNext }: { onNext: () => void }) {
  const [cleanBusy, setCleanBusy] = useState(false);
  const [mixedBusy, setMixedBusy] = useState(false);
  const [cleanResult, setCleanResult] = useState<number | null>(null);
  const [mixedResult, setMixedResult] = useState<number | null>(null);

  const trainData = (side: 'clean' | 'mixed') => {
    if (side === 'clean' && cleanBusy) return;
    if (side === 'mixed' && mixedBusy) return;
    if (side === 'clean') setCleanBusy(true);
    else setMixedBusy(true);
    setTimeout(() => {
      if (side === 'clean') { setCleanResult(90); setCleanBusy(false); }
      else { setMixedResult(40); setMixedBusy(false); }
    }, 1500);
  };

  const bothDone = cleanResult !== null && mixedResult !== null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Data quality comparison">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        📊 Data Quality
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Clean vs Mixed data — compare gara</p>

      <div className="grid md:grid-cols-2 gap-4 max-w-xl w-full mb-6">
        {[
          {
            title: '✨ Clean Data', color: '#22c55e', side: 'clean' as const,
            data: ['🍎 Red → Apple', '🍌 Yellow → Banana', '🍎 Red → Apple', '🍌 Yellow → Banana'],
            busy: cleanBusy, result: cleanResult,
          },
          {
            title: '💥 Mixed Data', color: '#ef4444', side: 'mixed' as const,
            data: ['🍎 Red → Apple', '🍌 Yellow → Dog', '🍏 Green → Banana', '🍌 Yellow → Apple'],
            busy: mixedBusy, result: mixedResult,
          },
        ].map(side => (
          <motion.div
            key={side.side}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border-2"
            style={{ borderColor: side.color + '30', background: side.color + '08' }}
          >
            <h3 className="font-bold text-sm mb-2">{side.title}</h3>
            <div className="space-y-1 mb-3">
              {side.data.map((d, i) => (
                <div key={i} className="text-[10px] px-2 py-1 rounded-lg bg-white/50 dark:bg-card-dark/50">{d}</div>
              ))}
            </div>
            {side.result === null && !side.busy && !(side.side === 'clean' ? mixedBusy : cleanBusy) && (
              <button onClick={() => trainData(side.side)}
                className="w-full py-2 rounded-xl text-xs font-bold text-white shadow hover:opacity-90 transition-opacity"
                style={{ background: side.color }}
              >
                Train {side.title.split(' ')[1]} Data
              </button>
            )}
            {side.busy && (
              <div className="text-center py-2">
                <div className="text-xs text-text-secondary animate-pulse">🔄 Training...</div>
              </div>
            )}
            {side.result !== null && (
              <div className="text-center py-2">
                <span className="text-2xl font-black" style={{ color: side.color }}>{side.result}%</span>
                <p className="text-[10px] text-text-secondary">Accuracy</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {bothDone && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 max-w-sm">
          <p className="font-bold text-purple-700 dark:text-purple-400">Ramro data → Ramro Machine Learning! 🎯</p>
          <button
            onClick={onNext}
            className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Progress Herne <ChevronRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 8: Progress ===== */
function ProgressMl({ onNext }: { onNext: () => void }) {
  const rounds = [
    { round: 1, accuracy: 40, emoji: '🧠', size: 40 },
    { round: 2, accuracy: 70, emoji: '🧠', size: 56 },
    { round: 3, accuracy: 95, emoji: '🧠', size: 72 },
  ];
  const [showRound, setShowRound] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setShowRound(p => { if (p >= 3) { clearInterval(t); return 3; } return p + 1; }), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Learning progress">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        🧠 Machine Kasari Sudhrincha?
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Practice gardai gayo — accuracy badhdai jancha</p>

      <div className="space-y-4 max-w-sm w-full mb-6" role="list" aria-label="Training rounds">
        {rounds.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: i < showRound ? 1 : 0.2, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: i < showRound ? '#8b5cf640' : '#e2e8f0',
              background: i < showRound ? '#8b5cf610' : '',
            }}
            role="listitem"
            aria-label={`Round ${r.round}: ${r.accuracy}% accuracy`}
          >
            <motion.span
              animate={{ scale: i < showRound ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
              aria-hidden="true"
            >
              {r.emoji}
            </motion.span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Round {r.round}</span>
                <span className="font-bold" style={{ color: r.accuracy >= 80 ? '#22c55e' : '#f59e0b' }}>{r.accuracy}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: i < showRound ? `${r.accuracy}%` : '0%' }}
                  style={{ background: r.accuracy >= 80 ? '#22c55e' : '#f59e0b' }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showRound >= 3 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Aafno Machine Bana <ChevronRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 9: Build Your Own ===== */
function BuildMl({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const fruits = [
    { emoji: '🍎', color: 'Red', label: 'Apple' },
    { emoji: '🍌', color: 'Yellow', label: 'Banana' },
    { emoji: '🍊', color: 'Orange', label: 'Orange' },
  ];

  const [phase, setPhase] = useState<'select' | 'train' | 'predict' | 'done'>('select');
  const [trainData, setTrainData] = useState<number[]>([]);
  const [testItem, setTestItem] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);

  const startFruit = () => {
    setPhase('train');
  };

  const trainItem = (i: number) => {
    if (trainData.includes(i) || phase !== 'train') return;
    const newData = [...trainData, i];
    setTrainData(newData);
    if (newData.length === fruits.length) {
      setTimeout(() => { setPhase('predict'); setTestItem(Math.floor(Math.random() * 3)); }, 500);
    }
  };

  const runPredict = () => {
    if (predicting) return;
    setPredicting(true);
    setTimeout(() => {
      setPrediction(fruits[testItem].label);
      addXp(15);
      setPredicting(false);
      setPhase('done');
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Build your own ML model">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        🔧 Aafno Machine Bana
      </h1>

      {phase === 'select' && (
        <>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Problem choose gara:</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startFruit}
            className="px-10 py-6 rounded-2xl border-2 border-purple-300 bg-purple-50 dark:bg-purple-950/30 text-center hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Choose Fruit Classifier problem"
          >
            <span className="text-5xl block mb-2" aria-hidden="true">🍎🍌🍊</span>
            <span className="font-bold">Fruit Classifier</span>
            <p className="text-xs text-text-secondary mt-1">Color → Fruit prediction</p>
          </motion.button>
        </>
      )}

      {phase === 'train' && (
        <>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Train data click gara:</p>
          <div className="flex flex-wrap gap-3 justify-center mb-6" role="group" aria-label="Training examples">
            {fruits.map((f, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => trainItem(i)}
                disabled={trainData.includes(i)}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 text-sm font-bold transition-all ${
                  trainData.includes(i)
                    ? 'border-green-400 bg-green-50 dark:bg-green-950/30 cursor-default'
                    : 'border-border-light bg-white/60 dark:bg-card-dark/60 hover:border-purple-300 cursor-pointer'
                }`}
                aria-label={`${trainData.includes(i) ? 'Trained' : 'Train'} ${f.emoji} ${f.color} ${f.label}`}
                aria-pressed={trainData.includes(i)}
              >
                <span className="text-4xl" aria-hidden="true">{f.emoji}</span>
                <span className="text-[10px] mt-1">{f.color}</span>
                {trainData.includes(i) && <CheckCircle2 size={12} className="text-green-500" aria-hidden="true" />}
              </motion.button>
            ))}
          </div>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(trainData.length / fruits.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary" role="status">{trainData.length}/{fruits.length} trained</p>
        </>
      )}

      {phase === 'predict' && (
        <>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Test item hera — predict gara!</p>
          <motion.div
            key={testItem}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4"
          >
            <div className="text-7xl mb-2" aria-hidden="true">{fruits[testItem].emoji}</div>
            <p className="text-sm font-medium">Color: <strong>{fruits[testItem].color}</strong></p>
          </motion.div>
          {predicting ? (
            <div className="flex items-center gap-2 px-6 py-3 text-purple-600 font-semibold">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Zap size={20} />
              </motion.div>
              Predicting...
            </div>
          ) : (
            <button
              onClick={runPredict}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Zap size={16} aria-hidden="true" /> Predict Gara
            </button>
          )}
          {prediction && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-center">
              <p className="text-xl font-bold text-purple-600">Prediction: {prediction}!</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-lg" aria-hidden="true">
                <span>📥</span><ArrowRight size={12} /><span>🧠</span><ArrowRight size={12} /><span>🎯</span>
              </div>
            </motion.div>
          )}
        </>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-5xl mb-4" aria-hidden="true">🎉</div>
          <p className="font-bold text-green-600 text-lg">Aafno Machine Ready! +15 XP</p>
          <p className="text-xs text-text-secondary mt-1">Timile afno ML model banayoo!</p>
          <button
            onClick={onNext}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Real Life Examples <ChevronRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 10: Real Life ===== */
function RealMl({ onNext }: { onNext: () => void }) {
  const examples = [
    { emoji: '🎬', title: 'Movie Recommendation', desc: 'Netflix le timi lai movie suggest garcha', sim: 'Timile action movie heryo → Machine suggests action movies' },
    { emoji: '📧', title: 'Spam Detection', desc: 'Gmail le spam email identify garcha', sim: 'Machine le spam words detect garera filter garcha' },
    { emoji: '📷', title: 'Face Unlock', desc: 'Phone le timro face recognize garcha', sim: 'Camera le timro face data collect garera match garcha' },
    { emoji: '🗣', title: 'Voice Assistant', desc: 'Siri/Alexa le timro voice bujhcha', sim: 'Voice pattern analyze garera command execute garcha' },
    { emoji: '🛒', title: 'Shopping Suggestion', desc: 'Amazon le product suggest garcha', sim: 'Pahile kineko based ma naya product recommend garcha' },
  ];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" role="region" aria-label="Real life ML examples">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
        Hami Le Din Dinai Use Garne ⭐
      </h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Tap card → simulation hera</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg w-full mb-6" role="list" aria-label="ML examples">
        {examples.map((ex, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -4 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
              selected === i ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg' : 'border-border-light bg-white/50 dark:bg-card-dark/50 hover:border-purple-300'
            }`}
            role="listitem"
            aria-label={`${ex.title}: ${ex.desc}`}
            aria-pressed={selected === i}
          >
            <span className="text-3xl block mb-1" aria-hidden="true">{ex.emoji}</span>
            <span className="text-[11px] font-bold leading-tight block">{ex.title}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-sm w-full p-4 rounded-2xl border-2 border-purple-200 bg-purple-50 dark:bg-purple-950/30 text-center"
          >
            <span className="text-4xl block mb-2" aria-hidden="true">{examples[selected].emoji}</span>
            <h3 className="font-bold text-sm mb-1">{examples[selected].title}</h3>
            <p className="text-xs text-text-secondary mb-2">{examples[selected].desc}</p>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-card-dark/60 text-[11px] font-medium text-purple-700 dark:text-purple-400">
              ⚡ {examples[selected].sim}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={onNext}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Simulation Complete <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ===== 11: Final ===== */
function FinalMl({ onRestart, xp }: { onRestart: () => void; xp: number }) {
  const flow = ['📊 Data', '💻 Programming', '🧠 Algorithm', '🤖 Machine Learning', '✨ AI'];
  const [flowIdx, setFlowIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFlowIdx(p => { if (p >= flow.length - 1) { clearInterval(t); return p; } return p + 1; }), 700);
    return () => clearInterval(t);
  }, []);

  const level = getMlLevel(xp);
  const learned = [
    'Machine Learning', 'Training & Data', 'Prediction & Confidence',
    'Data Quality Effect', 'Classification', 'Real Life ML Uses',
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden" role="region" aria-label="Simulation complete">
      <Confetti count={50} duration={4000} />

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center max-w-lg relative z-10">
        <div className="text-6xl mb-4" aria-hidden="true">🎉</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          Machine Learning Simulation Complete!
        </h1>
        <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
          Timile Machine Learning step by step sikihalyo!
        </p>

        <div className="flex items-center justify-center gap-1 mb-6 flex-wrap" role="list" aria-label="Learning path">
          {flow.map((s, i) => (
            <motion.div
              key={s}
              initial={{ scale: 0 }}
              animate={{ scale: i <= flowIdx ? 1 : 0.5 }}
              className={`flex flex-col items-center p-1 ${i <= flowIdx ? 'opacity-100' : 'opacity-30'}`}
              role="listitem"
            >
              <span className="text-xl" aria-hidden="true">{s.split(' ')[0]}</span>
              <span className="text-[8px] font-medium mt-0.5">{s.split(' ').slice(1).join(' ')}</span>
              {i < flow.length - 1 && <span className="text-[10px] text-text-secondary">→</span>}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl" aria-hidden="true">{level.icon}</span>
          <span className="font-bold text-lg" style={{ color: level.color }}>{level.name}</span>
          <Trophy size={20} className="text-yellow-500" aria-hidden="true" />
          <span className="font-bold">{xp} XP</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 text-left" role="list" aria-label="What you learned">
          {learned.map(item => (
            <div key={item} className="p-2 rounded-xl text-xs font-medium" style={{ background: '#8b5cf615', color: '#8b5cf6' }} role="listitem">
              ✅ {item}
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Restart Machine Learning simulation"
        >
          <RefreshCw size={16} aria-hidden="true" /> Restart Simulation
        </button>
      </motion.div>
    </div>
  );
}

/* ===== MAIN ===== */
export default function MachineLearningSimulation() {
  const { setScreen } = useGameStore();
  const [screenState, setScreenState] = useLocalStorage<{ screen: MlScreen; xp: number; history: MlScreen[] }>(
    'ml-simulation',
    { screen: 'intro', xp: 0, history: [] },
  );

  const currentScreen = screenState.screen;
  const xp = screenState.xp;
  const history = screenState.history;

  const saveState = useCallback((updates: Partial<typeof screenState>) => {
    setScreenState(prev => ({ ...prev, ...updates }));
  }, [setScreenState]);

  const addXp = useCallback((n: number) => {
    saveState({ xp: screenState.xp + n });
  }, [screenState.xp, saveState]);

  const handleNext = useCallback(() => {
    const idx = SCREENS.indexOf(currentScreen);
    if (idx < SCREENS.length - 1) {
      const next = SCREENS[idx + 1];
      saveState({ screen: next, history: [...history, currentScreen] });
    }
  }, [currentScreen, history, saveState]);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      saveState({ screen: prev, history: history.slice(0, -1) });
    } else {
      setScreen('intro');
    }
  }, [history, saveState, setScreen]);

  const handleRestart = useCallback(() => {
    setScreenState({ screen: 'intro', xp: 0, history: [] });
  }, [setScreenState]);

  const [showConfirm, setShowConfirm] = useState(false);

  const level = getMlLevel(xp);
  const progress = SCREENS.indexOf(currentScreen);
  const total = SCREENS.length;
  const screenLabel = SCREEN_LABELS[currentScreen];

  return (
    <div className="min-h-screen">
      <ConfirmModal
        open={showConfirm}
        title="Restart Simulation?"
        message="Timile sabai progress reset hunecha. Confirm gara?"
        onConfirm={() => { setShowConfirm(false); handleRestart(); }}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-border-light dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => history.length > 0 ? handleBack() : setShowConfirm(true)}
            className="flex items-center gap-2 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label={history.length > 0 ? 'Go to previous screen' : 'Go to main menu'}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            <span className="hidden sm:inline">{history.length > 0 ? 'Back' : 'Menu'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-secondary hidden sm:block">{screenLabel}</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: level.color + '20', color: level.color }}>
              <span aria-hidden="true">{level.icon}</span>
              <span className="text-xs font-bold hidden sm:inline">{level.name}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-bold">
              <Trophy size={14} aria-hidden="true" /> {xp}
            </div>
          </div>
        </div>

        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / Math.max(total - 1, 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {currentScreen === 'intro' && <IntroMl onNext={handleNext} />}
            {currentScreen === 'human' && <HumanMl onNext={handleNext} />}
            {currentScreen === 'train' && <TrainMl onNext={handleNext} addXp={addXp} />}
            {currentScreen === 'predict' && <PredictMl onNext={handleNext} addXp={addXp} />}
            {currentScreen === 'data' && <DataMl onNext={handleNext} />}
            {currentScreen === 'classify' && <ClassifyMl onNext={handleNext} addXp={addXp} />}
            {currentScreen === 'quality' && <QualityMl onNext={handleNext} />}
            {currentScreen === 'progress' && <ProgressMl onNext={handleNext} />}
            {currentScreen === 'build' && <BuildMl onNext={handleNext} addXp={addXp} />}
            {currentScreen === 'real' && <RealMl onNext={handleNext} />}
            {currentScreen === 'final' && <FinalMl onRestart={() => setShowConfirm(true)} xp={xp} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
