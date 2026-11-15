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
        comment.isAccepted ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#1e3a5f] ">
              {comment.commentingAdvisor?.advisorName || 'Unknown'}
            </span>
            <span className="text-[12px] ml-3 font-bold text-slate-600 ">
              {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {comment.isAccepted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-bold  bg-emerald-100 text-emerald-700">
                <CheckCircle size={12} /> Accepted
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
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {comment.suggestedSolution}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            onClick={() => onVote(comment.id, 'upvote')}
          >
            <ThumbsUp size={16} className="text-slate-500" />
          </button>
          <span className="text-sm font-bold text-slate-600 min-w-[16px] text-center">
            {comment.voteCount}
          </span>
          <button
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            onClick={() => onVote(comment.id, 'downvote')}
          >
            <ThumbsDown size={16} className="text-slate-500" />
          </button>
          
          {(isCommentOwner || canAccept) && (
  <div className="relative">
    <button
      className="p-1 hover:bg-slate-300 rounded-full transition-colors"
      onClick={() => setShowMenu(!showMenu)}
    >
      <MoreVertical size={16} className="text-slate-800" />
    </button>
    
    {showMenu && (
      <div className="absolute right-6 top-0 bg-white border border-slate-300 rounded-lg shadow-lg p-1 z-10 grid grid-cols-3 gap-1 min-w-[280px]">
        
        {/* Accept Solution Button */}
        {canAccept && !comment.isAccepted && (
          <button
            className="flex flex-col items-center justify-center px-2 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors gap-1"
            onClick={() => {
              onAccept(comment.id);
              setShowMenu(false);
            }}
          >
            <CheckCircle size={18} /> 
            <span>Accept</span>
          </button>
        )}
        
        {/* Edit & Delete Buttons (Only show if owner) */}
        {isCommentOwner && (
          <>
            <button
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-md transition-colors gap-1"
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
            >
              <Edit2 size={18} /> 
              <span>Edit</span>
            </button>
            
            <button
              className="flex flex-col items-center justify-center px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors gap-1"
              onClick={handleDelete}
            >
              <Trash2 size={18} /> 
              <span>Delete</span>
            </button>
          </>
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