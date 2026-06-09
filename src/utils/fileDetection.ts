import type { SimFile, ChallengeQuestion } from '../types';

const structuredExtensions = ['csv', 'xlsx', 'xls', 'sql', 'json', 'xml', 'db', 'mdb'];
const unstructuredExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mov', 'mkv', 'mp3', 'wav', 'ogg', 'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'zip', 'rar'];

export function detectFileType(fileName: string): 'structured' | 'unstructured' {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (structuredExtensions.includes(ext)) return 'structured';
  if (unstructuredExtensions.includes(ext)) return 'unstructured';
  return 'unstructured';
}

export function createSimFile(fileName: string): SimFile {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return {
    id: `${fileName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: fileName,
    extension: ext,
    type: detectFileType(fileName),
  };
}

export function getFileIcon(ext: string): string {
  const iconMap: Record<string, string> = {
    csv: 'file-spreadsheet',
    xlsx: 'file-spreadsheet',
    xls: 'file-spreadsheet',
    sql: 'database',
    json: 'file-code',
    xml: 'file-code',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    bmp: 'image',
    webp: 'image',
    mp4: 'video',
    avi: 'video',
    mov: 'video',
    mkv: 'video',
    mp3: 'music',
    wav: 'music',
    ogg: 'music',
    pdf: 'file-text',
    doc: 'file-text',
    docx: 'file-text',
    txt: 'file-text',
    ppt: 'presentation',
    pptx: 'presentation',
    zip: 'archive',
    rar: 'archive',
  };
  return iconMap[ext] || 'file';
}

export function getFileColor(ext: string): string {
  if (['csv', 'xlsx', 'xls'].includes(ext)) return '#22c55e';
  if (['sql', 'json', 'xml', 'db'].includes(ext)) return '#6366f1';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '#f59e0b';
  if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return '#ef4444';
  if (['mp3', 'wav', 'ogg'].includes(ext)) return '#ec4899';
  if (['pdf'].includes(ext)) return '#ef4444';
  if (['doc', 'docx', 'txt'].includes(ext)) return '#3b82f6';
  return '#64748b';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function detectFolderContents(files: string[]): { structured: number; unstructured: number } {
  let structured = 0;
  let unstructured = 0;
  files.forEach(f => {
    if (detectFileType(f) === 'structured') structured++;
    else unstructured++;
  });
  return { structured, unstructured };
}

export const challengeQuestions: ChallengeQuestion[] = [
  { fileName: 'Student.xlsx', correctAnswer: 'structured', reason: 'Excel file (.xlsx) row ra column ma organize huncha', icon: 'file-spreadsheet' },
  { fileName: 'HolidayPhoto.jpg', correctAnswer: 'unstructured', reason: 'Image file (.jpg) fixed structure hudaina', icon: 'image' },
  { fileName: 'Music.mp3', correctAnswer: 'unstructured', reason: 'Audio file (.mp3) fixed structure hudaina', icon: 'music' },
  { fileName: 'Employee.csv', correctAnswer: 'structured', reason: 'CSV file (.csv) row ra column ma organize huncha', icon: 'file-spreadsheet' },
  { fileName: 'Video.mp4', correctAnswer: 'unstructured', reason: 'Video file (.mp4) fixed structure hudaina', icon: 'video' },
  { fileName: 'Database.sql', correctAnswer: 'structured', reason: 'SQL file (.sql) structured format ma huncha', icon: 'database' },
  { fileName: 'Document.pdf', correctAnswer: 'unstructured', reason: 'PDF file (.pdf) fixed structure hudaina', icon: 'file-text' },
  { fileName: 'Data.json', correctAnswer: 'structured', reason: 'JSON file (.json) organized structure huncha', icon: 'file-code' },
  { fileName: 'Photo.png', correctAnswer: 'unstructured', reason: 'Image file (.png) fixed structure hudaina', icon: 'image' },
  { fileName: 'Marks.csv', correctAnswer: 'structured', reason: 'CSV file (.csv) row ra column ma organize huncha', icon: 'file-spreadsheet' },
  { fileName: 'Audio.wav', correctAnswer: 'unstructured', reason: 'Audio file (.wav) fixed structure hudaina', icon: 'music' },
  { fileName: 'Report.docx', correctAnswer: 'unstructured', reason: 'Word file (.docx) fixed structure hudaina', icon: 'file-text' },
];

export const sampleStructuredFiles = [
  'students.xlsx', 'employees.csv', 'database.sql', 'data.json', 'config.xml'
];

export const sampleUnstructuredFiles = [
  'photo.jpg', 'video.mp4', 'music.mp3', 'document.pdf', 'notes.txt'
];
