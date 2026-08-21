// components/FacultyRecommendation/components/CommentItem.tsx

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, MoreVertical, Edit2, Trash2, X, Check } from 'lucide-react';
import { CommentItemProps } from './type/type';

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  canAccept,
  onVote,
  onAccept,
  onDelete,
  onEdit,
  currentUserId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.suggestedSolution);
  const isCommentOwner = comment.commentingAdvisorId === currentUserId;

  const handleEditSubmit = async () => {
    if (editText.trim() && onEdit) {
      await onEdit(comment.id, editText.trim());
      setIsEditing(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(comment.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`p-3 rounded-xl border ${
        comment.isAccepted ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#1e3a5f] uppercase">
              {comment.commentingAdvisor?.advisorName || 'Unknown'}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">
              {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {comment.isAccepted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-100 text-emerald-700">
                <CheckCircle size={10} /> Accepted
              </span>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2 flex gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-blue-500/50 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex gap-1">
                <button
                  onClick={handleEditSubmit}
                  className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.suggestedSolution);
                  }}
                  className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-700 mt-1">
              {comment.suggestedSolution}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            onClick={() => onVote(comment.id, 'upvote')}
          >
            <ThumbsUp size={14} className="text-slate-400" />
          </button>
          <span className="text-xs font-bold text-slate-600 min-w-[16px] text-center">
            {comment.voteCount}
          </span>
          <button
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            onClick={() => onVote(comment.id, 'downvote')}
          >
            <ThumbsDown size={14} className="text-slate-400" />
          </button>
          
          {(isCommentOwner || canAccept) && (
            <div className="relative">
              <button
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={14} className="text-slate-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-6 bg-white border grid-cols-2 border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  {isCommentOwner && (
                    <>
                      <button
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={handleDelete}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </>
                  )}
                  {canAccept && !comment.isAccepted && (
                    <button
                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                      onClick={() => {
                        onAccept(comment.id);
                        setShowMenu(false);
                      }}
                    >
                      <CheckCircle size={12} /> Accept Solution
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};