import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Play, ArrowRight, CheckCircle2, Cpu, Award, Target } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { availableBlocks, getProgLevel, challengeQuestions } from './data';
import type { ProgScreen, ProgBlock } from './data';

/* ===== Screen 1: Programming K Ho? ===== */
function IntroScreen({ onNext }: { onNext: () => void }) {
  const steps = [
    { icon: '👨‍🎓', label: 'Student' },
    { icon: '📝', label: 'Instruction' },
    { icon: '💻', label: 'Computer' },
    { icon: '✅', label: 'Result' },
  ];
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-medium mb-6">
          <Cpu size={16} /> Interactive Programming Simulation
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Programming K Ho?
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-8 leading-relaxed">
          Programming bhaneko computer lai <strong>step by step instruction</strong> dine tarika ho.
        </p>
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-10">
          {steps.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg mb-2"
                style={{ background: '#06b6d415', border: '2px solid #06b6d430' }}
              >
                <span className="text-3xl">{s.icon}</span>
              </motion.div>
              <span className="text-xs font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl p-4 border border-cyan-200 dark:border-cyan-800 mb-8 text-sm">
          <p><strong>Program le:</strong> Input lincha → Rule follow garcha → Output dincha</p>
        </div>
        <button onClick={onNext} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
          Programming Suru Gara <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ===== Screen 2: Programming Flow ===== */
function FlowScreen({ onNext }: { onNext: () => void }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAnim(p => Math.min(p + 1, 3)), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Programming Kasari Kam Garcha?</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-8">Data pipeline through program</p>
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { label: 'INPUT', val: '5 + 5', icon: '📥', color: '#6366f1' },
          { label: 'PROCESS', val: 'Calculate', icon: '⚙️', color: '#f59e0b' },
          { label: 'OUTPUT', val: '10', icon: '📤', color: '#22c55e' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: anim > i ? 1 : 0.3, scale: 1 }}
            className={`p-6 rounded-2xl border-2 text-center min-w-[140px] transition-all ${anim > i ? 'shadow-lg' : ''}`}
            style={{ borderColor: s.color + '40', background: s.color + '10' }}
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-bold text-sm" style={{ color: s.color }}>{s.label}</div>
            <div className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">{s.val}</div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="w-4 h-4 rounded-full"
            style={{ background: anim > i ? '#06b6d4' : '#e2e8f0' }}
            animate={{ scale: anim === i ? 1.3 : 1 }}
          />
        ))}
      </div>
      <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
        Program Banaun <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ===== Screen 3: Build Program ===== */
