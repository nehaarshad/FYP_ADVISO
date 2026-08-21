/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateRecommendationData } from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { FacultyRecommendation as RecommendationType } from '@/src/models/facultyRecommendationModel';
import { RecommendationComment } from '@/src/models/recommendationCommentModel';

export interface FacultyRecommendationProps {
  onBack?: () => void;
  initialFilters?: {
    postingAdvisorId?: number;
    commentingAdvisorId?: number;
    status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  };
}

export interface RecommendationCardProps {
  recommendation: RecommendationType;
  userId?: number;
  onSelect: (rec: RecommendationType) => void;
  onDelete?: (id: number) => void;
}

export interface CreateRecommendationModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecommendationData) => Promise<void>;
}

export interface FilterBarProps {
  showFilterMenu: boolean;
  selectedStatus?: string;
  selectedPostingAdvisor?: number;
  onStatusChange: (status: string) => void;
  onAdvisorChange: (advisorId: number) => void;
  onApply: () => void;
  onClear: () => void;
  onToggle: () => void;
}

export interface RecommendationDetailProps {
  recommendation: any;
  userId?: number;
  isCommenting: boolean;
  onBack: () => void;
  onComment: (recommendationId: number, text: string) => Promise<void>;
  onVote: (commentId: number, voteType: 'upvote' | 'downvote') => Promise<void>;
  onAcceptSolution: (commentId: number) => Promise<void>;
  onStatusChange: (id: number, status: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEditRecommendation?: (rec: any) => void;
  onDeleteComment?: (commentId: number) => Promise<void>;
  onEditComment?: (commentId: number, newText: string) => Promise<void>;
}

export interface CommentSectionProps {
  comments: any[];
  recommendationId: number;
  isOwner: boolean;
  isCommenting: boolean;
  status: string;
  onComment: (recommendationId: number, text: string) => Promise<void>;
  onVote: (commentId: number, voteType: 'upvote' | 'downvote') => Promise<void>;
  onAcceptSolution: (commentId: number) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
  onEditComment?: (commentId: number, newText: string) => Promise<void>;
  currentUserId?: number;
}

export interface CommentItemProps {
  comment: any;
  canAccept: boolean;
  onVote: (commentId: number, voteType: 'upvote' | 'downvote') => Promise<void>;
  onAccept: (commentId: number) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onEdit?: (commentId: number, newText: string) => Promise<void>;
  currentUserId?: number;
}

export interface StatusBadgeProps {
  status: string;
  isUrgent?: boolean;
  id?: number;
}

export interface StatusUpdateProps {
  currentStatus: string;
  isOwner: boolean;
  onStatusChange: (status: string) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterToggle: () => void;
  onAddNew: () => void;
  openCount: number;
  totalCount: number;
}
