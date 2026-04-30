import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
class CourseFilteringService {
   constructor() {
   this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            try {
            this.model = this.genAI.getGenerativeModel({ model:  "models/gemini-2.5-flash" });
            } catch (err) {
            console.error("Model load failed:", err);
            }
}

async filterAndMarkCourses(studentData, offeredCourses, roadmapCourses, program, currentSemester) {
    const prompt = this.buildFilteringPrompt(studentData, offeredCourses, roadmapCourses, program, currentSemester);

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
                const result = await this.model.generateContent(prompt);
            const response =  result.response;
            const text = response.text();
            const parsedResponse = this.parseLLMResponse(text);
            return parsedResponse;
        } catch (error) {
            lastError = error;
            if (error.status === 503 || error.status === 429) {
                const delay = 2000 * attempt; // 2s, 4s, 6s
                console.warn(`Attempt ${attempt} failed (${error.status}). Retrying in ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                throw error; // don't retry on other errors
            }
        }
    }

    console.error("Course Filtering Error:", lastError);
    throw lastError;
}

    buildFilteringPrompt(studentData, offeredCourses, roadmapCourses, program, currentSemester) {
        return `
You are a course filtering system for a university's ${program} program. Your task is to analyze course offerings and mark roadmap courses.

## STUDENT INFORMATION:
- Program: ${program}
- Current Semester: ${currentSemester}

## ROADMAP COURSES (Need to check which are offered):
${JSON.stringify(roadmapCourses, null, 2)}

## ALL COURSE OFFERINGS THIS SESSION:
${JSON.stringify(offeredCourses, null, 2)}

## Filter roadmap courses against offered courses. 
   Extract all electives/supporting courses (category ends with "Elective" or includes "Supporting"/"Domain Elective" for SE/CS). 
   Mark each roadmap course as offered (same/different program/semester) or not offered. 
   Return filtered list with offered roadmap courses, not offered roadmap courses, cross-program courses, and eligible electives with relevance explanation.

## RESPONSE FORMAT (VALID JSON ONLY):

{
    "filteredCourses": [
        {
            "courseId": "number",
            "courseName": "string",
            "credits": "number",
            "category": "string",
            "offeredProgram": "string",
            "offeredBatch": "string",
            "timeSlots": ["string"],
            "relevanceToProgram": "string",
            "selectionReason": "string"
        }
    ]
}

## IMPORTANT NOTES:
1. Return ONLY valid JSON, no other text
2. For timetable conflicts, note all time slots
3. If a course has multiple offerings, list all
4. For ${program} students, explain relevance of each elective
5. Consider student's current semester when appropriate
`;
    }

    parseLLMResponse(responseText) {
        try {
            console.log("Filtering Response:\n\n ", responseText);
            let cleanText = responseText.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```/g, '');
            }
            return JSON.parse(cleanText);
        } catch (error) {
            console.error("Failed to parse filtering response:", error);
            throw error;
        }
    }
}


const courseFilteringService = new CourseFilteringService();
export default courseFilteringService;
