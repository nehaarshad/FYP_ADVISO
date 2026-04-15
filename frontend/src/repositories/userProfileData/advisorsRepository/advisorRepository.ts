import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import {FilterOptions} from "../../../utilits/filterOptions/studentsFilter/studentsFilterOption"
import { addAttrValue } from 'framer-motion';

export class AdvisorProfileRepository extends BaseApiService {
  private static instance: AdvisorProfileRepository;

  //to cacahe and avoid multiple api calls for the same data 
  private advisorCache: BatchAdvisor[] = [];

  private constructor() {
    super();
  }

   apiUrl: string = AppApis.LoginUrl;
  static getInstance(): AdvisorProfileRepository {
    if (!AdvisorProfileRepository.instance) {
      AdvisorProfileRepository.instance = new AdvisorProfileRepository();
    }
    return AdvisorProfileRepository.instance;
  }

async fetchAllAdvisors(forceRefresh: boolean = false): Promise<BatchAdvisor[]> {
    // Check cache
  
    if (!forceRefresh && this.advisorCache.length > 0 ) {
      console.log('Returning cached student data');
      return this.advisorCache;
    }

    try {
      const response = await this.getApiResponse<BatchAdvisor[]>(AppApis.getAdvisorsUrl);
      
      if (response.success && response.data) {
        this.advisorCache = response.data;
        return this.advisorCache;
      } else {
        throw new Error(response.error || 'Failed to fetch advisors');
      }
    } catch (error) {
      console.error('Error fetching advisors:', error);
      throw error;
    }
  }

  filterAdvisors(advisor: BatchAdvisor[], options: FilterOptions): BatchAdvisor[] {
    let filtered = [...advisor];

    // Filter by SAP ID
    if (options.sapid) {
      const sapidStr = String(options.sapid);
      filtered = filtered.filter(adv => 
        String(adv.User.sapid).includes(sapidStr)
      );
    }

    // Filter by name
    if (options.advName) {
      filtered = filtered.filter(adv =>
        adv.advisorName.toLowerCase().includes(options.advName!.toLowerCase())
      );
    }
    // Filter by 
    if (options.batchName && options.batchYear && options.programName) {
      filtered = filtered.filter(adv =>
        adv.BatchModel.batchName.toLowerCase().includes(options.batchName!.toLowerCase()) 
                && 
        adv.BatchModel.batchYear.includes(options.batchYear!)
                &&
        adv.BatchModel.ProgramModel.programName.toLowerCase().includes(options.programName!.toLowerCase())
    
      );
    }

    // Filter by active status
    if (options.isActive !== undefined) {
      filtered = filtered.filter(adv =>
        adv.User.isActive === options.isActive
      );
    }

    // search term (search bar)
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter(adv =>
        String(adv.User.sapid).includes(term) ||
        adv.advisorName.toLowerCase().includes(term) ||
        adv.email.toLowerCase().includes(term) ||
        adv.BatchModel.batchName.toLowerCase().includes(term) ||
        adv.BatchModel.batchYear.includes(term) ||
        adv.BatchModel.ProgramModel.programName.toLowerCase().includes(term) 
      );
    }

    return filtered;
  }


  getCachedStudents(): BatchAdvisor[] {
    return this.advisorCache;
  }

  clearCache(): void {
    this.advisorCache = [];
  }

  getAdvisorById(adv: BatchAdvisor[], id: number): BatchAdvisor | undefined {
    return adv.find(adv => adv.id === id);
  }

  getAdvisorBySapId(adv: BatchAdvisor[], sapid: number): BatchAdvisor | undefined {
    return adv.find(adv => adv.User.sapid === sapid);
  }

  // Get students by batch
  getAdvisorByBatchAndProgram(adv: BatchAdvisor[], batchName: string, batchYear: string,programName: string): BatchAdvisor[] {
    return adv.filter(adv =>
      adv.BatchModel.batchName === batchName &&
      adv.BatchModel.batchYear === batchYear &&
       adv.BatchModel.ProgramModel.programName === programName
    );
  }

  // Get statistics
  getAdvisorStatistics(adv: BatchAdvisor[]) {
    return {
      totalAdvisors: adv.length,
    };
  }

}


export const advisorProfileRepository = AdvisorProfileRepository.getInstance();