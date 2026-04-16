/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/userProfileData/studentsRepository/studentsRepo.ts (FIXED)
import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { Student } from '@/src/models/studentModel';
import { FilterOptions } from "../../../utilits/filterOptions/studentsFilter/studentsFilterOption";

export class StudentProfileRepository extends BaseApiService {
  private static instance: StudentProfileRepository;
  private studentsCache: Student[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): StudentProfileRepository {
    if (!StudentProfileRepository.instance) {
      StudentProfileRepository.instance = new StudentProfileRepository();
    }
    return StudentProfileRepository.instance;
  }

  async fetchAllStudents(forceRefresh: boolean = false): Promise<Student[]> {
    // Check cache
    const now = Date.now();
    if (!forceRefresh && this.studentsCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached student data', this.studentsCache.length);
      return this.studentsCache;
    }

    try {
      const response = await this.getApiResponse<any>(AppApis.getStudentsUrl);
      console.log('API Response:', response);
      
      // Handle different response formats
      let studentsData: Student[] = [];
      
      if (response.success && response.data) {
        // Check if response.data is an array or has a data property
        if (Array.isArray(response.data)) {
          studentsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (Array.isArray(response)) {
          studentsData = response;
        } else {
          console.warn('Unexpected data format:', response.data);
          studentsData = [];
        }
      } else if (Array.isArray(response)) {
        studentsData = response;
      }
      
      console.log('Processed students data:', studentsData.length);
      
      // IMPORTANT: Don't throw error for empty array - it's a valid response
      this.studentsCache = studentsData;
      this.lastFetchTime = now;
      return this.studentsCache;
      
    } catch (error) {
      console.error('Error fetching students:', error);
      // Return empty array instead of throwing
      this.studentsCache = [];
      return this.studentsCache;
    }
  }

  filterStudents(students: Student[], options: FilterOptions): Student[] {
    if (!students || !Array.isArray(students)) {
      console.warn('filterStudents called with invalid students array');
      return [];
    }
    
    let filtered = [...students];

    // Filter by SAP ID
    if (options.sapid) {
      const sapidStr = String(options.sapid);
      filtered = filtered.filter(student => 
        student.User && String(student.User.sapid).includes(sapidStr)
      );
    }

    // Filter by student name
    if (options.advName) {
      filtered = filtered.filter(student =>
        student.studentName && student.studentName.toLowerCase().includes(options.advName!.toLowerCase())
      );
    }

    // Filter by email
    if (options.email) {
      filtered = filtered.filter(student =>
        student.email && student.email.toLowerCase().includes(options.email!.toLowerCase())
      );
    }

    // Filter by batch
    if (options.batchName && options.batchYear && options.programName) {
      filtered = filtered.filter(student =>
        student.BatchModel &&
        student.BatchModel.batchName &&
        student.BatchModel.batchName.toLowerCase().includes(options.batchName!.toLowerCase()) &&
        student.BatchModel.batchYear &&
        student.BatchModel.batchYear.includes(options.batchYear!) &&
        student.BatchModel.ProgramModel &&
        student.BatchModel.ProgramModel.programName &&
        student.BatchModel.ProgramModel.programName.toLowerCase().includes(options.programName!.toLowerCase())
      );
    }

    // Filter by student status
    if (options.currentStatus) {
      filtered = filtered.filter(student =>
        student.StudentStatus &&
        student.StudentStatus.currentStatus &&
        student.StudentStatus.currentStatus.toLowerCase().includes(options.currentStatus!.toLowerCase())
      );
    }

    // Filter by active status
    if (options.isActive !== undefined) {
      filtered = filtered.filter(student =>
        student.User && student.User.isActive === options.isActive
      );
    }

    // Search term (search bar)
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        (student.User && String(student.User.sapid).includes(term)) ||
        (student.studentName && student.studentName.toLowerCase().includes(term)) ||
        (student.email && student.email.toLowerCase().includes(term)) ||
        (student.BatchModel && student.BatchModel.batchName && student.BatchModel.batchName.toLowerCase().includes(term)) ||
        (student.BatchModel && student.BatchModel.batchYear && student.BatchModel.batchYear.includes(term)) ||
        (student.BatchModel && student.BatchModel.ProgramModel && student.BatchModel.ProgramModel.programName && student.BatchModel.ProgramModel.programName.toLowerCase().includes(term)) ||
        (student.StudentStatus && student.StudentStatus.currentStatus && student.StudentStatus.currentStatus.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  getCachedStudents(): Student[] {
    return this.studentsCache;
  }

  clearCache(): void {
    this.studentsCache = [];
    this.lastFetchTime = 0;
  }

  getStudentById(students: Student[], id: number): Student | undefined {
    if (!students || !Array.isArray(students)) return undefined;
    return students.find(student => student.id === id);
  }

  getStudentBySapId(students: Student[], sapid: number): Student | undefined {
    if (!students || !Array.isArray(students)) return undefined;
    return students.find(student => student.User && student.User.sapid === sapid);
  }

  getStudentsByBatchAndProgram(students: Student[], batchName: string, batchYear: string, programName: string): Student[] {
    if (!students || !Array.isArray(students)) return [];
    return students.filter(student =>
      student.BatchModel &&
      student.BatchModel.batchName === batchName &&
      student.BatchModel.batchYear === batchYear &&
      student.BatchModel.ProgramModel &&
      student.BatchModel.ProgramModel.programName === programName
    );
  }

  getStudentsByStatus(students: Student[], status: string): Student[] {
    if (!students || !Array.isArray(students)) return [];
    return students.filter(student =>
      student.StudentStatus &&
      student.StudentStatus.currentStatus === status
    );
  }

  getStudentStatistics(students: Student[]) {
    if (!students || !Array.isArray(students)) {
      return { totalStudents: 0, activeStudents: 0, inactiveStudents: 0 };
    }
    return {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.User && s.User.isActive === true).length,
      inactiveStudents: students.filter(s => s.User && s.User.isActive === false).length,
    };
  }
}

export const studentProfileRepository = StudentProfileRepository.getInstance();