/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import {CreateRecommendationData,UpdateRecommendationData,AddCommentData, VoteCommentData, UpdateCommentData} from '@/src/hooks/facultyRecommendation/type/facultyRecommType';
import { FacultyRecommendation } from '@/src/models/facultyRecommendationModel';
import { RecommendationComment } from '@/src/models/recommendationCommentModel';

class FacultyRecommendationRepository extends BaseApiService {
    private static instance: FacultyRecommendationRepository;
    private recommendationsCache: FacultyRecommendation[] = [];
    private lastFetchTime: number = 0;
    private cacheDuration: number = 2 * 60 * 1000; // 2 minutes

    private constructor() {
        super();
    }

    static getInstance(): FacultyRecommendationRepository {
        if (!FacultyRecommendationRepository.instance) {
            FacultyRecommendationRepository.instance = 
                new FacultyRecommendationRepository();
        }
        return FacultyRecommendationRepository.instance;
    }

    // ==================== RECOMMENDATION APIs ====================


    async getRecommendations(
        forceRefresh: boolean = false
    ): Promise<ApiResponse<FacultyRecommendation[]>> {
        const now = Date.now();

        // Check cache
        if (
            !forceRefresh &&
            this.recommendationsCache.length > 0 &&
            now - this.lastFetchTime < this.cacheDuration
        ) {
            console.log('Returning cached recommendations:', 
                this.recommendationsCache.length);
            return {
                success: true,
                data: this.recommendationsCache,
                message: 'Recommendations retrieved from cache',
            };
        }

        try {
            console.log('Fetching recommendations:');

            const url = `${AppApis.getAllRecommendations}`;

            const response = await this.getApiResponse<{
                data: FacultyRecommendation[];
                success: boolean;
                message?: string;
            }>(url);

            console.log('Get recommendations response:', response);

            if (response.success && response.data?.data) {
                this.recommendationsCache = response.data.data;
                this.lastFetchTime = now;

                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Recommendations retrieved',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to fetch recommendations',
                data: [],
            };
        } catch (error) {
            console.error('Get recommendations error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
                data: [],
            };
        }
    }

  
    async createRecommendation(
        userId: number,
        data: CreateRecommendationData
    ): Promise<ApiResponse<FacultyRecommendation>> {
        try {
            console.log('Creating recommendation:', data);

            const url = AppApis.createRecommendationRequest.replace(':userId', userId.toString());
            const response = await this.postApiWithJson<{
                success: boolean;
                message: string;
                data?: FacultyRecommendation;
            }>(url, {
                data,
            });

            console.log('Create recommendation response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Recommendation created successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to create recommendation',
            };
        } catch (error) {
            console.error('Create recommendation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create recommendation',
            };
        }
    }


    async updateRecommendation(
        recommendationId: number,
        data: UpdateRecommendationData
    ): Promise<ApiResponse<FacultyRecommendation>> {
        try {
            console.log('Updating recommendation:', { recommendationId, data });

            const url = AppApis.updateRecommendationRequest.replace(':id', recommendationId.toString());

            const response = await this.updateApiWithJson<{
                success: boolean;
                message: string;
                data?: FacultyRecommendation;
            }>(url, {
                data,
            });

            console.log('Update recommendation response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Recommendation updated successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to update recommendation',
            };
        } catch (error) {
            console.error('Update recommendation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update recommendation',
            };
        }
    }

    async updateRecommendationStatus(
        userId: number,
        data: UpdateRecommendationData
    ): Promise<ApiResponse<FacultyRecommendation>> {
        try {
            console.log('Updating recommendation status:', data);

            const url = AppApis.updateRecommendationStatus.replace(':userId', userId.toString());

            const response = await this.updateApiWithJson<{
                success: boolean;
                message: string;
                data?: FacultyRecommendation;
            }>(url, {
                status: data.status,
                id: data.id,
            });

            console.log('Update status response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Status updated successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to update status',
            };
        } catch (error) {
            console.error('Update status error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update status',
            };
        }
    }


