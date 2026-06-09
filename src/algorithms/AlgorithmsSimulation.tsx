import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Play, ArrowRight, CheckCircle2, Route, Target, Award, GripVertical } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

type AlgScreen = 'intro' | 'daily' | 'steps' | 'exec' | 'sort' | 'path' | 'decision' | 'build' | 'challenge' | 'ai';

const nextMap: Record<AlgScreen, AlgScreen> = {
  intro: 'daily', daily: 'steps', steps: 'exec', exec: 'sort', sort: 'path',
  path: 'decision', decision: 'build', build: 'challenge', challenge: 'ai', ai: 'ai',
};

function getAlgLevel(xp: number) {
  if (xp >= 80) return { name: 'Algorithm Master', icon: '👑', color: '#f59e0b' };
  if (xp >= 40) return { name: 'Algorithm Explorer', icon: '🔍', color: '#6366f1' };
  return { name: 'Algorithm Beginner', icon: '🌱', color: '#22c55e' };
}

/* ===== 1: Intro ===== */
function IntroAlg({ onNext }: { onNext: () => void }) {
  const steps = [
    { icon: '❓', label: 'Problem' },
    { icon: '📝', label: 'Steps' },
    { icon: '✅', label: 'Solution' },
  ];
  const teaSteps = ['Pani Tatne', 'Chiya Hala', 'Chini Hala', 'Pakau', 'Serve Gara'];
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-6">
          <Route size={16} /> Interactive Algorithms Simulation
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Algorithm K Ho?</h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-6">
          Algorithm bhaneko kunai kaam pura garna ko lagi <strong>step by step process</strong> ho.
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          {steps.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-2" style={{ background: '#f59e0b15', border: '2px solid #f59e0b30' }}>
                <span className="text-3xl">{s.icon}</span>
              </motion.div>
              <span className="text-xs font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-800 mb-6 text-left text-sm">
          <p className="font-semibold mb-2">☕ Chiya Banaune Algorithm:</p>
          <ol className="space-y-1 ml-4 list-decimal text-text-secondary dark:text-text-dark-secondary">
            {teaSteps.map(s => <li key={s}>{s}</li>)}
          </ol>
        </div>
        <button onClick={onNext} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
          Algorithm Sikna Suru Gara <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ===== 2: Daily Life ===== */
function DailyAlg({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [animStep, setAnimStep] = useState(0);

  const cards = [
    { title: '🍜 Noodles Banaune', steps: ['Pani Tatne', 'Noodles Hala', 'Masala Hala', 'Serve Gara'] },
    { title: '🪥 Daat Majhne', steps: ['Brush Li', 'Paste Lagau', 'Daat Maja', 'Mukh Dhau'] },
    { title: '🚶 School Jane', steps: ['Wake Up', 'Brush', 'Breakfast', 'School'] },
  ];

  useEffect(() => {
    if (selected !== null) {
      setAnimStep(0);
      const t = setInterval(() => setAnimStep(p => {
        if (p >= cards[selected].steps.length - 1) { clearInterval(t); return p; }
        return p + 1;
      }), 600);
      return () => clearInterval(t);
    }
  }, [selected]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Dainik Jiban Ma Algorithm</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Hami daily algorithm use garchau — click gara hera!</p>
      <div className="grid md:grid-cols-3 gap-4 max-w-2xl w-full mb-6">
        {cards.map((c, i) => (
          <motion.div key={i} whileHover={{ y: -4 }}
            onClick={() => setSelected(i)}
            className={`p-4 rounded-2xl border-2 cursor-pointer text-center transition-all ${
              selected === i ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-lg' : 'border-border-light dark:border-border-dark bg-white/50 dark:bg-card-dark/50'
            }`}>
            <span className="text-3xl block mb-2">{c.title.split(' ')[0]}</span>
            <span className="font-semibold text-sm">{c.title}</span>
          </motion.div>
        ))}
      </div>
      {selected !== null && (
        <div className="space-y-2 w-full max-w-sm">
          {cards[selected].steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                i <= animStep ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md' : 'border-border-light opacity-40'
              }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= animStep ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>{i + 1}</span>
              {s}
              {i <= animStep && <CheckCircle2 size={16} className="ml-auto text-amber-500" />}
            </motion.div>
          ))}
        </div>
      )}
      <button onClick={onNext} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
        Step Milau Sike <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ===== 3: Arrange Steps ===== */
function StepsAlg({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const correctOrder = ['Boil Water', 'Add Tea', 'Add Sugar', 'Serve Tea'];
  const [shuffled] = useState(() => [...correctOrder].sort(() => Math.random() - 0.5));
  const [canvas, setCanvas] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);
  const [execStep, setExecStep] = useState(0);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const item = e.dataTransfer.getData('text/plain');
    if (item && canvas.length < 4 && !canvas.includes(item)) {
      setCanvas(p => [...p, item]);
    }
  };

  const run = () => {
    const correct = canvas.length === 4 && canvas.every((s, i) => s === correctOrder[i]);
    if (correct) { setDone(true); addXp(15); }
    const t = setInterval(() => setExecStep(p => {
      if (p >= 3) { clearInterval(t); return p; }
      return p + 1;
    }), 500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">☕ Step Milau — Chiya Banaune</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Left bata right ma steps drag gara</p>
      <div className="grid grid-cols-2 gap-6 max-w-lg w-full mb-6">
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-3">
          <h3 className="text-xs font-bold mb-2">Random Steps:</h3>
          <div className="space-y-2">
            {shuffled.filter(s => !canvas.includes(s)).map(s => (
              <div key={s} draggable onDragStart={(e) => handleDragStart(e, s)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-grab active:cursor-grabbing border border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                <GripVertical size={12} /> {s}
              </div>
            ))}
          </div>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          className={`min-h-[200px] rounded-2xl border-2 border-dashed p-3 transition-all ${
            dragOver ? 'border-amber-500 bg-amber-50' : 'border-border-light bg-white/40'
          }`}>
          <h3 className="text-xs font-bold mb-2">Ordered Steps:</h3>
          {canvas.length === 0 && <p className="text-xs text-text-secondary text-center py-6">Drag gare steps yaha rakhne</p>}
          {canvas.map((s, i) => (
            <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-green-300 bg-green-50 dark:bg-green-950/30 mb-2">
              <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">{i + 1}</span>
              {s}
              {(done || execStep >= i) && <CheckCircle2 size={14} className="ml-auto text-green-500" />}
            </motion.div>
          ))}
        </div>
      </div>
      {!done && canvas.length === 4 && (
        <button onClick={run} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
          <Play size={16} /> Run Algorithm
        </button>
      )}
      {done && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-bold text-green-600 text-lg">Algorithm Complete! +15 XP</p>
          <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
            Execution Herne <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 4: Execution ===== */
function ExecAlg({ onNext }: { onNext: () => void }) {
  const [val] = useState(5);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<number | null>(null);

  const execSteps = [
    { label: `START (Number = ${val})`, icon: '🚀', color: '#6366f1' },
    { label: `Add 10 → ${val + 10}`, icon: '➕', color: '#22c55e' },
    { label: `Multiply 2 → ${(val + 10) * 2}`, icon: '✖️', color: '#f59e0b' },
    { label: `OUTPUT = ${(val + 10) * 2}`, icon: '📤', color: '#ec4899' },
  ];

  const run = () => {
    setRunning(true); setStep(0); setOutput(null);
    const t = setInterval(() => setStep(p => {
      if (p >= execSteps.length - 1) { clearInterval(t); setOutput((val + 10) * 2); return p; }
      return p + 1;
    }), 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Algorithm Kasari Chalcha?</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Input = {val}. RUN click gara — step by step execution hera</p>
      <div className="space-y-2 w-full max-w-sm mb-6">
        {execSteps.map((s, i) => (
          <motion.div key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              step >= i ? 'shadow-md' : 'opacity-30'
            }`}
            style={{ borderColor: step >= i ? s.color : '#e2e8f0', background: step >= i ? s.color + '10' : '' }}
            animate={step === i ? { x: [0, 4, 0], scale: 1.03 } : {}}
            transition={{ duration: 0.4, repeat: step === i ? Infinity : 0 }}>
            <span className="text-lg">{s.icon}</span>
            <span>{s.label}</span>
            {step === i && <span className="ml-auto text-xs font-bold" style={{ color: s.color }}>◀ executing</span>}
            {step > i && <CheckCircle2 size={16} className="ml-auto" style={{ color: s.color }} />}
          </motion.div>
        ))}
      </div>
      {!running && !output && (
        <button onClick={run} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
          <Play size={16} /> RUN
        </button>
      )}
      {output !== null && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-4xl font-black text-amber-500">{output}</div>
          <p className="text-sm text-text-secondary mt-1">Final Output</p>
          <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
            Sorting Herne <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 5: Sort ===== */
function SortAlg({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [nums] = useState([7, 2, 9, 4, 1]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const handleDragStart = (e: React.DragEvent, n: number) => {
    e.dataTransfer.setData('text/plain', n.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const n = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(n) && !sorted.includes(n)) {
      setSorted(p => [...p, n]);
      setStepCount(p => p + 1);
    }
  };

  useEffect(() => {
    if (sorted.length === 5) {
      const correct = sorted.every((v, i) => i === 0 || v >= sorted[i - 1]);
      if (correct) { setDone(true); addXp(15); }
    }
  }, [sorted]);

  const isCorrectOrder = sorted.every((v, i) => i === 0 || v >= sorted[i - 1]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Sort Gara 🔢</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">Numbers lai ascending order ma arrange gara (left bata right ma drag)</p>
      <p className="text-xs text-text-secondary mb-4">Goal: 1 → 2 → 4 → 7 → 9</p>

      <div className="grid grid-cols-2 gap-6 max-w-lg w-full mb-6">
        <div className="bg-white/60 rounded-2xl border p-3">
          <h3 className="text-xs font-bold mb-2">Unsorted:</h3>
          <div className="flex flex-wrap gap-2">
            {nums.filter(n => !sorted.includes(n)).map(n => (
              <div key={n} draggable onDragStart={(e) => handleDragStart(e, n)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold cursor-grab active:cursor-grabbing border-2 border-amber-400 bg-amber-50 text-amber-700">
                {n}
              </div>
            ))}
          </div>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          className={`min-h-[120px] rounded-2xl border-2 border-dashed p-3 ${dragOver ? 'border-amber-500 bg-amber-50' : 'border-border-light bg-white/40'}`}>
          <h3 className="text-xs font-bold mb-2">Sorted:</h3>
          <div className="flex flex-wrap gap-2">
            {sorted.map((n) => (
              <motion.div key={n} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold border-2 ${
                  isCorrectOrder ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700'
                }`}>{n}</motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-text-secondary mb-4">Steps: {stepCount}</div>

      {done && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-bold text-green-600">Sorted! +15 XP</p>
          <p className="text-xs text-text-secondary mt-1">Step count: {stepCount} | Algorithm le data organize garcha</p>
          <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
            Path Finder <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 6: Path Finding ===== */
function PathAlg({ onNext }: { onNext: () => void }) {
  const grid = [
    ['🏠', '⬜', '⬜', '⬜', '⬜'],
    ['⬜', '🧱', '🧱', '⬜', '⬜'],
    ['⬜', '⬜', '⬜', '🧱', '⬜'],
    ['⬜', '🧱', '⬜', '⬜', '⬜'],
    ['⬜', '⬜', '⬜', '⬜', '🏫'],
  ];
  const pathCells = ['0,0', '1,0', '2,0', '2,1', '2,2', '3,2', '3,3', '3,4', '4,4'];
  const [showPath, setShowPath] = useState(false);
  const [checking, setChecking] = useState(false);
  const pathIdxRef = useRef(0);

  useEffect(() => {
    if (!checking) return;
    const t = setInterval(() => {
      pathIdxRef.current++;
      if (pathIdxRef.current >= pathCells.length) { clearInterval(t); setChecking(false); }
    }, 300);
    return () => clearInterval(t);
  }, [checking]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Sabai Vanda Chito Batto 🗺️</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">🏠 → 🏫 Computer le best path khojcha</p>
      <div className="grid grid-cols-5 gap-1 mb-6" style={{ direction: 'ltr' }}>
        {grid.flat().map((cell, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const isPath = showPath && pathCells.slice(0, checking ? pathIdxRef.current + 1 : pathCells.length).includes(`${row},${col}`);
          return (
            <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg border-2 transition-all ${
              cell === '🧱' ? 'border-gray-400 bg-gray-200' :
              isPath ? 'border-green-500 bg-green-100 scale-110' : 'border-border-light bg-white/60'
            }`}>
              {isPath ? '🟢' : cell}
            </div>
          );
        })}
      </div>
      {!showPath && (
        <button onClick={() => { setShowPath(true); setChecking(true); }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
          <Route size={16} /> Best Path Khoj
        </button>
      )}
      {showPath && !checking && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="font-bold text-green-600">✅ Best Path Found! 9 steps</p>
          <p className="text-xs text-text-secondary mt-1">🧱 walls avoid garcha, sabai bhanda chito batto select garcha</p>
          <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
            Decision Algorithm <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 7: Decision ===== */
function DecisionAlg({ onNext }: { onNext: () => void }) {
  const [rain, setRain] = useState(true);
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Nirnaya Kasari Lincha? 🤔</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Rain change gara — algorithm decision hera</p>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm font-medium">Rain:</span>
        <button onClick={() => { setRain(!rain); setShow(false); }}
          className={`px-6 py-2 rounded-xl font-bold border-2 transition-all ${rain ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-yellow-400 bg-yellow-50 text-yellow-700'}`}>
          {rain ? '☔ YES' : '☀️ NO'}
        </button>
      </div>
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <motion.div className="w-full p-4 rounded-2xl border-2 text-center" style={{ borderColor: '#6366f140', background: '#6366f110' }}>
          <span className="text-2xl">❓</span>
          <p className="font-bold text-sm">IF Rain = {rain ? 'YES' : 'NO'}</p>
        </motion.div>
        <motion.div className="text-text-secondary">↓</motion.div>
        <motion.div className={`w-full p-4 rounded-2xl border-2 text-center ${show ? 'shadow-lg' : ''}`}
          style={{ borderColor: rain ? '#3b82f6' : '#22c55e', background: show ? (rain ? '#3b82f610' : '#22c55e10') : '' }}>
          <span className="text-2xl">{rain ? '☔' : '😊'}</span>
          <p className="font-bold text-sm">{rain ? 'Take Umbrella 🌂' : 'Go Normally 🚶'}</p>
        </motion.div>
      </div>
      <button onClick={() => setShow(true)} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
        <Play size={16} /> Run Decision
      </button>
      {show && (
        <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
          Aafno Algorithm <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

/* ===== 8: Build Your Own ===== */
function BuildAlg({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const blocks = ['START', 'Wake Up', 'Eat', 'Study', 'OUTPUT', 'END'];
  const [canvas, setCanvas] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);

  const handleDragStart = (e: React.DragEvent, b: string) => {
    e.dataTransfer.setData('text/plain', b);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const b = e.dataTransfer.getData('text/plain');
    if (b && !canvas.includes(b)) setCanvas(p => [...p, b]);
  };

  const run = () => {
    if (canvas.length >= 3) { setDone(true); addXp(20); }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Aafno Algorithm Bana</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Left bata blocks drag garera center ma rakhne</p>
      <div className="grid grid-cols-2 gap-6 max-w-lg w-full mb-6">
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border p-3">
          <h3 className="text-xs font-bold mb-2">Blocks:</h3>
          <div className="space-y-2">
            {blocks.filter(b => !canvas.includes(b)).map(b => (
              <div key={b} draggable onDragStart={(e) => handleDragStart(e, b)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-grab active:cursor-grabbing border border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                <GripVertical size={12} /> {b}
              </div>
            ))}
          </div>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          className={`min-h-[200px] rounded-2xl border-2 border-dashed p-3 ${dragOver ? 'border-amber-500 bg-amber-50' : 'border-border-light bg-white/40'}`}>
          <h3 className="text-xs font-bold mb-2">My Algorithm:</h3>
          {canvas.length === 0 && <p className="text-xs text-text-secondary text-center py-6">Blocks drag gara</p>}
          {canvas.map((b, i) => (
            <motion.div key={b} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-green-300 bg-green-50 dark:bg-green-950/30 mb-2">
              <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">{i + 1}</span>
              {b}
            </motion.div>
          ))}
        </div>
      </div>
      {!done && canvas.length >= 2 && (
        <button onClick={run} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
          <Play size={16} /> Run
        </button>
      )}
      {done && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="font-bold text-green-600">✅ Algorithm Created! +20 XP</p>
          <button onClick={onNext} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg text-sm">
            Challenge <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== 9: Challenge ===== */
function ChallengeAlg({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const questions = [
    { q: 'Cook Rice ko first step k ho?', options: ['Pani Tatne', 'Rice Dhune', 'Gas Balne', 'Cooker Kholne'], answer: 'Pani Tatne' },
    { q: 'Algorithm bhaneko k ho?', options: ['Step by step process', 'Computer part', 'Programming language', 'Random data'], answer: 'Step by step process' },
    { q: 'Sorting ma ke garcha?', options: ['Organize garcha', 'Delete garcha', 'Hide garcha', 'Copy garcha'], answer: 'Organize garcha' },
  ];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const isLast = idx >= questions.length - 1;

  const answer = (ans: string) => {
    if (selected) return;
    setSelected(ans);
    if (ans === q.answer) { setCorrect(p => p + 1); addXp(10); }
  };

  const next = () => {
    if (isLast) setDone(true);
    else { setIdx(p => p + 1); setSelected(null); }
  };

  if (done) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center">
          <Award size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Challenge Complete!</h2>
          <div className="text-5xl font-bold text-amber-500 mb-4">{pct}%</div>
          <p className="text-text-secondary mb-2">Sahi: {correct} | Total: {questions.length}</p>
          <button onClick={onNext} className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg text-sm flex items-center gap-2 mx-auto">
            AI Connection <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">🧠 Challenge</h1>
          <span className="text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">{idx + 1}/{questions.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600" initial={{ width: 0 }} animate={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
        <div className="text-center mb-6">
          <Target size={32} className="mx-auto mb-3 text-amber-500" />
          <h2 className="text-lg font-bold mb-4">{q.q}</h2>
          <div className="space-y-2">
            {q.options.map(o => (
              <button key={o} onClick={() => answer(o)}
                className={`w-full p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  selected === o ? (o === q.answer ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                  : 'border-border-light hover:border-amber-300 bg-white dark:bg-card-dark'
                }`}>{o}</button>
            ))}
          </div>
        </div>
        {selected && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className={`p-3 rounded-xl text-center text-sm font-bold mb-4 ${selected === q.answer ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {selected === q.answer ? '✅ Sahi! +10 XP' : '❌ Galat!'}
          </motion.div>
        )}
        {selected && (
          <button onClick={next} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm">
            {isLast ? 'Result Herne' : 'Aglo'} <ChevronRight size={16} className="inline" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ===== 10: AI Connection + Completion ===== */
function AiAlg({ onRestart, xp }: { onRestart: () => void; xp: number }) {
  const [stage, setStage] = useState(0);
  const stages = ['Data', 'Programming', 'Algorithm', 'Machine Learning', 'AI'];
  const icons = ['📊', '💻', '🧠', '🤖', '✨'];

  useEffect(() => {
    const t = setInterval(() => setStage(p => {
      if (p >= stages.length - 1) { clearInterval(t); return p; }
      return p + 1;
    }), 800);
    return () => clearInterval(t);
  }, []);

  const level = getAlgLevel(xp);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div key={i} className="absolute top-0 rounded-full"
          style={{ left: Math.random() * 100 + '%', width: Math.random() * 8 + 4, height: Math.random() * 8 + 4,
            backgroundColor: ['#f59e0b', '#6366f1', '#22c55e', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 5)] }}
          initial={{ y: -20, opacity: 1 }} animate={{ y: '100vh', rotate: 720, opacity: 0 }}
          transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }} />
      ))}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center max-w-lg relative z-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Algorithm Simulation Complete!</h1>
        <p className="text-text-secondary dark:text-text-dark-secondary mb-6">Timile algorithm step by step sikihalyo!</p>

        <div className="flex items-center justify-center gap-1 mb-6">
          {stages.map((s, i) => (
            <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: i <= stage ? 1 : 0.5 }}
              className={`flex flex-col items-center p-2 ${i <= stage ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-2xl">{icons[i]}</span>
              <span className="text-[10px] font-medium mt-1">{s}</span>
              {i < stages.length - 1 && <span className="text-xs text-text-secondary mt-1">→</span>}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">{level.icon}</span>
          <span className="font-bold text-lg" style={{ color: level.color }}>{level.name}</span>
          <Trophy size={20} className="text-yellow-500" />
          <span className="font-bold">{xp} XP</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 text-left">
          {[
            { label: 'Algorithm = Step by Step Solution', icon: '🧠', color: '#f59e0b' },
            { label: 'Sorting = Data organize garcha', icon: '🔢', color: '#6366f1' },
            { label: 'Decision = IF/ELSE logic', icon: '🤔', color: '#22c55e' },
            { label: 'Execution = Step by step run', icon: '▶️', color: '#ec4899' },
          ].map(item => (
            <div key={item.label} className="p-2 rounded-xl text-xs font-medium" style={{ background: item.color + '15', color: item.color }}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        <button onClick={onRestart} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
          🔄 Restart Simulation
        </button>
      </motion.div>
    </div>
  );
}

/* ===== MAIN ===== */
export default function AlgorithmsSimulation() {
  const { setScreen } = useGameStore();
  const [screen, setScreenInternal] = useState<AlgScreen>('intro');
  const [xp, setXp] = useState(0);

  const addXp = (n: number) => setXp(p => p + n);
  const handleNext = () => { const next = nextMap[screen]; if (next) setScreenInternal(next); };
  const level = getAlgLevel(xp);
  const progress = Object.keys(nextMap).indexOf(screen);
  const total = Object.keys(nextMap).length;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-border-light dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => setScreen('intro')} className="flex items-center gap-2 font-bold">
            <ChevronLeft size={18} /> Algorithms Sim
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: level.color + '20', color: level.color }}>
              <span>{level.icon}</span>
              <span className="text-xs font-bold">{level.name}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-bold">
              <Trophy size={14} /> {xp}
            </div>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
            initial={{ width: 0 }} animate={{ width: `${(progress / total) * 100}%` }} />
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {screen === 'intro' && <IntroAlg onNext={handleNext} />}
        {screen === 'daily' && <DailyAlg onNext={handleNext} />}
        {screen === 'steps' && <StepsAlg onNext={handleNext} addXp={addXp} />}
        {screen === 'exec' && <ExecAlg onNext={handleNext} />}
        {screen === 'sort' && <SortAlg onNext={handleNext} addXp={addXp} />}
        {screen === 'path' && <PathAlg onNext={handleNext} />}
        {screen === 'decision' && <DecisionAlg onNext={handleNext} />}
        {screen === 'build' && <BuildAlg onNext={handleNext} addXp={addXp} />}
        {screen === 'challenge' && <ChallengeAlg onNext={handleNext} addXp={addXp} />}
        {screen === 'ai' && <AiAlg onRestart={() => { setXp(0); setScreenInternal('intro'); }} xp={xp} />}
      </div>
    </div>
  );
}
