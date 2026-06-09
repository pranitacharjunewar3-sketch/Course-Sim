export interface ContentBlock {
  type: 'table' | 'image' | 'audio' | 'video' | 'text';
  headers?: string[];
  rows?: string[][];
  icon?: string;
  label?: string;
  description?: string;
}

export interface VirtualItem {
  id: string;
  name: string;
  kind: 'file' | 'folder';
  structureType: 'structured' | 'unstructured' | 'mixed';
  emoji: string;
  previewTitle: string;
  previewSubtitle: string;
  content: ContentBlock[];
}

export function getLevel(score: number): { name: string; icon: string; color: string } {
  if (score >= 80) return { name: 'Data Master', icon: '🏆', color: '#f59e0b' };
  if (score >= 30) return { name: 'Explorer', icon: '🔍', color: '#6366f1' };
  return { name: 'Beginner', icon: '🐣', color: '#22c55e' };
}

export function getExplanation(item: VirtualItem, targetType: string): string {
  if (item.structureType === 'structured' && targetType === 'unstructured') {
    return `"${item.name}" ma data row ra column ma organized cha. Yo Structured Data ho, unstructured box ma rakhna mildaina.`;
  }
  if (item.structureType === 'unstructured' && targetType === 'structured') {
    return `"${item.name}" ma fixed table chaina, data organized format ma chaina. Yo Unstructured Data ho, structured box ma rakhna mildaina.`;
  }
  if (item.structureType === 'mixed') {
    return `"${item.name}" ma structured ra unstructured data duitai cha. Pahile content hera ani decide gara.`;
  }
  return `Galat classification! Pheri prayas gara.`;
}

export const virtualItems: VirtualItem[] = [
  // ===== STRUCTURED (table content) =====
  {
    id: 'v1', name: 'School Data', kind: 'folder', structureType: 'structured', emoji: '📁',
    previewTitle: '📁 School Data',
    previewSubtitle: 'Yo folder ma student records cha — table format ma organize gareko',
    content: [
      {
        type: 'table',
        headers: ['Name', 'Age', 'Marks'],
        rows: [
          ['Ram', '20', '80'],
          ['Sita', '19', '90'],
          ['Hari', '21', '75'],
          ['Gita', '20', '88'],
        ],
      },
    ],
  },
  {
    id: 'v2', name: 'Employee Records', kind: 'folder', structureType: 'structured', emoji: '📁',
    previewTitle: '📁 Employee Records',
    previewSubtitle: 'Staff records — row ra column ma milayeko',
    content: [
      {
        type: 'table',
        headers: ['ID', 'Name', 'Salary', 'Department'],
        rows: [
          ['101', 'Ram', '30000', 'IT'],
          ['102', 'Sita', '50000', 'HR'],
          ['103', 'Hari', '45000', 'Finance'],
        ],
      },
    ],
  },
  {
    id: 'v3', name: 'Student Marks', kind: 'file', structureType: 'structured', emoji: '📄',
    previewTitle: '📄 Student Marks',
    previewSubtitle: 'Prati student ko marks — table ma organized',
    content: [
      {
        type: 'table',
        headers: ['Subject', 'Marks', 'Grade'],
        rows: [
          ['Math', '95', 'A'],
          ['Science', '88', 'A'],
          ['English', '76', 'B'],
          ['Nepali', '82', 'A'],
        ],
      },
    ],
  },
  {
    id: 'v4', name: 'Attendance', kind: 'file', structureType: 'structured', emoji: '📄',
    previewTitle: '📄 Attendance Sheet',
    previewSubtitle: 'Hajiri records — row ra column ma',
    content: [
      {
        type: 'table',
        headers: ['Student', 'Status', 'Date'],
        rows: [
          ['Ram', 'Present', '2082-01-15'],
          ['Sita', 'Present', '2082-01-15'],
          ['Hari', 'Absent', '2082-01-15'],
          ['Gita', 'Present', '2082-01-15'],
        ],
      },
    ],
  },

  // ===== UNSTRUCTURED (no table, free-form) =====
  {
    id: 'v5', name: 'Photo Album', kind: 'folder', structureType: 'unstructured', emoji: '📁',
    previewTitle: '📁 Photo Album',
    previewSubtitle: 'Tasbir haru — kunai table chaina, fixed structure chaina',
    content: [
      { type: 'image', icon: '🏔️', label: 'Himalaya Photo', description: 'Snow-capped mountains landscape' },
      { type: 'image', icon: '🌊', label: 'Beach Photo', description: 'Sunset at the beach' },
      { type: 'image', icon: '🌺', label: 'Flower Photo', description: 'Red hibiscus close-up' },
    ],
  },
  {
    id: 'v6', name: 'Media Collection', kind: 'folder', structureType: 'unstructured', emoji: '📁',
    previewTitle: '📁 Media Collection',
    previewSubtitle: 'Audio ra video files — fixed table chaina',
    content: [
      { type: 'audio', icon: '🎵', label: 'Song.mp3', description: '3:45 — Nepali folk song' },
      { type: 'video', icon: '🎬', label: 'Video.mp4', description: '5:20 — School documentary' },
      { type: 'audio', icon: '🎤', label: 'VoiceNote.wav', description: '1:15 — Class recording' },
    ],
  },
  {
    id: 'v7', name: 'News Article', kind: 'file', structureType: 'unstructured', emoji: '📄',
    previewTitle: '📄 News Article',
    previewSubtitle: 'Samachar — paragraph format, table chaina',
    content: [
      {
        type: 'text',
        icon: '📰',
        label: 'Today News',
        description: 'Nepal ma ajha naya sikshya niti laagu gareko cha. Yahaan 10+2 paddhati lai sudhar garer naya gyan-moolak paddhati lyayeko cha. Yo naya paddhati ma bidyarthi lai pratyaksh gyan pradaan garna aanudaan diyeko cha. Bidhyalaya haru ma yehi nya paddhati anusar pathya-kram tayar gari rakheka chan.',
      },
    ],
  },
  {
    id: 'v8', name: 'Voice Note', kind: 'file', structureType: 'unstructured', emoji: '📄',
    previewTitle: '📄 Voice Note',
    previewSubtitle: 'Awaz recording — kunai structure chaina',
    content: [
      { type: 'audio', icon: '🎙️', label: 'Lecture Recording', description: '12:30 — Science class recording' },
    ],
  },

  // ===== MIXED =====
  {
    id: 'v9', name: 'Mixed Folder', kind: 'folder', structureType: 'mixed', emoji: '📁',
    previewTitle: '📁 Mixed Folder',
    previewSubtitle: 'Yo folder ma structured ra unstructured data duitai cha',
    content: [
      { type: 'table', headers: ['Name', 'Score'], rows: [['Ram', '85'], ['Sita', '92']] },
      { type: 'image', icon: '🖼️', label: 'Class Photo', description: 'Group photo of students' },
      { type: 'audio', icon: '🎵', label: 'Background Music', description: 'Instrumental — 2:30' },
    ],
  },
];

export const totalItems = virtualItems.length;
