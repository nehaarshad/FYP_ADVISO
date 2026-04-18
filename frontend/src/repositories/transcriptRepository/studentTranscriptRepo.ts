/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/transcript/transcriptRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { DegreeTranscript } from '@/src/models/degreeTranscriptModel';
import { TranscriptCourseDetail } from '@/src/models/TranscriptCoursesDetailModel';
import paramsUrl from '@/src/utilits/constructUrl/constructParamsUrl';


class TranscriptRepository extends BaseApiService {
  private static instance: TranscriptRepository;

  private constructor() {
    super();
  }

  static getInstance(): TranscriptRepository {
    if (!TranscriptRepository.instance) {
      TranscriptRepository.instance = new TranscriptRepository();
    }
    return TranscriptRepository.instance;
  }

  async getStudentTranscript(studentId: number): Promise<ApiResponse<DegreeTranscript>> {
    try {
      const url = paramsUrl(AppApis.getStudentTranscriptSummaryUrl, { id: studentId.toString() });
     const response = await this.getApiResponse<any>(url);
      
      console.log('Transcript API response:', response);
      
      if (response.success && response.data) {
        let transcriptData: DegreeTranscript;
        
        if (response.data.data) {
          transcriptData = response.data.data;
        } else  {
          transcriptData = response.data;
        } 
        
        return { success: true, data: transcriptData };
      }
      return response;
    } catch (error) {
      console.error('Get student transcript error:', error);
      throw error;
    }
  }

  calculateCGPA(transcript: DegreeTranscript): string {
    if (transcript?.currentCGPA) {
      return transcript.currentCGPA;
    }
    
    // Calculate from sessional transcripts if needed
    let totalPoints = 0;
    let totalCredits = 0;
    
    transcript?.SessionalTranscripts?.forEach(sessional => {
      sessional.TranscriptCoursesDetails?.forEach(course => {
        const points = parseFloat(course.points) || 0;
        const credits = parseFloat(course.earnedCreditHours) || 0;
        totalPoints += points * credits;
        totalCredits += credits;
      });
    });
    
    if (totalCredits > 0) {
      return (totalPoints / totalCredits).toFixed(2);
    }
    return '0.00';
  }

  // Get total earned credits
  getTotalEarnedCredits(transcript: DegreeTranscript): number {
    if (transcript?.totalEarnedCreditHours) {
      return parseInt(transcript.totalEarnedCreditHours) || 0;
    }
    
    let total = 0;
    transcript?.SessionalTranscripts?.forEach(sessional => {
      total += parseInt(sessional.semesterEarnedCreditHours) || 0;
    });
    return total;
  }

  // Group courses by semester
  groupCoursesBySemester(transcript: DegreeTranscript) {
    const semesters: { semester: string; earnedCredits:number | string ;sgpa: string; courses: TranscriptCourseDetail[] }[] = [];
    
    transcript?.SessionalTranscripts?.forEach((sessional, index) => {
      semesters.push({
        semester: `Semester ${index + 1}`,
        sgpa: sessional.semesterGPA,
        earnedCredits: sessional.semesterEarnedCreditHours,
        courses: sessional.TranscriptCoursesDetails || []
      });
    });
    
    return semesters;
  }
}

export const transcriptRepository = TranscriptRepository.getInstance();