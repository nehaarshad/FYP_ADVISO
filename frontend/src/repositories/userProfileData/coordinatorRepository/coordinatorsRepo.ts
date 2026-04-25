import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import {FilterOptions} from "../../../utilits/filterOptions/studentsFilter/studentsFilterOption"
import { Coordinator } from '../../../models/coordinatorModel';

export class CoordinatorProfileRepository extends BaseApiService {
  private static instance: CoordinatorProfileRepository;

  //to cacahe and avoid multiple api calls for the same data 
  private coordCache: Coordinator[] = [];

  private constructor() {
    super();
  }

  static getInstance(): CoordinatorProfileRepository {
    if (!CoordinatorProfileRepository.instance) {
      CoordinatorProfileRepository.instance = new CoordinatorProfileRepository();
    }
    return CoordinatorProfileRepository.instance;
  }

async fetchAllCoordinators(forceRefresh: boolean = false): Promise<Coordinator[]> {
    // Check cache
  
    if (!forceRefresh && this.coordCache.length > 0 ) {
      console.log('Returning cached coordinator data ',this.coordCache);
      return this.coordCache;
    }

    try {
      const response = await this.getApiResponse<Coordinator[]>(AppApis.getAllCoordinatorsUrl);
      
      if (response.success && response.data) {
        this.coordCache = response.data;
        return this.coordCache;
      } else {
        throw new Error(response.error || 'Failed to fetch coord');
      }
    } catch (error) {
      console.error('Error fetching coord:', error);
      throw error;
    }
  }

  filterCoordinators(coords: Coordinator[], options: FilterOptions): Coordinator[] {
    let filtered = [...coords];

    // Filter by SAP ID
    if (options.sapid) {
      const sapidStr = String(options.sapid);
      filtered = filtered.filter(coord => 
        String(coord.User.sapid).includes(sapidStr)
      );
    }

    // Filter by name
    if (options.advName) {
      filtered = filtered.filter(cor =>
        cor.coordinatorName.toLowerCase().includes(options.advName!.toLowerCase())
      );
    }

    // search term (search bar)
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filtered = filtered.filter(adv =>
        String(adv.User.sapid).includes(term) ||
        adv.coordinatorName.toLowerCase().includes(term) 
      );
    }

    return filtered;
  }


  getCachedCoordinators(): Coordinator[] {
    return this.coordCache;
  }

  clearCache(): void {
    this.coordCache = [];
  }

  getCoordinatorById(adv: Coordinator[], id: number): Coordinator | undefined {
    return adv.find(adv => adv.id === id);
  }

  getCoordinatorBySapId(adv: Coordinator[], sapid: number): Coordinator | undefined {
    return adv.find(adv => adv.User.sapid === sapid);
  }

}


export const coordinatorProfileRepository = CoordinatorProfileRepository.getInstance();