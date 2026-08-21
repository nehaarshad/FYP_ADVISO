import { create } from 'zustand';
import { 
    CreateRecommendationData,
    UpdateRecommendationData,
    AddCommentData,
    VoteCommentData,
    UpdateCommentData,
} from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { ApiResponse } from '@/src/services/baseApiServices/ApiResponseType/apiResponseType';
import { facultyRecommendationRepository } from '@/src/repositories/facultyRecommendationRepository/facultyRecommRepo';
import { FacultyRecommendation } from '@/src/models/facultyRecommendationModel';
import { RecommendationComment } from '@/src/models/recommendationCommentModel';

interface RecommendationFilters {
    postingAdvisorId?: number;
    commentingAdvisorId?: number;
    status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
}

interface FacultyRecommendationState {
    // State
    recommendations: FacultyRecommendation[];
    filteredRecommendations: FacultyRecommendation[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isCommenting: boolean;
    error: string | null;
    selectedRecommendation: FacultyRecommendation | null;
    filters: RecommendationFilters;

    // Actions
    fetchRecommendations: (
        forceRefresh?: boolean
    ) => Promise<ApiResponse<FacultyRecommendation[]>>;
    
    createRecommendation: (
        userId: number,
        data: CreateRecommendationData
    ) => Promise<ApiResponse<FacultyRecommendation>>;
    
    updateRecommendation: (
        recommendationId: number,
        data: UpdateRecommendationData
    ) => Promise<ApiResponse<FacultyRecommendation>>;
    
    addComment: (
        userId: number,
        data: AddCommentData
    ) => Promise<ApiResponse<RecommendationComment>>;
    
    updateComment: (
        userId: number,
        commentId: number,
        data: UpdateCommentData
    ) => Promise<ApiResponse<RecommendationComment>>;
    
    deleteComment: (
        userId: number,
        commentId: number
    ) => Promise<ApiResponse<null>>;
    
    updateStatus: (
        userId: number,
        data: UpdateRecommendationData
    ) => Promise<ApiResponse<FacultyRecommendation>>;
    
    voteComment: (
        data: VoteCommentData
    ) => Promise<ApiResponse<RecommendationComment>>;
    
    acceptComment: (
        userId: number,
        commentId: number
    ) => Promise<ApiResponse<RecommendationComment>>;
    
    deleteRecommendation: (
        id: number
    ) => Promise<ApiResponse<null>>;
    
    getRecommendationById: (
        id: number
    ) => FacultyRecommendation | undefined;
    
    setSelectedRecommendation: (
        recommendation: FacultyRecommendation | null
    ) => void;
    
    setFilters: (
        filters: RecommendationFilters
    ) => void;
    
    clearFilters: () => void;
    
    clearError: () => void;
    clearCache: () => void;
    clearAll: () => void;
}

// Helper function to apply filters
const applyFiltersToRecommendations = (
    recommendations: FacultyRecommendation[], 
    filters: RecommendationFilters
): FacultyRecommendation[] => {
    if (!filters || Object.keys(filters).length === 0) {
        return recommendations;
    }

    return recommendations.filter(rec => {
        // Filter by posting advisor ID
        if (filters.postingAdvisorId && rec.postingAdvisorId !== filters.postingAdvisorId) {
            return false;
        }

        // Filter by status
        if (filters.status && rec.status !== filters.status) {
            return false;
        }

        return true;
    });
};

export const useFacultyRecommendationStore = create<FacultyRecommendationState>((set, get) => ({
    // Initial state
    recommendations: [],
    filteredRecommendations: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isCommenting: false,
    error: null,
    selectedRecommendation: null,
    filters: {},

    // ==================== FETCH ====================
    fetchRecommendations: async (forceRefresh = false) => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.getRecommendations(
                forceRefresh
            );

            if (response.success && response.data) {
                const recommendations = response.data;
                const currentFilters = get().filters;
                const filtered = applyFiltersToRecommendations(recommendations, currentFilters);
                
                set({ 
                    recommendations,
                    filteredRecommendations: filtered,
                    isLoading: false 
                });
            } else {
                set({ 
                    error: response.error || 'Failed to fetch recommendations',
                    isLoading: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                error: errorMessage,
                data: [],
            };
        }
    },

    // ==================== CREATE ====================
    createRecommendation: async (userId, data) => {
        set({ isCreating: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.createRecommendation(
                userId,
                data
            );

            if (response.success && response.data) {
                const currentState = get();
                const newRecommendations = [response.data!, ...currentState.recommendations];
                const filtered = applyFiltersToRecommendations(newRecommendations, currentState.filters);
                
                set({
                    recommendations: newRecommendations,
                    filteredRecommendations: filtered,
                    isCreating: false,
                });
            } else {
                set({ 
                    error: response.error || 'Failed to create recommendation',
                    isCreating: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isCreating: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== UPDATE RECOMMENDATION ====================
    updateRecommendation: async ( recommendationId, data) => {
        set({ isUpdating: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.updateRecommendation(
                recommendationId,
                data
            );

            console.log("updating recommendation",recommendationId,data," response:",response)

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => {
                    if (rec.id === recommendationId) {
                        return response.data!;
                    }
                    return rec;
                });
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isUpdating: false,
                });

                if (currentState.selectedRecommendation?.id === recommendationId) {
                    set({ selectedRecommendation: response.data });
                }
            } else {
                set({ 
                    error: response.error || 'Failed to update recommendation',
                    isUpdating: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isUpdating: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== UPDATE STATUS ====================
    updateStatus: async (userId, data) => {
        set({ isUpdating: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.updateRecommendationStatus(
                userId,
                data
            );

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => {
                    if (rec.id === data.id) {
                        return response.data!;
                    }
                    return rec;
                });
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isUpdating: false,
                });

                if (currentState.selectedRecommendation?.id === data.id) {
                    set({ selectedRecommendation: response.data });
                }
            } else {
                set({ 
                    error: response.error || 'Failed to update status',
                    isUpdating: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isUpdating: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== DELETE RECOMMENDATION ====================
    deleteRecommendation: async (id) => {
        set({ isDeleting: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.deleteRecommendation(id);

            if (response.success) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.filter((rec) => rec.id !== id);
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isDeleting: false,
                });

                if (currentState.selectedRecommendation?.id === id) {
                    set({ selectedRecommendation: null });
                }
            } else {
                set({ 
                    error: response.error || 'Failed to delete recommendation',
                    isDeleting: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isDeleting: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== ADD COMMENT ====================
    addComment: async (userId, data) => {
        set({ isCommenting: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.addComment(
                userId,
                data
            );

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => {
                    if (rec.id === data.recommendationId) {
                        return {
                            ...rec,
                            comments: [response.data!, ...(rec.comments || [])],
                        };
                    }
                    return rec;
                });
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isCommenting: false,
                });
            } else {
                set({ 
                    error: response.error || 'Failed to add comment',
                    isCommenting: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isCommenting: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== UPDATE COMMENT ====================
    updateComment: async (userId, commentId, data) => {
        set({ isUpdating: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.updateComment(
                { ...data, commentId }
            );

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => ({
                    ...rec,
                    comments: rec.comments?.map((comment) => {
                        if (comment.id === commentId) {
                            return response.data!;
                        }
                        return comment;
                    }),
                }));
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isUpdating: false,
                });
            } else {
                set({ 
                    error: response.error || 'Failed to update comment',
                    isUpdating: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isUpdating: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== DELETE COMMENT ====================
    deleteComment: async (userId, commentId) => {
        set({ isDeleting: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.deleteComment(
                userId,
                commentId
            );

            if (response.success) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => ({
                    ...rec,
                    comments: rec.comments?.filter((comment) => comment.id !== commentId),
                }));
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isDeleting: false,
                });
            } else {
                set({ 
                    error: response.error || 'Failed to delete comment',
                    isDeleting: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isDeleting: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== VOTE COMMENT ====================
    voteComment: async (data) => {
        set({ error: null });
        
        try {
            const response = await facultyRecommendationRepository.voteComment(data);

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => ({
                    ...rec,
                    comments: rec.comments?.map((comment) => {
                        if (comment.id === data.commentId) {
                            return response.data!;
                        }
                        return comment;
                    }),
                }));
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                });
            } else {
                set({ error: response.error || 'Failed to vote on comment' });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== ACCEPT COMMENT AS SOLUTION ====================
    acceptComment: async (userId, commentId) => {
        set({ isUpdating: true, error: null });
        
        try {
            const response = await facultyRecommendationRepository.acceptCommentAsSolution(
                userId,
                commentId
            );

            if (response.success && response.data) {
                const currentState = get();
                const updatedRecommendations = currentState.recommendations.map((rec) => {
                    if (rec.id === response.data!.recommendationId) {
                        return {
                            ...rec,
                            status: 'Resolved' as const,
                            comments: rec.comments?.map((comment) => ({
                                ...comment,
                                isAccepted: comment.id === response.data!.id,
                            })),
                        };
                    }
                    return rec;
                });
                const filtered = applyFiltersToRecommendations(updatedRecommendations, currentState.filters);
                
                set({
                    recommendations: updatedRecommendations,
                    filteredRecommendations: filtered,
                    isUpdating: false,
                });
            } else {
                set({ 
                    error: response.error || 'Failed to accept solution',
                    isUpdating: false 
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            set({ error: errorMessage, isUpdating: false });
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    // ==================== FILTERS ====================
    setFilters: (filters) => {
        set((state) => {
            const newFilters = { ...state.filters, ...filters };
            const filtered = applyFiltersToRecommendations(state.recommendations, newFilters);
            return {
                filters: newFilters,
                filteredRecommendations: filtered,
            };
        });
    },

    clearFilters: () => {
        set((state) => ({
            filters: {},
            filteredRecommendations: state.recommendations,
        }));
    },

    // ==================== UTILITY ====================
    getRecommendationById: (id) => {
        const { recommendations } = get();
        return recommendations.find((rec) => rec.id === id);
    },

    setSelectedRecommendation: (recommendation) => {
        set({ selectedRecommendation: recommendation });
    },

    clearError: () => {
        set({ error: null });
    },

    clearCache: () => {
        facultyRecommendationRepository.clearCache();
    },

    clearAll: () => {
        set({
            recommendations: [],
            filteredRecommendations: [],
            isLoading: false,
            isCreating: false,
            isUpdating: false,
            isDeleting: false,
            isCommenting: false,
            error: null,
            selectedRecommendation: null,
            filters: {},
        });
        facultyRecommendationRepository.clearCache();
    },
}));