    async deleteRecommendation(
        recommendationId: number
    ): Promise<ApiResponse<null>> {
        try {
            console.log('Deleting recommendation:', recommendationId);

            const url = AppApis.deleteRecommendation.replace(':id', recommendationId.toString());

            const response = await this.deleteApiResponse<{
                success: boolean;
                message: string;
            }>(url);

            console.log('Delete recommendation response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: null,
                    message: response.data?.message || 'Recommendation deleted successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to delete recommendation',
            };
        } catch (error) {
            console.error('Delete recommendation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete recommendation',
            };
        }
    }

    // ==================== COMMENT APIs ====================


    async addComment(
        userId: number,
        data: AddCommentData
    ): Promise<ApiResponse<RecommendationComment>> {
        try {
            console.log('Adding comment:', data);

            const url = AppApis.addCommentToRecommendation.replace(':userId', userId.toString());

            const response = await this.postApiWithJson<{
                success: boolean;
                message: string;
                data?: RecommendationComment;
            }>(url, {
                data,
            });

            console.log('Add comment response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Comment added successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to add comment',
            };
        } catch (error) {
            console.error('Add comment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add comment',
            };
        }
    }

  
    async updateComment(
        data: UpdateCommentData
    ): Promise<ApiResponse<RecommendationComment>> {
        try {
            console.log('Updating comment:', {  data });

            const url = AppApis.updateCommentToRecommendation

            const response = await this.updateApiWithJson<{
                success: boolean;
                message: string;
                data?: RecommendationComment;
            }>(url, {
                ...data,
            });

            console.log('Update comment response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Comment updated successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to update comment',
            };
        } catch (error) {
            console.error('Update comment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update comment',
            };
        }
    }

    async deleteComment(
        userId: number,
        commentId: number
    ): Promise<ApiResponse<null>> {
        try {
            console.log('Deleting comment:', { userId, commentId });

            const url = AppApis.deleteRecommendationComment.replace(':id', commentId.toString());

            const response = await this.deleteApiResponse<{
                success: boolean;
                message: string;
            }>(url);

            console.log('Delete comment response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: null,
                    message: response.data?.message || 'Comment deleted successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to delete comment',
            };
        } catch (error) {
            console.error('Delete comment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete comment',
            };
        }
    }


    async voteComment(
        data: VoteCommentData
    ): Promise<ApiResponse<RecommendationComment>> {
        try {
            console.log('Voting on comment:', data);

            const url = AppApis.voteComment.replace(':commentId', data.commentId.toString());

            const response = await this.updateApiWithJson<{
                success: boolean;
                message: string;
                data?: RecommendationComment;
            }>(url, {
                voteType: data.voteType,
            });

            console.log('Vote comment response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || `Comment ${data.voteType}d successfully`,
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to vote on comment',
            };
        } catch (error) {
            console.error('Vote comment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to vote on comment',
            };
        }
    }

    async acceptCommentAsSolution(
        userId: number,
        commentId: number
    ): Promise<ApiResponse<RecommendationComment>> {
        try {
            console.log('Accepting comment as solution:', { userId, commentId });

            const url = AppApis.acceptCommentAsSolution
                .replace(':userId', userId.toString());

            const response = await this.updateApiWithJson<{
                success: boolean;
                message: string;
                data?: RecommendationComment;
            }>(url, {
                commentId,
            });

            console.log('Accept comment response:', response);

            if (response.success) {
                this.clearCache();
                return {
                    success: true,
                    data: response.data?.data,
                    message: response.data?.message || 'Solution accepted successfully',
                };
            }

            return {
                success: false,
                error: response.error || 'Failed to accept solution',
            };
        } catch (error) {
            console.error('Accept comment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to accept solution',
            };
        }
    }

    clearCache(): void {
        this.recommendationsCache = [];
        this.lastFetchTime = 0;
        console.log('Recommendations cache cleared');
    }

    getCachedRecommendations(): FacultyRecommendation[] {
        return this.recommendationsCache;
    }
}

export const facultyRecommendationRepository = 
    FacultyRecommendationRepository.getInstance();