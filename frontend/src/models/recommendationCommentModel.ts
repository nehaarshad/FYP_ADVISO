import { BatchAdvisor } from "./FacultyAdvisorModel";
import { FacultyRecommendation } from "./facultyRecommendationModel";
import { User } from "./userModel";

export interface RecommendationComment {
    id: number;
    commentingAdvisorId: number;
    recommendationId: number;
    suggestedSolution: string;
    voteCount: number;
    isAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    commentingAdvisor?: BatchAdvisor;
    recommendation?: FacultyRecommendation;
}