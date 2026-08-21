// components/FacultyRecommendation/components/CreateRecommendationModal.tsx

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateRecommendationData } from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { CreateRecommendationModalProps } from './type/type';

export const CreateRecommendationModal: React.FC<CreateRecommendationModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateRecommendationData>({
    subject: '',
    issueDescription: '',
    isUrgent: false,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.issueDescription.trim()) return;
    await onSubmit(formData);
    setFormData({ subject: '', issueDescription: '', isUrgent: false });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">
          New Recommendation
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Subject Name"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-blue-500/50"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <textarea
            required
            placeholder="Issue Description"
            rows={4}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none resize-none focus:ring-2 ring-blue-500/50"
            value={formData.issueDescription}
            onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={formData.isUrgent}
              onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-blue-500"
            />
            Mark as Urgent
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all hover:bg-[#2a5285] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Submit Recommendation'}
          </button>
        </form>
      </div>
    </div>
  );
};