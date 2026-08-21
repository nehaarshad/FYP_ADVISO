// components/FacultyRecommendation/components/CommentSection.tsx

import React, { useRef, useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { CommentSectionProps } from './type/type';
import { CommentItem } from './commentItem';

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  recommendationId,
  isOwner,
  isCommenting,
  status,
  onComment,
  onVote,
  onAcceptSolution,
  onDeleteComment,
  onEditComment,
  currentUserId,
}) => {
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const isClosed = status === 'Closed' || status === 'Resolved';
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    await onComment(recommendationId, commentText.trim());
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
          <MessageCircle size={16} /> Comments ({comments.length})
        </span>
      </div>

      {/* Comment Input */}
      {!isClosed && (
        <div className="flex gap-2 mb-4">
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Suggest a solution..."
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/50 resize-none min-h-[50px] max-h-[100px]"
            rows={2}
            disabled={isCommenting}
          />
          <button
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-xl font-black text-xs uppercase tracking-wider disabled:opacity-50 hover:bg-[#2a5285] transition-colors active:scale-95"
            onClick={handleSubmit}
            disabled={!commentText.trim() || isCommenting}
          >
            {isCommenting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {sortedComments.map((comment) => {
          const canAccept =
            isOwner &&
            !comment.isAccepted &&
            status !== 'Closed' &&
            status !== 'Resolved';

          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              canAccept={canAccept}
              currentUserId={currentUserId}
              onVote={onVote}
              onAccept={onAcceptSolution}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
            />
          );
        })}
        {comments.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm font-medium">No comments yet</p>
            <p className="text-xs">Be the first to suggest a solution</p>
          </div>
        )}
      </div>
    </div>
  );
};