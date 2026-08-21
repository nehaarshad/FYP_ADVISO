import FacultyRecommendation from '../models/facultyRecommendationModel.js';
import RecommendationComment from '../models/recommendationComment.js';
import User from '../models/userModel.js';
import BatchAdvisor from '../models/FacultyAdvisorModel.js'
import { where } from 'sequelize';

const createRecommendationRequest=async(req, res) =>{
        try {
            const { subject, issueDescription, isUrgent } = req.body.data;
            const {userId }= req.params; 
            console.log(req.params,req.body.data)
            const advisor=await BatchAdvisor.findOne({where:{userId}})
            if(!advisor){
                console.log(`Advisor id not found`)
                return res.json({success:false,message:"Unauthorized Access"})
            }
            const postingAdvisorId=advisor.id
       
            const recommendation = await FacultyRecommendation.create({
                subject,
                issueDescription,
                postingAdvisorId,
                isUrgent: isUrgent || false,
                status: 'Open'
            });

            // Fetch the created recommendation with associations
            const createdRecommendation = await FacultyRecommendation.findByPk(recommendation.id, {
                include: [
                    {
                        model: BatchAdvisor,
                        as: 'postingAdvisor',
                    },
                ]
            });

            return res.status(201).json({
                success: true,
                message: 'Recommendation request posted successfully',
                data: createdRecommendation
            });

        } catch (error) {
            console.error('Error creating recommendation request:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create recommendation request',
                error: error.message
            });
        }
    }

const updateRecommendationRequest = async (req, res) => {
    try {
       
        const requestData = req.body.data || req.body;
        const { subject, issueDescription, isUrgent, status } = requestData;
        const { id } = req.params;
        
        console.log('Update params:', req.params);
        console.log('Update body:', req.body);
        console.log('Extracted data:', { subject, issueDescription, isUrgent, status, id });

        // Find the recommendation
        const recommendation = await FacultyRecommendation.findByPk(id);
        
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }

        const updateData = {};
        if (subject !== undefined) updateData.subject = subject;
        if (issueDescription !== undefined) updateData.issueDescription = issueDescription;
        if (isUrgent !== undefined) updateData.isUrgent = isUrgent;
        if (status !== undefined) updateData.status = status;

        if (status === 'Resolved' || status === 'Closed') {
            updateData.resolvedAt = new Date();
        }

        // Update the recommendation
        await recommendation.update(updateData);
         const recommendations = await FacultyRecommendation.findByPk(id,{
                include: [
                    {
                        model: BatchAdvisor,
                        as: 'postingAdvisor',
                    },
                    {
                        model: RecommendationComment,
                        as: 'comments',
                        include: [
                            {
                                model: BatchAdvisor,
                                as: 'commentingAdvisor',
                            }
                        ],
                        order: [['createdAt', 'DESC']]
                    }
                ],
                order: [['createdAt', 'DESC']],
            });

        return res.status(200).json({
            success: true,
            message: 'Recommendation updated successfully',
            data:recommendations
        });

    } catch (error) {
        console.error('Error updating recommendation:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update recommendation',
            error: error.message
        });
    }
};

const addCommentToRecommendation = async(req, res) =>{
        try {
            const { suggestedSolution,recommendationId } = req.body.data;
            const {userId }= req.params; 

            console.log(req.params,req.body.data)
            const advisor=await BatchAdvisor.findOne({where:{userId}})
            if(!advisor){
                console.log(`Advisor id not found`)
                return res.json({success:false,message:"Unauthorized Access"})
            }
            // Check if the recommendation exists
            const recommendation = await FacultyRecommendation.findByPk(recommendationId);
            if (!recommendation) {
                return res.status(404).json({
                    success: false,
                    message: 'Recommendation request not found'
                });
            }

            // Check if the recommendation is closed
            if (recommendation.status === 'Closed') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot add comments to a closed recommendation'
                });
            }

            // Create the comment
            const comment = await RecommendationComment.create({
                commentingAdvisorId:advisor.id,
                recommendationId,
                suggestedSolution,
                voteCount: 0,
                isAccepted: false
            });

            // Update recommendation status to 'In Progress' if it was 'Open'
            if (recommendation.status === 'Open') {
                await recommendation.update({ status: 'In Progress' });
            }

            // Fetch the created comment with associations
            const createdComment = await RecommendationComment.findByPk(comment.id, {
                include: [
                    {
                        model: BatchAdvisor,
                        as: 'commentingAdvisor',
                    },
                    {
                        model: FacultyRecommendation,
                        as: 'recommendation',
                    }
                ]
            });

            return res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: createdComment
            });

        } catch (error) {
            console.error('Error adding comment:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to add comment',
                error: error.message
            });
        }
    }

const updateCommentToRecommendation = async (req, res) => {
    try {
        const requestData = req.body.data || req.body;
        const { suggestedSolution, commentId } = requestData;
        console.log('Update comment body:', req.body);

        // Find the comment
        const comment = await RecommendationComment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Update the comment
        await comment.update({
            suggestedSolution: suggestedSolution.trim()
        });

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: comment
        });

    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update comment',
            error: error.message
        });
    }
};

