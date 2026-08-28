/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useGuidelineForm.ts
import { useState } from "react";
import { DegreeGuidlineModel } from "@/src/models/degreeGuidlineModel";
import { FormData, FormErrors, GuidelineFormHookProps } from "@/components/Guidelines/types";

export const useGuidelineForm = ({
  createGuideline,
  updateGuideline,
  fetchGuidelines,
}: GuidelineFormHookProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<DegreeGuidlineModel | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    programIds: [],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      programIds: [],
    });
    setFormErrors({});
    setEditingGuideline(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (guideline: DegreeGuidlineModel) => {
    setEditingGuideline(guideline);
    setFormData({
      title: guideline.title,
      description: guideline.description,
      programIds: guideline.programId ? [guideline.programId] : [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleProgramSelection = (programId: number) => {
    setFormData(prev => {
      const ids = prev.programIds.includes(programId)
        ? prev.programIds.filter(id => id !== programId)
        : [...prev.programIds, programId];
      return { ...prev, programIds: ids };
    });
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (formData.programIds.length === 0) {
      errors.programIds = "Please select at least one program";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let result;
      if (editingGuideline) {
        result = await updateGuideline(editingGuideline.id, {
          title: formData.title,
          description: formData.description,
          programIds: formData.programIds,
        });
      } else {
        result = await createGuideline({
          title: formData.title,
          description: formData.description,
          programIds: formData.programIds,
        });
      }

      if (result.success) {
        setIsModalOpen(false);
        resetForm();
        await fetchGuidelines(undefined, undefined, true);
        return result;
      } else {
        setFormErrors({ submit: result.error || "Failed to save guideline" });
        return result;
      }
    } catch (error: any) {
      setFormErrors({ submit: error.message || "An error occurred" });
      return { success: false, error: error.message };
    }
  };

  return {
    formData,
    formErrors,
    editingGuideline,
    isModalOpen,
    resetForm,
    handleInputChange,
    handleProgramSelection,
    handleCreate,
    handleEdit,
    handleSubmit,
    setFormErrors,
    setIsModalOpen,
  };
};