import { BatchAdvisor } from "./FacultyAdvisorModel";
import { RecommendationComment } from "./recommendationCommentModel";
import { User } from "./userModel";

export interface FacultyRecommendation {
    id: number;
    subject: string;
    issueDescription: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    postingAdvisorId: number;
    isUrgent: boolean;
    postedAt: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
    postingAdvisor?: BatchAdvisor;
    comments?: RecommendationComment[];
}
