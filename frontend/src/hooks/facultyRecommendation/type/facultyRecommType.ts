import { FacultyRecommendation } from "@/src/models/facultyRecommendationModel";
import { RecommendationComment } from "@/src/models/recommendationCommentModel";

export interface CreateRecommendationData {
    subject: string;
    issueDescription: string;
    isUrgent?: boolean;
}

export interface UpdateRecommendationData {
    id: number;
    status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    subject?: string;
    issueDescription?: string;
    isUrgent?: boolean;
}

export interface UpdateCommentData {
    commentId?: number;
    suggestedSolution: string;
}

export interface AddCommentData {
    recommendationId: number;
    suggestedSolution: string;
    additionalNotes?: string;
}

export interface VoteCommentData {
    commentId: number;
    voteType: 'upvote' | 'downvote';
}

export interface RecommendationFormData {
    subject: string;
    issueDescription: string;
    isUrgent: boolean;
    categoryId?: number;
}

export interface CommentFormData {
    suggestedSolution: string;
    additionalNotes: string;
}

// API Response Types
export interface RecommendationsResponse {
    data: FacultyRecommendation[];
    success: boolean;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface RecommendationResponse {
    data: FacultyRecommendation;
    success: boolean;
    message?: string;
}

export interface CommentResponse {
    data: RecommendationComment;
    success: boolean;
    message?: string;
}