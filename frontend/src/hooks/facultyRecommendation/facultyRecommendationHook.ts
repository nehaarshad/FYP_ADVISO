// hooks/facultyRecommendation/facultyRecommendationHook.ts

import { useCallback, useEffect, useMemo } from 'react';
import {
    CreateRecommendationData,
    UpdateRecommendationData,
    AddCommentData,
    VoteCommentData,
    UpdateCommentData,
} from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { useFacultyRecommendationStore } from '@/src/storage/facultyRecommendationStore/facultyRecomStore';

interface UseFacultyRecommendationsOptions {
    autoFetch?: boolean;
    initialFilters?: {
        postingAdvisorId?: number;
        commentingAdvisorId?: number;
        status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    };
}

export const useFacultyRecommendations = (
    userId?: number,
    options: UseFacultyRecommendationsOptions = {}
) => {
    const {
        autoFetch = true,
        initialFilters = {},
    } = options;

    const {
        recommendations,
        filteredRecommendations,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isCommenting,
        error,
        selectedRecommendation,
        filters,

        fetchRecommendations,
        createRecommendation,
        updateRecommendation,
        addComment,
        updateComment,
        deleteComment,
        updateStatus,
        voteComment,
        acceptComment,
        deleteRecommendation,
        getRecommendationById,
        setSelectedRecommendation,
        setFilters,
        clearFilters,

        clearError,
        clearCache,
        clearAll,
    } = useFacultyRecommendationStore();

    // Set initial filters
    useEffect(() => {
        if (Object.keys(initialFilters).length > 0) {
            setFilters(initialFilters);
        }
    }, []);

    // Fetch recommendations on mount or when autoFetch is true
    useEffect(() => {
        if (autoFetch) {
            fetchRecommendations();
        }
    }, [autoFetch]);

    // Sort recommendations by newest first
    const sortedRecommendations = useMemo(() => {
        return [...filteredRecommendations].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [filteredRecommendations]);

    // Get open recommendations count
    const openCount = useMemo(() => {
        return filteredRecommendations.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
    }, [filteredRecommendations]);

    // Get recommendations by posting advisor
    const getRecommendationsByPostingAdvisor = useCallback(
        (postingAdvisorId: number) => {
            return filteredRecommendations.filter(r => r.postingAdvisorId === postingAdvisorId);
        },
        [filteredRecommendations]
    );

    // Get recommendations by commenting advisor
    const getRecommendationsByCommentingAdvisor = useCallback(
        (commentingAdvisorId: number) => {
            return filteredRecommendations.filter(r => 
                r.comments?.some(c => c.commentingAdvisorId === commentingAdvisorId)
            );
        },
        [filteredRecommendations]
    );

    // ==================== RECOMMENDATION CRUD ====================
    
    // Create a new recommendation post
    const createNewRecommendation = useCallback(
        async (data: CreateRecommendationData) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!data.subject?.trim() || !data.issueDescription?.trim()) {
                return {
                    success: false,
                    error: 'Subject and issue description are required',
                };
            }

            return await createRecommendation(userId, data);
        },
        [userId, createRecommendation]
    );

    // Update a recommendation
    const updateRecommendationById = useCallback(
        async (id: number, data: UpdateRecommendationData) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!id) {
                return {
                    success: false,
                    error: 'Recommendation ID is required',
                };
            }

            return await updateRecommendation( id, data);
        },
        [userId, updateRecommendation]
    );

    // Delete a recommendation
    const deleteRecommendationById = useCallback(
        async (id: number) => {
            if (!id) {
                return {
                    success: false,
                    error: 'Recommendation ID is required',
                };
            }
            return await deleteRecommendation(id);
        },
        [deleteRecommendation]
    );

    // Update recommendation status
    const updateRecommendationStatus = useCallback(
        async (id: number, status: 'Open' | 'In Progress' | 'Resolved' | 'Closed') => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            return await updateStatus(userId, { id, status });
        },
        [userId, updateStatus]
    );

    // ==================== COMMENT CRUD ====================

    // Add a comment to a recommendation
    const addCommentToRecommendation = useCallback(
        async (data: AddCommentData) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!data.suggestedSolution?.trim()) {
                return {
                    success: false,
                    error: 'Suggested solution is required',
                };
            }

            return await addComment(userId, data);
        },
        [userId, addComment]
    );

    // Update a comment
    const updateCommentById = useCallback(
        async (commentId: number, data: UpdateCommentData) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!commentId) {
                return {
                    success: false,
                    error: 'Comment ID is required',
                };
            }

            if (!data.suggestedSolution?.trim()) {
                return {
                    success: false,
                    error: 'Suggested solution is required',
                };
            }

            return await updateComment(userId, commentId, data);
        },
        [userId, updateComment]
    );

    // Delete a comment
    const deleteCommentById = useCallback(
        async (commentId: number) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!commentId) {
                return {
                    success: false,
                    error: 'Comment ID is required',
                };
            }

            return await deleteComment(userId, commentId);
        },
        [userId, deleteComment]
    );

    // Vote on a comment
    const voteOnComment = useCallback(
        async (commentId: number, voteType: 'upvote' | 'downvote') => {
            if (!commentId) {
                return {
                    success: false,
                    error: 'Comment ID is required',
                };
            }
            return await voteComment({ commentId, voteType });
        },
        [voteComment]
    );

    // Accept a comment as solution
    const acceptCommentAsSolution = useCallback(
        async (commentId: number) => {
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            if (!commentId) {
                return {
                    success: false,
                    error: 'Comment ID is required',
                };
            }

            return await acceptComment(userId, commentId);
        },
        [userId, acceptComment]
    );

    // ==================== FILTERS ====================

    // Apply filters
    const applyFilters = useCallback(
        (filters: {
            postingAdvisorId?: number;
            commentingAdvisorId?: number;
            status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
        }) => {
            setFilters(filters);
        },
        [setFilters]
    );

    // Reset filters
    const resetFilters = useCallback(() => {
        clearFilters();
    }, [clearFilters]);

    // ==================== UTILITY ====================

    // Refresh recommendations
    const refreshRecommendations = useCallback(
        async (forceRefresh: boolean = true) => {
            return await fetchRecommendations(forceRefresh);
        },
        [fetchRecommendations]
    );

    // Get a recommendation by ID
    const getRecommendation = useCallback(
        (id: number) => {
            return getRecommendationById(id);
        },
        [getRecommendationById]
    );

    return {
        // State
        recommendations: sortedRecommendations,
        allRecommendations: recommendations,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isCommenting,
        error,
        selectedRecommendation,
        openCount,
        totalCount: filteredRecommendations.length,
        activeFilters: filters,

        // Recommendation Actions
        createNewRecommendation,
        updateRecommendationById,
        deleteRecommendationById,
        updateRecommendationStatus,

        // Comment Actions
        addCommentToRecommendation,
        updateCommentById,
        deleteCommentById,
        voteOnComment,
        acceptCommentAsSolution,

        // Filter Actions
        applyFilters,
        resetFilters,

        // Utility Actions
        refreshRecommendations,
        getRecommendation,
        setSelectedRecommendation,
        getRecommendationsByPostingAdvisor,
        getRecommendationsByCommentingAdvisor,
        clearError,
        clearCache,
        clearAll,
    };
};