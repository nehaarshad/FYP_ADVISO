/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/userProfileData/advisorsRepository/advisorRepository.ts (Add debug logs)
import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import { FilterOptions } from "../../../utilits/filterOptions/studentsFilter/studentsFilterOption";

export class AdvisorProfileRepository extends BaseApiService {
  private static instance: AdvisorProfileRepository;
  private advisorCache: BatchAdvisor[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000;

  private constructor() {
    super();
  }

  static getInstance(): AdvisorProfileRepository {
    if (!AdvisorProfileRepository.instance) {
      AdvisorProfileRepository.instance = new AdvisorProfileRepository();
    }
    return AdvisorProfileRepository.instance;
  }

  async fetchAllAdvisors(forceRefresh: boolean = false): Promise<BatchAdvisor[]> {
    const now = Date.now();
    if (!forceRefresh && this.advisorCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached advisor data', this.advisorCache.length);
      return this.advisorCache;
    }

    try {
      const response = await this.getApiResponse<BatchAdvisor[]>(AppApis.getAdvisorsUrl);
      console.log('=== ADVISOR API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      
      let advisorsData: BatchAdvisor[] = [];
      
      // Handle different response formats
      if (Array.isArray(response)) {
        // Response is directly an array
        advisorsData = response;
        console.log('Response is array, length:', advisorsData.length);
      } else if (response.success && response.data) {
        // Response is ApiResponse with data
        if (Array.isArray(response.data)) {
          advisorsData = response.data;
          console.log('Data is array, length:', advisorsData.length);
        } else if ('data' in response.data && Array.isArray((response.data as any).data)) {
          advisorsData = (response.data as any).data;
          console.log('Data is nested in data.data, length:', advisorsData.length);
        } else {
          console.warn('Unexpected advisor data format:', response.data);
          advisorsData = [];
        }
      } else {
        console.warn('Unexpected response format:', response);
        advisorsData = [];
      }
      
      console.log('Final advisors data length:', advisorsData.length);
      console.log('First advisor sample:', advisorsData[0]);
      
      this.advisorCache = advisorsData;
      this.lastFetchTime = now;
      return this.advisorCache;
      
    } catch (error) {
      console.error('Error fetching advisors:', error);
      this.advisorCache = [];
      return this.advisorCache;
    }
  }

  filterAdvisors(advisors: BatchAdvisor[], options: FilterOptions): BatchAdvisor[] {
    console.log('Filtering advisors with options:', options);
    console.log('Advisors before filter:', advisors?.length);
    
    if (!advisors || !Array.isArray(advisors)) {
      console.warn('filterAdvisors called with invalid advisors array');
      return [];
    }
    
    let filtered = [...advisors];

    if (options.sapid) {
      const sapidStr = String(options.sapid);
      filtered = filtered.filter(adv => 
        adv.User && String(adv.User.sapid).includes(sapidStr)
      );
      console.log('After SAP ID filter:', filtered.length);
    }

    if (options.advName) {
      filtered = filtered.filter(adv =>
        adv.advisorName && adv.advisorName.toLowerCase().includes(options.advName!.toLowerCase())
      );
      console.log('After name filter:', filtered.length);
    }

    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter(adv =>
        (adv.User && String(adv.User.sapid).includes(term)) ||
        (adv.advisorName && adv.advisorName.toLowerCase().includes(term)) ||
        (adv.email && adv.email.toLowerCase().includes(term))
      );
      console.log('After search term filter:', filtered.length);
    }

    return filtered;
  }

  getCachedAdvisors(): BatchAdvisor[] {
    return this.advisorCache;
  }

  clearCache(): void {
    this.advisorCache = [];
    this.lastFetchTime = 0;
  }

  getAdvisorById(advisors: BatchAdvisor[], id: number): BatchAdvisor | undefined {
    if (!advisors || !Array.isArray(advisors)) return undefined;
    return advisors.find(adv => adv.id === id);
  }

  getAdvisorBySapId(advisors: BatchAdvisor[], sapid: number): BatchAdvisor | undefined {
    if (!advisors || !Array.isArray(advisors)) return undefined;
    return advisors.find(adv => adv.User && adv.User.sapid === sapid);
  }

  getAdvisorStatistics(advisors: BatchAdvisor[]) {
    if (!advisors || !Array.isArray(advisors)) {
      return { totalAdvisors: 0, activeAdvisors: 0, inactiveAdvisors: 0 };
    }
    return {
      totalAdvisors: advisors.length,
      activeAdvisors: advisors.filter(a => a.User && a.User.isActive === true).length,
      inactiveAdvisors: advisors.filter(a => a.User && a.User.isActive === false).length,
    };
  }
}

export const advisorProfileRepository = AdvisorProfileRepository.getInstance();