const getAllRecommendations= async(req, res)=> {
        try {

            const recommendations = await FacultyRecommendation.findAll({
                include: [
                    {
                        model: BatchAdvisor,
                        as: 'postingAdvisor',
                    },
                    {
                        model: RecommendationComment,
                        as: 'comments',
                        include: [
                            {
                                model: BatchAdvisor,
                                as: 'commentingAdvisor',
                            }
                        ],
                        order: [['createdAt', 'DESC']]
                    }
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                success: true,
                data: recommendations,
            });

        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch recommendations',
                error: error.message
            });
        }
    }

const updateRecommendationStatus =async(req, res) => {
        try {
            const { userId } = req.params;
            const { status ,id} = req.body;

              console.log(req.params,req.body)
            const advisor=await BatchAdvisor.findOne({where:{userId}})
            if(!advisor){
                console.log(`Advisor id not found`)
                return res.json({success:false,message:"Unauthorized Access"})
            }
            const recommendation = await FacultyRecommendation.findByPk(id);
            if (!recommendation) {
                return res.status(404).json({
                    success: false,
                    message: 'Recommendation request not found'
                });
            }

            // Only allow status update by the posting advisor
            if (advisor.id !== recommendation.postingAdvisorId) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to update this recommendation'
                });
            }

            // If status is being set to 'Resolved' or 'Closed', set resolvedAt timestamp
            const updateData = { status };
            if (status === 'Resolved' || status === 'Closed') {
                updateData.resolvedAt = new Date();
            }

            await recommendation.update(updateData);

            return res.status(200).json({
                success: true,
                message: 'Recommendation status updated successfully',
                data: recommendation
            });

        } catch (error) {
            console.error('Error updating recommendation status:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update recommendation status',
                error: error.message
            });
        }
    }

const voteComment=async(req, res) =>{
        try {
            const { commentId } = req.params;
            const { voteType } = req.body; 

            const comment = await RecommendationComment.findByPk(commentId);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            const voteChange = voteType === 'upvote' ? 1 : -1;
            await comment.increment('voteCount', { by: voteChange });

            const updatedComment = await RecommendationComment.findByPk(commentId);

            return res.status(200).json({
                success: true,
                message: `Comment ${voteType}d successfully`,
                data: updatedComment
            });

        } catch (error) {
            console.error('Error voting on comment:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to vote on comment',
                error: error.message
            });
        }
    }

const acceptCommentAsSolution=async(req, res)=> {
        try {
            const { commentId } = req.body;
            const {userId }= req.params; 
            console.log(req.params,req.body)
            const advisor=await BatchAdvisor.findOne({where:{userId}})
            if(!advisor){
                console.log(`Advisor id not found`)
                return res.json({success:false,message:"Unauthorized Access"})
            }
            const comment = await RecommendationComment.findByPk(commentId, {
                include: [{
                    model: FacultyRecommendation,
                    as: 'recommendation',
                
                }]
            });

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            // Only the posting advisor of the recommendation can accept a solution
            const recommendation = comment.recommendation;
            if (advisor.id !== recommendation.postingAdvisorId) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to accept this solution'
                });
            }

            // Reset all previous accepted solutions
            await RecommendationComment.update(
                { isAccepted: false },
                { 
                    where: { 
                        recommendationId: comment.recommendationId 
                    } 
                }
            );

            // Accept this comment
            await comment.update({ isAccepted: true });

            // Update recommendation status to Resolved
            await recommendation.update({ 
                status: 'Resolved',
                resolvedAt: new Date()
            });

            return res.status(200).json({
                success: true,
                message: 'Solution accepted successfully',
                data: comment
            });

        } catch (error) {
            console.error('Error accepting solution:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to accept solution',
                error: error.message
            });
        }
    }

const deleteRecommendation = async (req, res) => {
    try {
        const { id } = req.params;

        const recommendation = await FacultyRecommendation.findByPk(id);

        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation request not found'
            });
        }

        await RecommendationComment.destroy({
            where: { recommendationId: id }
        });

        await recommendation.destroy();

        return res.status(200).json({
            success: true,
            message: 'Recommendation request and all associated comments deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting recommendation:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete recommendation',
            error: error.message
        });
    }
};

const deleteRecommendationComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await RecommendationComment.findByPk(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }
        const deletedCount = await RecommendationComment.destroy({
            where: { id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found or already deleted'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Recommendation comment deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting recommendation comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete recommendation comment',
            error: error.message
        });
    }
};


export default {addCommentToRecommendation,acceptCommentAsSolution,createRecommendationRequest,voteComment,getAllRecommendations,updateRecommendationStatus,deleteRecommendation,deleteRecommendationComment,updateCommentToRecommendation,updateRecommendationRequest};