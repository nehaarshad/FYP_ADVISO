/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FacultyRecommendation/recommendationCard.tsx

import React, { useState } from 'react';
import { User, Calendar, MessageCircle, ChevronRight, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { StatusBadge } from './statusBadge';

interface RecommendationCardProps {
  recommendation: any;
  userId?: number;
  onSelect: (rec: any) => void;
  onDelete?: (id: number) => void;
  onEdit?: (rec: any) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  userId,
  onSelect,
  onDelete,
  onEdit,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = recommendation.postingAdvisorId === userId;
  const commentCount = recommendation.comments?.length || 0;

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={() => onSelect(recommendation)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <StatusBadge 
            status={recommendation.status} 
            isUrgent={recommendation.isUrgent} 
            id={recommendation.id}
          />
          <h3 className="text-base md:text-lg font-black text-[#1e3a5f] mt-2 leading-tight line-clamp-2">
            {recommendation.subject}
          </h3>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1 line-clamp-2">
            {recommendation.issueDescription}
          </p>
        </div>
     
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <User size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase">
              {recommendation.postingAdvisor.advisorName || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-[9px] font-medium uppercase">
              {new Date(recommendation.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <MessageCircle size={14} /> {commentCount}
          </span>
          <ChevronRight size={16} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
};