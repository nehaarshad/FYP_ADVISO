import sequelize from "../config/dbConfig.js";
import CoursesModel from '../models/coursesModel.js';
import CoursePreReqModel from '../models/coursePreReqModel.js';
import CourseCategoryModel from '../models/courseCategoryModel.js';
import { Op } from 'sequelize';
import CategoryModel from '../models/categoryModel.js';
import fs from 'fs';

const updateCourseCredentials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseCode, courseName, courseCredits, prerequisiteIds } = req.body;

        // Check if course exists
        const course = await CoursesModel.findByPk(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        // Verify all prerequisite courses exist
        if (prerequisiteIds && prerequisiteIds.length > 0) {
            const existingPrereqs = await CoursesModel.findAll({
                where: {
                    id: { [Op.in]: prerequisiteIds }
                }
            });

            if (existingPrereqs.length !== prerequisiteIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more prerequisite courses not found'
                });
            }
        }

        await course.update({
            courseCode: courseCode !== undefined ? courseCode : course.courseCode,
            courseName: courseName !== undefined ? courseName : course.courseName,
            courseCredits: courseCredits !== undefined ? courseCredits : course.courseCredits
        });

        if (prerequisiteIds !== undefined) {
            // Remove existing prerequisites
            await CoursePreReqModel.destroy({
                where: { courseid: courseId }
            });

            // Add new prerequisites
            if (prerequisiteIds.length > 0) {
                const newPrereqs = prerequisiteIds.map(prereqId => ({
                    courseid: courseId,
                    preReqCourseId: prereqId
                }));
                await CoursePreReqModel.bulkCreate(newPrereqs);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
        });

    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update course',
            error: error.message
        });
    }
};

export default { updateCourseCredentials };