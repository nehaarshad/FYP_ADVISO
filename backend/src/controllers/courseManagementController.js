import sequelize from "../config/dbConfig.js";
import CoursesModel from '../models/coursesModel.js';
import CoursePreReqModel from '../models/coursePreReqModel.js';
import CourseCategoryModel from '../models/courseCategoryModel.js';
import { Op } from 'sequelize';
import CategoryModel from '../models/categoryModel.js';
import SemesterCourseModel from '../models/semesterCourseModel.js';

const updateCourseCredentials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseCode, courseName, courseCredits, prerequisiteIds, categoryIds } = req.body;

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

        // Verify all categories exist
        if (categoryIds && categoryIds.length > 0) {
            const existingCategories = await CategoryModel.findAll({
                where: {
                    id: { [Op.in]: categoryIds }
                }
            });

            if (existingCategories.length !== categoryIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more categories not found'
                });
            }
        }

        // Update basic course info
        await course.update({
            courseCode: courseCode !== undefined ? courseCode : course.courseCode,
            courseName: courseName !== undefined ? courseName : course.courseName,
            courseCredits: courseCredits !== undefined ? courseCredits : course.courseCredits
        });

        // Update prerequisites
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

        // Update categories
        if (categoryIds !== undefined) {
            //  get existing course-category associations
            const existingAssociations = await CourseCategoryModel.findAll({
                where: { courseId: courseId }
            });

            // Get existing category IDs
            const existingCategoryIds = existingAssociations.map(assoc => assoc.categoryId);

            // Find categories to add 
            const categoriesToAdd = categoryIds.filter(id => !existingCategoryIds.includes(id));

            // Add new categories
            if (categoriesToAdd.length > 0) {
                const newCategories = categoriesToAdd.map(categoryId => ({
                    courseId: courseId,
                    categoryId: categoryId
                }));
                await CourseCategoryModel.bulkCreate(newCategories);
              console.log(`Added ${categoriesToAdd.length} new categories to course ${courseId}`);
            } else {
                console.log('All selected categories already assigned to this course');
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