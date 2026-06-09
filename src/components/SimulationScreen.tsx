import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Sparkles, Brain, CheckCircle2, XCircle, ArrowRight, Zap, Eye } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { virtualItems, getLevel, getExplanation, totalItems } from '../utils/fakeData';
import type { VirtualItem, ContentBlock } from '../utils/fakeData';

function ContentRenderer({ block }: { block: ContentBlock }) {
  if (block.type === 'table' && block.headers && block.rows) {
    return (
      <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-primary/10">
              {block.headers.map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-border-light dark:border-border-dark">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === 'image' || block.type === 'audio' || block.type === 'video') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark">
        <span className="text-3xl">{block.icon || '📄'}</span>
        <div>
          <p className="font-semibold text-sm">{block.label}</p>
          {block.description && <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{block.description}</p>}
        </div>
      </div>
    );
  }
  if (block.type === 'text') {
    return (
      <div className="p-4 rounded-xl bg-white/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{block.icon || '📝'}</span>
          <span className="font-semibold text-sm">{block.label}</span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary dark:text-text-dark-secondary">{block.description}</p>
      </div>
    );
  }
  return null;
}

export default function SimulationScreen() {
  const { setScreen, score, classified, classifyItem, isClassified, getUnclassified, allClassified, resetSimulation } = useGameStore();

  const [selectedItem, setSelectedItem] = useState<VirtualItem | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'structured' | 'unstructured' | null>(null);
  const [scanItem, setScanItem] = useState<VirtualItem | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState(0);
  const [lastResult, setLastResult] = useState<{ item: VirtualItem; correct: boolean; targetType: string } | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [autoDemoActive, setAutoDemoActive] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = getLevel(score);
  const unclassified = getUnclassified();
  const classifiedCount = totalItems - unclassified.length;

  useEffect(() => {
    if (allClassified() && classifiedCount > 0) {
      setTimeout(() => setShowCompletion(true), 600);
    }
  }, [classifiedCount, allClassified]);

  const runScan = (item: VirtualItem, targetType: 'structured' | 'unstructured') => {
    setScanItem(item);
    setScanProgress(0);
    setScanPhase(0);
    setLastResult(null);

    const interval = setInterval(() => {
      setScanProgress((p) => {
        const next = p + 5;
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 40);

    setTimeout(() => setScanPhase(1), 300);
    setTimeout(() => setScanPhase(2), 700);
    setTimeout(() => { clearInterval(interval); setScanProgress(100); setScanPhase(3); }, 1100);

    setTimeout(() => {
      const isMixed = item.structureType === 'mixed';
      const correct = !isMixed && item.structureType === targetType;
      setLastResult({ item, correct, targetType });
      classifyItem(item, targetType);
      setScanItem(null);
      setSelectedItem(null);
    }, 1600);
  };

  const handleDragStart = (e: React.DragEvent, item: VirtualItem) => {
    if (isClassified(item.id)) { e.preventDefault(); return; }
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetType: 'structured' | 'unstructured') => {
    e.preventDefault();
    setDragOverZone(null);
    const id = e.dataTransfer.getData('text/plain');
    const item = virtualItems.find((i) => i.id === id);
    if (!item || isClassified(item.id)) return;
    runScan(item, targetType);
  };

  const handleAutoDemo = () => {
    setAutoDemoActive(true);
    const remaining = useGameStore.getState().getUnclassified().filter((i) => i.structureType !== 'mixed');
    if (remaining.length === 0) { setAutoDemoActive(false); return; }
    let idx = 0;
    const showNext = () => {
      if (idx >= remaining.length) { setAutoDemoActive(false); return; }
      const item = remaining[idx];
      setSelectedItem(item);
      setTimeout(() => {
        const target = item.structureType as 'structured' | 'unstructured';
        runScan(item, target);
        idx++;
        autoTimerRef.current = setTimeout(showNext, 2200);
      }, 1200);
    };
    showNext();
  };

  useEffect(() => {
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, []);

  const handleRestart = () => {
    resetSimulation();
    setShowCompletion(false);
    setLastResult(null);
    setScanItem(null);
    setSelectedItem(null);
    setAutoDemoActive(false);
  };

  const scanPhases = ['Content padhdai...', 'Structure detect gardai...', 'Classification complete!'];

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setScreen('data-types')} className="flex items-center gap-1 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-primary">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: level.color + '20', color: level.color }}>
              <span>{level.icon}</span>
              <span className="text-xs font-bold">{level.name}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-bold">
              <Trophy size={14} /> {score}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-4">
          {/* LEFT: File Explorer — items are draggable directly */}
          <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-4">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" /> File Explorer
            </h2>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-3">
              Item click → preview hera. File lai direct drag garera box ma chodne.
            </p>
            <div className="space-y-1 max-h-[55vh] overflow-y-auto">
              {virtualItems.map((item) => {
                const classified = isClassified(item.id);
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => { if (!classified) setSelectedItem(item); }}
                    draggable={!classified}
                    onDragStart={(e) => handleDragStart(e, item)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm select-none ${
                      classified
                        ? 'opacity-40 bg-gray-50 dark:bg-gray-800/50 line-through cursor-default'
                        : isSelected
                          ? 'bg-primary/10 border border-primary/30 cursor-pointer'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs truncate">{item.name}</div>
                      <div className="flex gap-1 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          item.structureType === 'structured'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                            : item.structureType === 'unstructured'
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700'
                        }`}>
                          {item.structureType === 'structured' ? 'S' : item.structureType === 'unstructured' ? 'U' : 'M'}
                        </span>
                        <span className="text-[10px] text-text-secondary dark:text-text-dark-secondary">{item.kind}</span>
                      </div>
                    </div>
                    {classified && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                    {!classified && isSelected && <Eye size={14} className="text-primary shrink-0" />}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-text-secondary dark:text-text-dark-secondary">{classifiedCount}/{totalItems} classified</div>
            <div className="mt-3 flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Structured</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Unstructured</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Mixed</span>
            </div>
          </div>

          {/* CENTER: Preview + Drop Zones */}
          <div className="space-y-4">
            {/* Preview Area */}
            <div className="min-h-[260px] bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-4">
              {selectedItem && !isClassified(selectedItem.id) ? (
                <div key={selectedItem.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-base">{selectedItem.previewTitle}</h3>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{selectedItem.previewSubtitle}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      selectedItem.structureType === 'structured'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                        : selectedItem.structureType === 'unstructured'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700'
                    }`}>
                      {selectedItem.structureType === 'structured' ? 'STRUCTURED' : selectedItem.structureType === 'unstructured' ? 'UNSTRUCTURED' : 'MIXED'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedItem.content.map((block, i) => (
                      <ContentRenderer key={i} block={block} />
                    ))}
                  </div>
                  <p className="text-center text-xs text-text-secondary dark:text-text-dark-secondary mt-3">
                    ↑ Mathi bata item lai directly box ma drag gara
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary dark:text-text-dark-secondary py-12">
                  <Eye size={32} className="mb-2 opacity-40" />
                  <p className="text-sm font-medium">Preview</p>
                  <p className="text-xs">Left bata item click gara → content hera</p>
                </div>
              )}
            </div>

            {/* Drop Zones — both accept dropped items */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Structured Box</span>
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverZone('structured'); }}
                  onDragLeave={() => setDragOverZone(null)}
                  onDrop={(e) => handleDrop(e, 'structured')}
                  className={`relative min-h-[140px] rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-colors ${
                    dragOverZone === 'structured'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : 'border-green-300 dark:border-green-700 bg-white/40 dark:bg-card-dark/40'
                  }`}
                >
                  <span className="text-3xl mb-1">📊</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary">Drop file here</span>
                  <span className="text-[10px] text-text-secondary dark:text-text-dark-secondary mt-1">Rows + Columns → Organized</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">Unstructured Box</span>
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverZone('unstructured'); }}
                  onDragLeave={() => setDragOverZone(null)}
                  onDrop={(e) => handleDrop(e, 'unstructured')}
                  className={`relative min-h-[140px] rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-colors ${
                    dragOverZone === 'unstructured'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                      : 'border-orange-300 dark:border-orange-700 bg-white/40 dark:bg-card-dark/40'
                  }`}
                >
                  <span className="text-3xl mb-1">🎲</span>
                  <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary">Drop file here</span>
                  <span className="text-[10px] text-text-secondary dark:text-text-dark-secondary mt-1">No fixed structure → Free form</span>
                </div>
              </div>
            </div>

            {!autoDemoActive && unclassified.some(i => i.structureType !== 'mixed') && (
              <button
                onClick={handleAutoDemo}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Zap size={16} /> Show Example — Auto Classification
              </button>
            )}
            {autoDemoActive && (
              <div className="text-center py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm font-medium text-primary">
                🤖 Auto demonstration chalirahecha...
              </div>
            )}
          </div>

          {/* RIGHT: Results */}
          <div className="bg-white/60 dark:bg-card-dark/60 rounded-2xl border border-border-light dark:border-border-dark p-4">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Brain size={14} className="text-primary" /> Result
            </h2>
            {classified.length === 0 && (
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary text-center py-8">
                Item click gara → preview hera → left bata box ma drag gara
              </p>
            )}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {classified.map((entry) => (
                <div
                  key={entry.item.id}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs border ${
                    entry.correct
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  }`}
                >
                  {entry.correct ? <CheckCircle2 size={14} className="text-green-600 shrink-0" /> : <XCircle size={14} className="text-red-600 shrink-0" />}
                  <span className={`font-medium truncate ${entry.correct ? '' : 'line-through'}`}>{entry.item.name}</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    entry.droppedAs === 'structured'
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700'
                      : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700'
                  }`}>{entry.droppedAs === 'structured' ? 'S' : 'U'}</span>
                </div>
              ))}
            </div>
            {classified.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-green-600 font-medium">✅ {classified.filter(c => c.correct).length}</span>
                  <span className="text-red-600 font-medium">❌ {classified.filter(c => !c.correct).length}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-primary transition-all duration-500" style={{ width: `${(classifiedCount / totalItems) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SCAN OVERLAY */}
        <AnimatePresence>
          {scanItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white dark:bg-card-dark rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
                <div className="text-5xl mb-4">{scanItem.emoji}</div>
                <p className="font-bold text-lg mb-1">{scanItem.name}</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">{scanPhases[Math.min(scanPhase, 2)]}</p>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600" initial={{ width: '0%' }} animate={{ width: `${scanProgress}%` }} />
                </div>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{scanProgress}%</p>
                {scanPhase >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs font-medium">
                    {scanItem.structureType === 'structured' && <span className="text-green-600">📊 Structure: Rows + Columns — Organized</span>}
                    {scanItem.structureType === 'unstructured' && <span className="text-orange-600">🎲 Structure: No fixed format — Free form</span>}
                    {scanItem.structureType === 'mixed' && <span className="text-purple-600">🔀 Structure: Mixed data</span>}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT TOAST */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
            >
              <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border max-w-md ${
                lastResult.correct
                  ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700'
              }`}>
                {lastResult.correct ? <CheckCircle2 size={28} className="text-green-600 shrink-0" /> : <XCircle size={28} className="text-red-600 shrink-0" />}
                <div>
                  <p className={`font-bold text-sm ${lastResult.correct ? 'text-green-700' : 'text-red-700'}`}>
                    {lastResult.correct
                      ? `✅ Sahi! ${lastResult.item.name} → ${lastResult.targetType === 'structured' ? 'Structured' : 'Unstructured'} Data`
                      : `❌ Galat! ${lastResult.item.name} yo box ma rakhna mildaina`
                    }
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5">
                    {lastResult.correct ? '+10 XP' : getExplanation(lastResult.item, lastResult.targetType)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPLETION */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-white dark:bg-card-dark rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
              >
                <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.8 }} className="text-6xl mb-4">🎉</motion.div>
                <h2 className="text-2xl font-bold mb-2">Simulation Complete!</h2>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-6">Timile sabai items classify garyo!</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <div className="text-xl mb-1">📊</div>
                    <div className="font-bold text-green-700 dark:text-green-400">{classified.filter(c => c.droppedAs === 'structured').length}</div>
                    <div className="text-[10px] text-text-secondary">Structured</div>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                    <div className="text-xl mb-1">🎲</div>
                    <div className="font-bold text-orange-700 dark:text-orange-400">{classified.filter(c => c.droppedAs === 'unstructured').length}</div>
                    <div className="text-[10px] text-text-secondary">Unstructured</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="text-xl mb-1">🔀</div>
                    <div className="font-bold text-purple-700 dark:text-purple-400">{classified.filter(c => c.item.structureType === 'mixed').length}</div>
                    <div className="text-[10px] text-text-secondary">Mixed</div>
                  </div>
                </div>
                <div className="text-left p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6 text-sm">
                  <p className="font-semibold mb-1">📚 Learning:</p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Structured Data = Rows + Columns (table)</p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Unstructured Data = No fixed structure</p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Mixed Data = Duitai types cha</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={handleRestart} className="px-5 py-2.5 rounded-xl border border-border-light dark:border-border-dark font-medium text-sm hover:shadow-md transition-all">🔄 Play Again</button>
                  <button onClick={() => { setShowCompletion(false); setScreen('challenge'); }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2">Challenge <ArrowRight size={14} /></button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
