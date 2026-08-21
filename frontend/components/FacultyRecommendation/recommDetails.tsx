// components/FacultyRecommendation/components/recommDetails.tsx

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Trash2, Edit2, X, Check } from 'lucide-react';
import { RecommendationDetailProps } from './type/type';
import { StatusBadge } from './statusBadge';
import { StatusUpdate } from './statusUpdate';
import { CommentSection } from './commentSection';
import { RecommendationComment } from '@/src/models/recommendationCommentModel';

export const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  recommendation,
  userId,
  isCommenting,
  onBack,
  onComment,
  onVote,
  onAcceptSolution,
  onStatusChange,
  onDelete,
  onEditRecommendation,
  onDeleteComment,
  onEditComment,
}) => {
  const isOwner = recommendation.postingAdvisorId === userId;
  const acceptedSolution = recommendation.comments?.find((c:RecommendationComment) => c.isAccepted);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(recommendation.subject);
  const [editDescription, setEditDescription] = useState(recommendation.issueDescription);

  const handleEditSubmit = async () => {
    if (onEditRecommendation) {
      await onEditRecommendation({
        ...recommendation,
        subject: editSubject,
        issueDescription: editDescription,
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <StatusBadge 
              status={recommendation.status} 
              isUrgent={recommendation.isUrgent} 
              id={recommendation.id}
            />
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xl font-black text-[#1e3a5f] outline-none focus:ring-2 ring-blue-500/50"
                  placeholder="Subject"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-blue-500/50 resize-none"
                  rows={3}
                  placeholder="Issue Description"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-600 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditSubject(recommendation.subject);
                      setEditDescription(recommendation.issueDescription);
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-300 transition-colors flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] mt-2 leading-tight">
                  {recommendation.subject}
                </h2>
                <p className="text-sm md:text-base font-medium text-slate-600 mt-1">
                  {recommendation.issueDescription}
                </p>
              </>
            )}
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <button
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-blue-500"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-red-500"
                onClick={() => onDelete(recommendation.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Status Update */}
        <StatusUpdate
          currentStatus={recommendation.status}
          isOwner={isOwner}
          onStatusChange={(status) => onStatusChange(recommendation.id, status)}
        />

        {/* Content */}
        {!isEditing && (
          <div className="mt-6 space-y-4">
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-widest">
                <AlertCircle size={14} /> Issue Description
              </span>
              <p className="text-sm md:text-base font-medium leading-relaxed text-slate-700 mt-1">
                {recommendation.issueDescription}
              </p>
            </div>

            {acceptedSolution && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  <CheckCircle size={14} /> Accepted Solution
                </span>
                <p className="text-sm font-medium leading-relaxed text-emerald-800 mt-1">
                  {acceptedSolution.suggestedSolution}
                </p>
                <div className="text-[9px] font-bold text-emerald-600 mt-2 uppercase">
                  By {acceptedSolution.commentingAdvisor?.advisorName || 'Unknown'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        <CommentSection
          comments={recommendation.comments || []}
          recommendationId={recommendation.id}
          isOwner={isOwner}
          isCommenting={isCommenting}
          status={recommendation.status}
          currentUserId={userId}
          onComment={onComment}
          onVote={onVote}
          onAcceptSolution={onAcceptSolution}
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
        />
      </div>
    </div>
  );
};