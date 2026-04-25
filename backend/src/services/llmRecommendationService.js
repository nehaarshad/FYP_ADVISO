
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { buildPrompt } from "../utils/systemPrompt.js";

dotenv.config();

class LLMRecommendationService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            try {
            this.model = this.genAI.getGenerativeModel({ model:  "models/gemini-2.5-flash" });
            } catch (err) {
            console.error("Model load failed:", err);
            }
    }

    async generateRecommendations(studentData, offeredCourses, allowedCredits,program,studentStatus) {
        const prompt = buildPrompt(studentData, offeredCourses, allowedCredits,program,studentStatus);
        
        try {
            const result = await this.model.generateContent(prompt);
            const response =  result.response;
            const text = response.text();
            
            // Parse the JSON response
            const parsedResponse = this.parseLLMResponse(text);
            return parsedResponse;
        } catch (error) {
            console.error("LLM Recommendation Error:", error);
            throw error;
        }
    }


    parseLLMResponse(responseText) {
        try {

            console.log("LLM RESPONSE:\n\n ", responseText)
            // Clean the response text
            let cleanText = responseText.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```/g, '');
            }
            return JSON.parse(cleanText);
        } catch (error) {
            console.error("Failed to parse LLM response:", error);
            throw error;
        }
    }

     getPriorityLevel(rec) {
    if (rec.actionRequired === 'RETAKE' || rec.actionRequired === 'REQUEST_SPECIAL_OFFERING') return 'CRITICAL';
    if (rec.actionRequired === 'SUBSTITUTE') return 'LOW';
    if (rec.reason?.includes('D grade')) return 'MEDIUM';
    return 'HIGH';
}
}
const llmRecommendationService = new LLMRecommendationService();
export default llmRecommendationService;