function BuildScreen({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [canvas, setCanvas] = useState<ProgBlock[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('5');

  const handleDragStart = (e: React.DragEvent, block: ProgBlock) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    const block = availableBlocks.find(b => b.id === id);
    if (block) setCanvas(p => [...p, { ...block, id: block.id + '-' + Date.now() }]);
  };

  const runProgram = () => {
    const ops = canvas.filter(b => b.type === 'add' || b.type === 'sub' || b.type === 'mul' || b.type === 'div');
    if (canvas.some(b => b.type === 'input') && ops.length > 0 && canvas.some(b => b.type === 'output')) {
      const num = parseFloat(inputVal) || 0;
      const op = ops[0];
      let res = num;
      if (op.type === 'add') res = num + num;
      else if (op.type === 'sub') res = num - 2;
      else if (op.type === 'mul') res = num * 2;
      else if (op.type === 'div') res = num / 2;
      setResult(`${inputVal} ${op.emoji} ${op.type === 'add' ? inputVal : '2'} = ${res}`);
      addXp(5);
    } else {
      setResult('❌ Program ma INPUT, operator (+,-,×,÷) ra OUTPUT huna parchha');
    }
  };

  return (
    <div className="min-h-[80vh] p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Aafno Program Bana</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary text-center mb-6">Left bata blocks drag garera center ma rakhne</p>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_250px] gap-4 max-w-5xl mx-auto">
        {/* Block Palette */}
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-3">
          <h3 className="font-bold text-xs mb-3">Blocks</h3>
          <div className="space-y-2">
            {availableBlocks.map(b => (
              <div key={b.id} draggable onDragStart={(e) => handleDragStart(e, b)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-grab active:cursor-grabbing border hover:shadow-md transition-all"
                style={{ borderColor: b.color + '40', background: b.color + '10' }}
              >
                <span>{b.emoji}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`min-h-[300px] rounded-2xl border-2 border-dashed p-3 transition-all ${
            dragOver ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30' : 'border-border-light dark:border-border-dark bg-white/40 dark:bg-card-dark/40'
          }`}
        >
          {canvas.length === 0 && !dragOver && (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary dark:text-text-dark-secondary text-xs py-12">
              <span className="text-3xl mb-2">🎯</span>
              Blocks drag garera yaha rakhne
            </div>
          )}
          <div className="space-y-2">
            {canvas.map((b, i) => (
              <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border"
                style={{ borderColor: b.color + '40', background: b.color + '10' }}
              >
                <span className="text-gray-400">#{i + 1}</span>
                <span>{b.emoji}</span>
                <span>{b.label}</span>
                <button onClick={() => setCanvas(p => p.filter((_, j) => j !== i))} className="ml-auto text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-3">
          <h3 className="font-bold text-xs mb-3">Output</h3>
          {canvas.some(b => b.type === 'input') && (
            <div className="mb-3">
              <label className="text-xs text-text-secondary block mb-1">Input value:</label>
              <input value={inputVal} onChange={e => setInputVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-sm text-center" />
            </div>
          )}
          <button onClick={runProgram} disabled={canvas.length === 0}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-lg disabled:opacity-50 mb-3">
            <Play size={14} /> RUN
          </button>
          {result && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 text-center text-sm font-bold">
              {result}
            </motion.div>
          )}
        </div>
      </div>
      <div className="text-center mt-6">
        <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
          Logic Sikne <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ===== Screen 4: Logic Simulator ===== */
function LogicScreen({ onNext }: { onNext: () => void }) {
  const [age, setAge] = useState(10);
  const [highlight, setHighlight] = useState<'input' | 'check' | 'output' | null>(null);

  useEffect(() => {
    setHighlight('input');
    const t1 = setTimeout(() => setHighlight('check'), 400);
    const t2 = setTimeout(() => setHighlight('output'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [age]);

  const isAdult = age > 18;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Program Ko Logic</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Age value change gara — program logic animation hera</p>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm font-medium">Age:</span>
        <input type="range" min={1} max={60} value={age} onChange={e => setAge(parseInt(e.target.value))}
          className="w-40 accent-cyan-500" />
        <motion.span key={age} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-2xl font-bold text-cyan-600">{age}</motion.span>
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <motion.div className={`w-full p-4 rounded-2xl border-2 text-center transition-all ${highlight === 'input' ? 'shadow-lg scale-105' : ''}`}
          style={{ borderColor: highlight === 'input' ? '#6366f1' : '#e2e8f0', background: highlight === 'input' ? '#6366f110' : '' }}>
          <span className="text-2xl">📥</span>
          <p className="font-bold text-sm">INPUT: Age = {age}</p>
        </motion.div>
        <motion.div className="text-text-secondary">↓</motion.div>

        <motion.div className={`w-full p-4 rounded-2xl border-2 text-center transition-all ${highlight === 'check' ? 'shadow-lg scale-105' : ''}`}
          style={{ borderColor: highlight === 'check' ? '#f59e0b' : '#e2e8f0', background: highlight === 'check' ? '#f59e0b10' : '' }}>
          <span className="text-2xl">❓</span>
          <p className="font-bold text-sm">CONDITION: Age &gt; 18?</p>
          <p className="text-xs text-text-secondary">{age > 18 ? '✅ True' : '❌ False'}</p>
        </motion.div>
        <motion.div className="text-text-secondary">↓</motion.div>

        <motion.div className={`w-full p-4 rounded-2xl border-2 text-center transition-all ${highlight === 'output' ? 'shadow-lg scale-105' : ''}`}
          style={{ borderColor: highlight === 'output' ? '#22c55e' : '#e2e8f0', background: highlight === 'output' ? '#22c55e10' : '' }}>
          <span className="text-2xl">📤</span>
          <p className="font-bold text-sm">OUTPUT: {isAdult ? 'Adult 🧑' : 'Child 👶'}</p>
        </motion.div>
      </div>

      <button onClick={onNext} className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
        Variable Sikne <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ===== Screen 5: Variables ===== */
function VariablesScreen({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState('Ram');
  const [score, setScore] = useState(90);
  const [activeVar, setActiveVar] = useState<'name' | 'score' | null>(null);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Variable K Ho?</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-8">Variable bhaneko data rakhne container ho</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-lg w-full mb-8">
        {[
          { label: 'name', val: name, set: setName, icon: '📦', color: '#6366f1', key: 'name' as const },
          { label: 'score', val: score.toString(), set: (v: string) => setScore(parseInt(v) || 0), icon: '📦', color: '#22c55e', key: 'score' as const },
        ].map(v => (
          <motion.div key={v.key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setActiveVar(v.key)} onMouseLeave={() => setActiveVar(null)}
            className={`p-6 rounded-2xl border-2 text-center transition-all ${activeVar === v.key ? 'shadow-xl scale-105' : ''}`}
            style={{ borderColor: v.color + '40', background: v.color + '08' }}
          >
            <div className="text-3xl mb-2">{v.icon}</div>
            <div className="font-bold text-lg" style={{ color: v.color }}>{v.label}</div>
            <motion.div key={v.val} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-4xl font-black my-2">{v.val}</motion.div>
            <input value={v.val} onChange={e => v.set(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-sm text-center mt-2" />
          </motion.div>
        ))}
      </div>

      <motion.div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-sm max-w-lg w-full text-center">
        <strong>Result:</strong> {name} ko score {score} ho
      </motion.div>

      <button onClick={onNext} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
        Code Lekhne <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ===== Screen 6: Virtual Coding ===== */
function CodeScreen({ onNext }: { onNext: () => void }) {
  const [num, setNum] = useState(10);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const lines = [
    { text: 'START', icon: '🚀' },
    { text: `INPUT number = ${num}`, icon: '📥' },
    { text: 'ADD 5', icon: '➕' },
    { text: `OUTPUT = ${num + 5}`, icon: '📤' },
    { text: 'END', icon: '🏁' },
  ];

  const run = () => {
    setRunning(true); setStep(0);
    const t = setInterval(() => {
      setStep(p => {
        if (p >= lines.length - 1) { clearInterval(t); setRunning(false); return p; }
        return p + 1;
      });
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Code Lekhera Her</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6">Line by line execution — current line glow huncha</p>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">Number:</span>
        <input type="range" min={0} max={50} value={num} onChange={e => setNum(parseInt(e.target.value))}
          className="w-40 accent-cyan-500" />
        <span className="text-2xl font-bold text-cyan-600">{num}</span>
      </div>

      <div className="space-y-2 w-full max-w-sm mb-6">
        {lines.map((l, i) => (
          <motion.div key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              running && i === step ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 shadow-lg scale-105' :
              i <= step && running ? 'border-green-300 bg-green-50 dark:bg-green-950/30 text-green-700' :
              'border-border-light dark:border-border-dark bg-white/50 dark:bg-card-dark/50'
            }`}
            animate={running && i === step ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <span className="text-lg">{l.icon}</span>
            <span>{l.text}</span>
            {running && i === step && <span className="ml-auto text-cyan-500 text-xs">◀ executing</span>}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={run} disabled={running}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 text-sm">
          <Play size={16} /> RUN
        </button>
        <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
          Bug Khojne <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ===== Screen 7: Debugging ===== */
function DebugScreen({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [fixed, setFixed] = useState(false);
  const [canvas, setCanvas] = useState<ProgBlock[]>([
    { id: 'd1', type: 'input', label: 'INPUT', emoji: '📥', color: '#6366f1' },
    { id: 'd3', type: 'output', label: 'OUTPUT', emoji: '📤', color: '#64748b' },
  ]);
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, block: ProgBlock) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    const block = availableBlocks.find(b => b.id === id);
    if (!block) return;
    if (block.type === 'add') {
      setCanvas(p => {
        const idx = p.findIndex(b => b.type === 'output');
        if (idx === -1) return [...p, block];
        const newArr = [...p];
        newArr.splice(idx, 0, block);
        return newArr;
      });
      setFixed(true); addXp(10);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Bug Khoja 🐛</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">Yo program ma kehi mistake cha — ADD block haraeko cha!</p>
      <p className="text-xs text-red-500 mb-6">Hint: mathi ADD (+)
 block rakhna birseko cha</p>

      <div className="w-full max-w-sm mb-4">
        <h3 className="text-xs font-semibold mb-2">Broken Program:</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`min-h-[120px] rounded-2xl border-2 border-dashed p-3 ${dragOver ? 'border-cyan-500 bg-cyan-50/50' : 'border-red-300 bg-red-50/30 dark:bg-red-950/20'}`}
        >
          <div className="space-y-2">
            {canvas.map((b, i) => (
              <div key={b.id + i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border" style={{ borderColor: b.color + '40', background: b.color + '10' }}>
                <span>{b.emoji}</span>
                <span>{b.label}</span>
              </div>
            ))}
            {!fixed && <div className="text-center text-xs text-red-400 py-2">⬅ ADD block drag garera yaha rakhne</div>}
          </div>
        </div>
      </div>

      {!fixed && (
        <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-3 w-full max-w-sm mb-4">
          <h3 className="text-xs font-bold mb-2">Available Blocks:</h3>
          <div className="flex gap-2">
            {availableBlocks.filter(b => b.type === 'add').map(b => (
              <div key={b.id} draggable onDragStart={(e) => handleDragStart(e, b)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium cursor-grab active:cursor-grabbing border"
                style={{ borderColor: b.color + '40', background: b.color + '10' }}
              >
                <span>{b.emoji}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {fixed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-300 text-center mb-4">
          <CheckCircle2 size={24} className="mx-auto text-green-600 mb-1" />
          <p className="font-bold text-green-700">✅ Bug Fix Gareko! +10 XP</p>
        </motion.div>
      )}

      {fixed && (
        <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
          Program Run Garne <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

/* ===== Screen 8: Execution Animation ===== */
function ExecutionScreen({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [complete, setComplete] = useState(false);
  const [running, setRunning] = useState(false);

  const phases = ['Reading Input...', 'Processing...', 'Generating Output...'];

  const run = () => {
    setRunning(true); setProgress(0); setPhase(0); setComplete(false);
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 2;
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 40);
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1000);
    setTimeout(() => { clearInterval(interval); setProgress(100); setComplete(true); }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">▶ Program Execution</h1>

      {!running && !complete && (
        <button onClick={run} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
          <Play size={24} /> RUN
        </button>
      )}

      {running && (
        <div className="text-center max-w-sm w-full">
          <div className="flex items-center justify-center gap-4 mb-6">
            {['📥', '⚙️', '📤'].map((icon, i) => (
              <motion.div key={i} className={`text-4xl p-4 rounded-2xl border-2 transition-all ${i === phase ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 shadow-lg scale-110' : 'border-gray-200 opacity-40'}`}
                animate={i === phase ? { y: [0, -8, 0] } : {}} transition={{ duration: 1, repeat: Infinity }}>
                {icon}
              </motion.div>
            ))}
          </div>
          <p className="font-bold text-cyan-600 mb-4">{phases[phase]}</p>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
              initial={{ width: '0%' }} animate={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-text-secondary">{progress}%</p>
        </div>
      )}

      {complete && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">PROGRAM COMPLETE</h2>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">Step 1: Reading Input → Step 2: Processing → Step 3: Output</p>
          <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm">
            Challenge <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ===== Screen 9: Challenge ===== */
function ChallengeScreen({ onNext, addXp }: { onNext: () => void; addXp: (n: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = challengeQuestions[qIdx];
  const isLast = qIdx >= challengeQuestions.length - 1;

  const answer = (ans: string) => {
    if (selected) return;
    setSelected(ans);
    if (ans === q.answer) { setCorrect(p => p + 1); addXp(10); }
  };

  const next = () => {
    if (isLast) setDone(true);
    else { setQIdx(p => p + 1); setSelected(null); }
  };

  if (done) {
    const pct = Math.round((correct / challengeQuestions.length) * 100);
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Award size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Challenge Complete!</h2>
        <div className="text-5xl font-bold text-cyan-600 mb-4">{pct}%</div>
        <p className="text-text-secondary mb-2">Sahi: {correct} | Galat: {challengeQuestions.length - correct}</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => { setQIdx(0); setSelected(null); setCorrect(0); setDone(false); }}
            className="px-5 py-2.5 rounded-xl border border-border-light font-medium text-sm">🔄 Pheri</button>
          <button onClick={onNext} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm flex items-center gap-2">
            Final Simulation <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Challenge Mode</h1>
          <span className="text-sm px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 font-medium">{qIdx + 1}/{challengeQuestions.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }} animate={{ width: `${(qIdx / challengeQuestions.length) * 100}%` }} />
        </div>
        <div className="text-center mb-6">
          <Target size={32} className="mx-auto mb-3 text-cyan-600" />
          <h2 className="text-xl font-bold mb-4">{q.question}</h2>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map(o => (
              <button key={o} onClick={() => answer(o)}
                className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  selected === o ? (o === q.answer ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                  : 'border-border-light hover:border-cyan-300 bg-white dark:bg-card-dark'
                }`}
              >{o}</button>
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
          <button onClick={next} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm">
            {isLast ? 'Result Herne' : 'Aglo'} <ChevronRight size={16} className="inline" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ===== Screen 10: Final Simulation + Completion ===== */
function FinalScreen({ onComplete, xp, addXp }: { onComplete: () => void; xp: number; addXp: (n: number) => void }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [stage, setStage] = useState(0);

  const submit = () => {
    if (!name.trim()) return;
    addXp(20);
    setSubmitted(true);
    const t = setInterval(() => setStage(p => {
      if (p >= 3) { clearInterval(t); return p; }
      return p + 1;
    }), 700);
  };

  if (submitted && stage >= 3) {
    const level = getProgLevel(xp);
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div key={i} className="absolute top-0 rounded-full"
            style={{
              left: Math.random() * 100 + '%', width: Math.random() * 8 + 4, height: Math.random() * 8 + 4,
              backgroundColor: ['#06b6d4', '#6366f1', '#22c55e', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
            }}
            initial={{ y: -20, opacity: 1 }} animate={{ y: '100vh', rotate: 720, opacity: 0 }}
            transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }}
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center max-w-md relative z-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Programming Simulation Complete!</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-4">Hello {name}! Timile programming sikihalyo!</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">{level.icon}</span>
            <span className="font-bold text-lg" style={{ color: level.color }}>{level.name}</span>
            <Trophy size={20} className="text-yellow-500" />
            <span className="font-bold">{xp} XP</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: 'Data', icon: '📊', color: '#6366f1' },
              { label: 'Programming', icon: '💻', color: '#06b6d4' },
              { label: 'Logic', icon: '🧠', color: '#f59e0b' },
              { label: 'Variables', icon: '📦', color: '#22c55e' },
              { label: 'Execution', icon: '▶️', color: '#ec4899' },
            ].map(item => (
              <div key={item.label} className="p-2 rounded-xl text-xs font-medium text-center" style={{ background: item.color + '15', color: item.color }}>
                {item.icon} {item.label}
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary mb-6">Today learned: Data → Programming → Logic → Variables → Execution</p>
          <button onClick={onComplete} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            🔄 Restart Programming
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Final Simulation</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-8">Aafno name type gara — program le greeting decha</p>

      <div className="flex flex-col items-center gap-3 w-full max-w-sm mb-8">
        <motion.div className="w-full p-4 rounded-2xl border-2 text-center" style={{ borderColor: stage >= 0 ? '#6366f1' : '#e2e8f0', background: stage >= 0 ? '#6366f110' : '' }}>
          <span className="text-2xl">📥</span>
          <p className="font-bold text-sm">INPUT</p>
          {!submitted && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Aafno name lekh..."
              className="w-full px-3 py-2 rounded-xl border border-border-light bg-white dark:bg-card-dark text-sm text-center mt-2" />
          )}
          {submitted && <p className="text-lg font-bold mt-2 text-cyan-600">{name}</p>}
        </motion.div>
        <motion.div animate={stage >= 1 ? { opacity: 1 } : { opacity: 0.3 }} className="text-text-secondary">↓</motion.div>
        <motion.div className="w-full p-4 rounded-2xl border-2 text-center" style={{ borderColor: stage >= 1 ? '#f59e0b' : '#e2e8f0', background: stage >= 1 ? '#f59e0b10' : '' }}>
          <span className="text-2xl">⚙️</span>
          <p className="font-bold text-sm">PROCESS: Add Greeting</p>
          {stage >= 1 && <p className="text-xs text-text-secondary mt-1">"Hello" + {name}</p>}
        </motion.div>
        <motion.div animate={stage >= 2 ? { opacity: 1 } : { opacity: 0.3 }} className="text-text-secondary">↓</motion.div>
        <motion.div className="w-full p-4 rounded-2xl border-2 text-center"
          style={{ borderColor: stage >= 2 ? '#22c55e' : '#e2e8f0', background: stage >= 2 ? '#22c55e10' : '' }}>
          <span className="text-2xl">📤</span>
          <p className="font-bold text-sm">OUTPUT</p>
          {stage >= 2 && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl font-bold text-green-600 mt-1">Hello {name}! 👋</motion.p>}
        </motion.div>
      </div>

      {!submitted && (
        <button onClick={submit} disabled={!name.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 text-sm">
          <Play size={16} /> Program Run Garne
        </button>
      )}
    </div>
  );
}

/* ===== MAIN ORCHESTRATOR ===== */
export default function ProgrammingSimulation() {
  const { setScreen } = useGameStore();
  const [progScreen, setProgScreen] = useState<ProgScreen>('intro');
  const [xp, setXp] = useState(0);

  const addXp = (n: number) => setXp(p => p + n);
  const nextScreen: Record<ProgScreen, ProgScreen> = {
    intro: 'flow', flow: 'build', build: 'logic', logic: 'variables',
    variables: 'code', code: 'debug', debug: 'execution', execution: 'challenge',
    challenge: 'final', final: 'final',
  };
  const handleNext = () => {
    const next = nextScreen[progScreen];
    if (next) setProgScreen(next);
  };

  const level = getProgLevel(xp);
  const progress = Object.keys(nextScreen).indexOf(progScreen);
  const total = Object.keys(nextScreen).length;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-border-light dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => setScreen('intro')} className="flex items-center gap-2 font-bold">
            <ChevronLeft size={18} /> Programming Sim
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
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }} animate={{ width: `${(progress / total) * 100}%` }} />
        </div>
      </div>

      {/* Screen content */}
      <div className="max-w-5xl mx-auto">
        {progScreen === 'intro' && <IntroScreen onNext={handleNext} />}
        {progScreen === 'flow' && <FlowScreen onNext={handleNext} />}
              {progScreen === 'build' && <BuildScreen onNext={handleNext} addXp={addXp} />}
        {progScreen === 'logic' && <LogicScreen onNext={handleNext} />}
        {progScreen === 'variables' && <VariablesScreen onNext={handleNext} />}
        {progScreen === 'code' && <CodeScreen onNext={handleNext} />}
              {progScreen === 'debug' && <DebugScreen onNext={handleNext} addXp={addXp} />}
        {progScreen === 'execution' && <ExecutionScreen onNext={handleNext} />}
              {progScreen === 'challenge' && <ChallengeScreen onNext={handleNext} addXp={addXp} />}
        {progScreen === 'final' && <FinalScreen onComplete={() => { setXp(0); setProgScreen('intro'); }} xp={xp} addXp={addXp} />}
      </div>
    </div>
  );
}
