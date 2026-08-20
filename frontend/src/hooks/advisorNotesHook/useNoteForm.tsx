/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
// hooks/advisorNotesHook/useNoteForm.ts
import { useState, useEffect, useCallback } from 'react';
import { NoteFormData } from './types/advisorNoteType';

const DEFAULT_FORM_DATA: NoteFormData = {
    id:0,
  title: '',
  content: '',
};

export const useNoteForm = (initialData?: NoteFormData) => {
  const [formData, setFormData] = useState<NoteFormData>(DEFAULT_FORM_DATA);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    const isValid = formData.title.trim().length > 0 && 
                   formData.content.trim().length > 0;
    setIsFormValid(isValid);
  }, [formData]);

  const updateField = useCallback(<K extends keyof NoteFormData>(
    field: K,
    value: NoteFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  const setForm = useCallback((data: NoteFormData) => {
    setFormData(data);
  }, []);

  return {
    formData,
    isFormValid,
    updateField,
    resetForm,
    setForm,
    titleLength: formData.title.length,
    contentLength: formData.content.length
  };
};