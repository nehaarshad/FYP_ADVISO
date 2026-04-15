import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { Student } from '@/src/models/studentModel';
import {FilterOptions} from "../../../utilits/filterOptions/studentsFilter/studentsFilterOption"

export class StudentProfileRepository extends BaseApiService {
  private static instance: StudentProfileRepository;

  //to cacahe and avoid multiple api calls for the same data 
  private studentsCache: Student[] = [];

  private constructor() {
    super();
  }

   apiUrl: string = AppApis.LoginUrl;
  static getInstance(): StudentProfileRepository {
    if (!StudentProfileRepository.instance) {
      StudentProfileRepository.instance = new StudentProfileRepository();
    }
    return StudentProfileRepository.instance;
  }

async fetchAllStudents(forceRefresh: boolean = false): Promise<Student[]> {
    // Check cache
  
    if (!forceRefresh && this.studentsCache.length > 0 ) {
      console.log('Returning cached student data');
      return this.studentsCache;
    }

    try {
      const response = await this.getApiResponse<Student[]>(AppApis.getStudentsUrl);
      
      if (response.success && response.data) {
        this.studentsCache = response.data;
        return this.studentsCache;
      } else {
        throw new Error(response.error || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  filterStudents(students: Student[], options: FilterOptions): Student[] {
    let filtered = [...students];

    // Filter by SAP ID
    if (options.sapid) {
      const sapidStr = String(options.sapid);
      filtered = filtered.filter(student => 
        String(student.User.sapid).includes(sapidStr)
      );
    }

    // Filter by student name
    if (options.advName) {
      filtered = filtered.filter(student =>
        student.studentName.toLowerCase().includes(options.advName!.toLowerCase())
      );
    }

    // Filter by email
    if (options.email) {
      filtered = filtered.filter(student =>
        student.email.toLowerCase().includes(options.email!.toLowerCase())
      );
    }

    // Filter by 
    if (options.batchName && options.batchYear && options.programName) {
      filtered = filtered.filter(student =>
        student.BatchModel.batchName.toLowerCase().includes(options.batchName!.toLowerCase()) 
                && 
        student.BatchModel.batchYear.includes(options.batchYear!)
                &&
        student.BatchModel.ProgramModel.programName.toLowerCase().includes(options.programName!.toLowerCase())
    
      );
    }

    // Filter by student status
    if (options.currentStatus) {
      filtered = filtered.filter(student =>
        student.StudentStatus.currentStatus.toLowerCase().includes(options.currentStatus!.toLowerCase())
      );
    }

    // Filter by active status
    if (options.isActive !== undefined) {
      filtered = filtered.filter(student =>
        student.User.isActive === options.isActive
      );
    }

    // search term (search bar)
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        String(student.User.sapid).includes(term) ||
        student.studentName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.BatchModel.batchName.toLowerCase().includes(term) ||
        student.BatchModel.batchYear.includes(term) ||
        student.BatchModel.ProgramModel.programName.toLowerCase().includes(term) ||
        student.StudentStatus.currentStatus.toLowerCase().includes(term)
      );
    }

    return filtered;
  }


  getCachedStudents(): Student[] {
    return this.studentsCache;
  }

  clearCache(): void {
    this.studentsCache = [];
  }

  getStudentById(students: Student[], id: number): Student | undefined {
    return students.find(student => student.id === id);
  }

  getStudentBySapId(students: Student[], sapid: number): Student | undefined {
    return students.find(student => student.User.sapid === sapid);
  }

  // Get students by batch
  getStudentsByBatchAndProgram(students: Student[], batchName: string, batchYear: string,programName: string): Student[] {
    return students.filter(student =>
      student.BatchModel.batchName === batchName &&
      student.BatchModel.batchYear === batchYear &&
       student.BatchModel.ProgramModel.programName === programName
    );
  }

  // Get students by status
  getStudentsByStatus(students: Student[], status: string): Student[] {
    return students.filter(student =>
      student.StudentStatus.currentStatus === status
    );
  }

  // Get statistics
  getStudentStatistics(students: Student[]) {
    return {
      totalStudents: students.length,
    };
  }

}


export const studentProfileRepository = StudentProfileRepository.getInstance();