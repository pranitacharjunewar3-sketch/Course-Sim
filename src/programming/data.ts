export type ProgScreen =
  | 'intro'
  | 'flow'
  | 'build'
  | 'logic'
  | 'variables'
  | 'code'
  | 'debug'
  | 'execution'
  | 'challenge'
  | 'final';

export type BlockType = 'input' | 'add' | 'sub' | 'mul' | 'div' | 'loop' | 'condition' | 'output';

export interface ProgBlock {
  id: string;
  type: BlockType;
  label: string;
  emoji: string;
  color: string;
}

export const availableBlocks: ProgBlock[] = [
  { id: 'b-input', type: 'input', label: 'INPUT', emoji: '📥', color: '#6366f1' },
  { id: 'b-add', type: 'add', label: '+ (ADD)', emoji: '➕', color: '#22c55e' },
  { id: 'b-sub', type: 'sub', label: '- (SUB)', emoji: '➖', color: '#ef4444' },
  { id: 'b-mul', type: 'mul', label: '× (MUL)', emoji: '✖️', color: '#f59e0b' },
  { id: 'b-div', type: 'div', label: '÷ (DIV)', emoji: '➗', color: '#ec4899' },
  { id: 'b-loop', type: 'loop', label: 'LOOP', emoji: '🔁', color: '#06b6d4' },
  { id: 'b-condition', type: 'condition', label: 'CONDITION', emoji: '❓', color: '#8b5cf6' },
  { id: 'b-output', type: 'output', label: 'OUTPUT', emoji: '📤', color: '#64748b' },
];

export interface ChallengeQuestion {
  question: string;
  answer: string;
  options: string[];
}

export const challengeQuestions: ChallengeQuestion[] = [
  { question: '2 + 3 ko result k huncha?', answer: '5', options: ['5', '6', '23', '3'] },
  { question: 'Program bhaneko k ho?', answer: 'Step by step instruction', options: ['Step by step instruction', 'Random data', 'Computer parts', 'Internet'] },
  { question: 'Variable bhaneko k ho?', answer: 'Data rakhne container', options: ['Data rakhne container', 'Program', 'Monitor', 'Keyboard'] },
  { question: 'Input pachi ke huncha?', answer: 'Process', options: ['Process', 'Output', 'Delete', 'Sleep'] },
  { question: 'If age > 18 → ?', answer: 'Adult', options: ['Adult', 'Child', 'Teen', 'Baby'] },
];

export const debugPuzzles = [
  {
    broken: [availableBlocks[0], availableBlocks[7]], // INPUT → OUTPUT (missing process)
    missing: availableBlocks[1], // ADD
    hint: 'Mathi ADD block rakhna birseko cha',
  },
];

export function getProgLevel(xp: number): { name: string; icon: string; color: string } {
  if (xp >= 80) return { name: 'Code Master', icon: '👑', color: '#f59e0b' };
  if (xp >= 40) return { name: 'Junior Programmer', icon: '🌟', color: '#6366f1' };
  return { name: 'Beginner Programmer', icon: '🌱', color: '#22c55e' };
}

export const progScreenNames: Record<ProgScreen, string> = {
  intro: 'Programming K Ho?',
  flow: 'Programming Kasari Kam Garcha?',
  build: 'Aafno Program Bana',
  logic: 'Program Ko Logic',
  variables: 'Variable K Ho?',
  code: 'Code Lekhera Her',
  debug: 'Bug Khoja',
  execution: 'Program Execution',
  challenge: 'Challenge Mode',
  final: 'Final Simulation',
};
