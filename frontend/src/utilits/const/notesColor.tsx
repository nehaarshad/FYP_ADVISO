// utils/noteColors.ts
export interface NoteColor {
  bg: string;
  border: string;
  text: string;
  shadow: string;
  hoverShadow: string;
}

export const NOTE_COLORS: NoteColor[] = [
  {
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    shadow: 'shadow-yellow-200/30',
    hoverShadow: 'hover:shadow-yellow-300/50'
  },
  {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-900',
    shadow: 'shadow-pink-200/30',
    hoverShadow: 'hover:shadow-pink-300/50'
  },
  {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-900',
    shadow: 'shadow-blue-200/30',
    hoverShadow: 'hover:shadow-blue-300/50'
  },
  {
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-900',
    shadow: 'shadow-green-200/30',
    hoverShadow: 'hover:shadow-green-300/50'
  },
  {
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-900',
    shadow: 'shadow-purple-200/30',
    hoverShadow: 'hover:shadow-purple-300/50'
  },
  {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-900',
    shadow: 'shadow-orange-200/30',
    hoverShadow: 'hover:shadow-orange-300/50'
  },
  {
    bg: 'bg-teal-100',
    border: 'border-teal-200',
    text: 'text-teal-900',
    shadow: 'shadow-teal-200/30',
    hoverShadow: 'hover:shadow-teal-300/50'
  },
  {
    bg: 'bg-rose-100',
    border: 'border-rose-200',
    text: 'text-rose-900',
    shadow: 'shadow-rose-200/30',
    hoverShadow: 'hover:shadow-rose-300/50'
  },
  {
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
    shadow: 'shadow-indigo-200/30',
    hoverShadow: 'hover:shadow-indigo-300/50'
  },
  {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-900',
    shadow: 'shadow-amber-200/30',
    hoverShadow: 'hover:shadow-amber-300/50'
  },
  {
    bg: 'bg-lime-100',
    border: 'border-lime-200',
    text: 'text-lime-900',
    shadow: 'shadow-lime-200/30',
    hoverShadow: 'hover:shadow-lime-300/50'
  },
  {
    bg: 'bg-cyan-100',
    border: 'border-cyan-200',
    text: 'text-cyan-900',
    shadow: 'shadow-cyan-200/30',
    hoverShadow: 'hover:shadow-cyan-300/50'
  },
];

export const getNoteColor = (noteId: number | string): NoteColor => {
  const id = typeof noteId === 'string' ? parseInt(noteId) : noteId;
  const colorIndex = id % NOTE_COLORS.length;
  return NOTE_COLORS[colorIndex];
};

export const getRandomNoteColor = (): NoteColor => {
  const randomIndex = Math.floor(Math.random() * NOTE_COLORS.length);
  return NOTE_COLORS[randomIndex];
};