import { create } from 'zustand';
import type { Screen, Theme } from '../types';
import { virtualItems } from '../utils/fakeData';
import type { VirtualItem } from '../utils/fakeData';

interface ClassifiedEntry {
  item: VirtualItem;
  droppedAs: 'structured' | 'unstructured';
  correct: boolean;
}

interface GameState {
  screen: Screen;
  setScreen: (screen: Screen) => void;

  score: number;
  addScore: (points: number) => void;
  wrongDrops: number;
  addWrongDrop: () => void;

  classified: ClassifiedEntry[];
  classifyItem: (item: VirtualItem, targetType: 'structured' | 'unstructured') => void;
  isClassified: (id: string) => boolean;
  getUnclassified: () => VirtualItem[];
  allClassified: () => boolean;

  autoClassifying: boolean;
  setAutoClassifying: (v: boolean) => void;
  autoClassifyNext: () => void;

  resetSimulation: () => void;

  theme: Theme;
  toggleTheme: () => void;

  challengeIndex: number;
  challengeCorrect: number;
  challengeWrong: number;
  nextChallenge: () => void;
  addChallengeCorrect: () => void;
  addChallengeWrong: () => void;
  resetChallenge: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'intro',
  setScreen: (screen) => set({ screen }),

  score: 0,
  addScore: (points) => set((s) => ({ score: Math.max(0, s.score + points) })),
  wrongDrops: 0,
  addWrongDrop: () => set((s) => ({ wrongDrops: s.wrongDrops + 1 })),

  classified: [],
  classifyItem: (item, targetType) => {
    const state = get();
    if (state.isClassified(item.id)) return;

    const isMixed = item.structureType === 'mixed';
    const correct = !isMixed && item.structureType === targetType;

    const entry: ClassifiedEntry = { item, droppedAs: targetType, correct };
    set((s) => ({
      classified: [...s.classified, entry],
      score: correct ? s.score + 10 : Math.max(0, s.score - 5),
      wrongDrops: correct ? s.wrongDrops : s.wrongDrops + 1,
    }));
  },

  isClassified: (id) => get().classified.some((c) => c.item.id === id),

  getUnclassified: () => {
    const classifiedIds = new Set(get().classified.map((c) => c.item.id));
    return virtualItems.filter((i) => !classifiedIds.has(i.id));
  },

  allClassified: () => {
    const classifiedIds = new Set(get().classified.map((c) => c.item.id));
    return virtualItems.every((i) => classifiedIds.has(i.id));
  },

  autoClassifying: false,
  setAutoClassifying: (v) => set({ autoClassifying: v }),

  autoClassifyNext: () => {
    const state = get();
    const unclassified = state.getUnclassified();
    if (unclassified.length === 0) return;

    const item = unclassified[0];
    if (item.structureType === 'mixed') return;
    state.classifyItem(item, item.structureType === 'structured' ? 'structured' : 'unstructured');
  },

  resetSimulation: () =>
    set({
      score: 0,
      wrongDrops: 0,
      classified: [],
      autoClassifying: false,
      challengeIndex: 0,
      challengeCorrect: 0,
      challengeWrong: 0,
    }),

  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

  challengeIndex: 0,
  challengeCorrect: 0,
  challengeWrong: 0,
  nextChallenge: () => set((s) => ({ challengeIndex: s.challengeIndex + 1 })),
  addChallengeCorrect: () => set((s) => ({ challengeCorrect: s.challengeCorrect + 1 })),
  addChallengeWrong: () => set((s) => ({ challengeWrong: s.challengeWrong + 1 })),
  resetChallenge: () => set({ challengeIndex: 0, challengeCorrect: 0, challengeWrong: 0 }),
}));
