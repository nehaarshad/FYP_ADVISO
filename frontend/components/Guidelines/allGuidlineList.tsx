// components/GuidelinesList.tsx
import React from "react";
import { Loader2, AlertCircle, FileText, GraduationCap, Edit, Trash2 } from "lucide-react";
import { DegreeGuidlineModel } from "@/src/models/degreeGuidlineModel";

interface GuidelinesListProps {
  guidelines: DegreeGuidlineModel[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (guideline: DegreeGuidlineModel) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  getProgramName: (programId: number | null) => string;
}

export const GuidelinesList: React.FC<GuidelinesListProps> = ({
  guidelines,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onCreate,
  getProgramName,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#1e3a5f]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
        <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
        <p className="text-red-600">{error}</p>
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (guidelines.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
        <FileText className="text-slate-300 mx-auto mb-3" size={48} />
        <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">No Guidelines Found</h3>
        <p className="text-slate-500 text-sm">
          Create your first degree guideline
        </p>
        <button
          onClick={onCreate}
          className="mt-4 px-6 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-[#15304a]"
        >
          Create Guideline
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {guidelines.map((guideline) => (
        <GuidelineCard
          key={guideline.id}
          guideline={guideline}
          onEdit={onEdit}
          onDelete={onDelete}
          getProgramName={getProgramName}
        />
      ))}
    </div>
  );
};

// Sub-component for individual guideline card
interface GuidelineCardProps {
  guideline: DegreeGuidlineModel;
  onEdit: (guideline: DegreeGuidlineModel) => void;
  onDelete: (id: number) => void;
  getProgramName: (programId: number | null) => string;
}

const GuidelineCard: React.FC<GuidelineCardProps> = ({
  guideline,
  onEdit,
  onDelete,
  getProgramName,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl">
            <GraduationCap size={18} className="text-[#1e3a5f]" />
          </div>
          <h3 className="font-bold text-[#1e3a5f] text-sm line-clamp-2">
            {guideline.title}
          </h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(guideline)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} className="text-slate-500" />
          </button>
          <button
            onClick={() => onDelete(guideline.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      <p className="text-slate-600 text-sm line-clamp-3 mb-3">
        {guideline.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {getProgramName(guideline.programId)}
        </span>
        <span className="text-[10px] text-slate-400">
          {new Date(guideline.createdAt!).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};