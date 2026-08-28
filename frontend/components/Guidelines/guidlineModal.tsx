// components/GuidelineModal.tsx
import React from "react";
import { X, AlertCircle, Save, Loader2, Check } from "lucide-react";
import { DegreeGuidlineModel } from "@/src/models/degreeGuidlineModel";
import { Program } from "@/src/models/programModel";
import { FormData, FormErrors } from "./types";

interface GuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGuideline: DegreeGuidlineModel | null;
  formData: FormData;
  formErrors: FormErrors;
  programs: Program[];
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProgramSelection: (programId: number) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const GuidelineModal: React.FC<GuidelineModalProps> = ({
  isOpen,
  onClose,
  editingGuideline,
  formData,
  formErrors,
  programs,
  isLoading,
  onInputChange,
  onProgramSelection,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between z-10">
          <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight">
            {editingGuideline ? "Edit Guideline" : "Create New Guideline"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 md:p-6 space-y-5">
          {formErrors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {formErrors.submit}
            </div>
          )}

          <FormField
            label="Title"
            name="title"
            value={formData.title}
            error={formErrors.title}
            onChange={onInputChange}
            placeholder="Enter guideline title"
            type="text"
          />

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            error={formErrors.description}
            onChange={onInputChange}
            placeholder="Enter detailed description of the guideline"
            type="textarea"
            rows={4}
          />

          <ProgramSelection
            programs={programs}
            selectedIds={formData.programIds}
            error={formErrors.programIds}
            onToggle={onProgramSelection}
          />

          <FormActions
            onCancel={onClose}
            isLoading={isLoading}
            isEditing={!!editingGuideline}
          />
        </form>
      </div>
    </div>
  );
};

// Form Field Sub-component
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: "text" | "textarea";
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
  rows,
}) => {
  const InputComponent = type === "textarea" ? "textarea" : "input";
  
  return (
    <div>
      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
        {label} *
      </label>
      <InputComponent
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] ${
          error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Program Selection Sub-component
interface ProgramSelectionProps {
  programs: Program[];
  selectedIds: number[];
  error?: string;
  onToggle: (programId: number) => void;
}

const ProgramSelection: React.FC<ProgramSelectionProps> = ({
  programs,
  selectedIds,
  error,
  onToggle,
}) => {
  return (
    <div>
      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
        Select Programs *
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
        {programs.map((program) => (
          <label
            key={program.id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedIds.includes(program.id)
                ? "bg-[#1e3a5f] text-white"
                : "hover:bg-slate-100"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(program.id)}
              onChange={() => onToggle(program.id)}
              className="hidden"
            />
            <Check
              size={16}
              className={`${
                selectedIds.includes(program.id)
                  ? "text-white"
                  : "text-transparent"
              }`}
            />
            <span className="text-xs font-medium">{program.programName}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {programs.length === 0 && (
        <p className="text-xs text-slate-400 mt-1">
          No programs available. Please create a program first.
        </p>
      )}
    </div>
  );
};

// Form Actions Sub-component
interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isLoading,
  isEditing,
}) => {
  return (
    <div className="flex gap-3 pt-4 border-t border-slate-200">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase hover:bg-slate-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl text-xs font-black uppercase hover:bg-[#15304a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Save size={18} />
        )}
        {isEditing ? "Update" : "Create"}
      </button>
    </div>
  );
};