import { AdvisorNote } from "@/src/models/AdvisorNotes";

export interface CreateAdvisorNoteData {
  userId: number;
  title: string;
  noteContent: string;
}

export interface UpdateAdvisorNoteData {
  id: number;
  userId: number;
  title: string;
  noteContent: string;
}

export interface GetAdvisorNotesData {
  userId: number;
}

export interface NoteFormData {
  id:number;
  title: string;
  content: string;
}

export interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NoteFormData) => Promise<void>;
  initialData?: NoteFormData;
  isEditing?: boolean;
  isSaving?: boolean;
}

export interface NoteCardProps {
  note: AdvisorNote;
  onEdit: (note: AdvisorNote) => void;
  onDelete: (note: AdvisorNote) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  note: AdvisorNote | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}