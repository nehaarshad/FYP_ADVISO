import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import {AdvisorNote} from '@/src/models/AdvisorNotes';
import {CreateAdvisorNoteData,UpdateAdvisorNoteData,GetAdvisorNotesData} from '@/src/hooks/advisorNotesHook/types/advisorNoteType';
import paramsUrl from '@/src/utilits/constructUrl/constructParamsUrl';

class AdvisorNotesRepository extends BaseApiService {
  private static instance: AdvisorNotesRepository;

  private notesCache: AdvisorNote[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): AdvisorNotesRepository {
    if (!AdvisorNotesRepository.instance) {
      AdvisorNotesRepository.instance = new AdvisorNotesRepository();
    }

    return AdvisorNotesRepository.instance;
  }

  async getNotes(
    data: GetAdvisorNotesData,
    forceRefresh: boolean = false
  ): Promise<ApiResponse<AdvisorNote[]>> {
    const now = Date.now();

    if (
      !forceRefresh &&
      this.notesCache.length > 0 &&
      now - this.lastFetchTime < this.cacheDuration
    ) {
      console.log(
        'Returning cached advisor notes:',
        this.notesCache.length
      );

      return {
        success: true,
        data: this.notesCache,
        message: 'Notes retrieved from cache',
      };
    }

    try {
      console.log('Getting advisor notes:', data);
      
     const url = paramsUrl(AppApis.getNotes, { userId: data.userId.toString() });
      const response = await this.getApiResponse<{
        data: AdvisorNote[];
        success: boolean;
        message?: string;
      }>(url);

      console.log('Get advisor notes response:', response);

      if (response.success) {
        const notesData = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        this.notesCache = notesData;
        this.lastFetchTime = now;

        return {
          success: true,
          data: notesData,
          message: response.data?.message || 'Notes retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to fetch notes',
        data: [],
      };
    } catch (error) {
      console.error('Get advisor notes error:', error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch advisor notes',
        data: [],
      };
    }
  }

  async createNote(
    data: CreateAdvisorNoteData
  ): Promise<ApiResponse<AdvisorNote>> {
    try {
      console.log('Creating advisor note:', data);

      const response = await this.postApiWithJson<{
        success: boolean;
        message: string;
        data?: AdvisorNote;
      }>(AppApis.createNotes, data);

      console.log('Create advisor note response:', response);

      if (response.success) {
        this.clearCache();

        return {
          success: true,
          data: response.data?.data,
          message:
            response.data?.message || 'Note created successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to create note',
      };
    } catch (error) {
      console.error('Create advisor note error:', error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create advisor note',
      };
    }
  }


async updateNote(data: UpdateAdvisorNoteData): Promise<ApiResponse<AdvisorNote>> {
  try {
    console.log('Updating advisor note:', data);
    
    // Validate required fields
    if (!data.id) {
      return {
        success: false,
        error: 'Note ID is required',
      };
    }

    if (!data.userId) {
      return {
        success: false,
        error: 'Advisor ID is required',
      };
    }

    // Prepare the URL
      const url = AppApis.updateNotes.replace(':id',data.id.toString())
      
    console.log('Update URL:', url);

    const requestBody = {
      userId: data.userId, 
      title: data.title,
      noteContent: data.noteContent,
    };

    console.log('Request body:', requestBody);

    // Make the API call
    const response = await this.updateApiWithJson<{
      success: boolean;
      message: string;
      data?: AdvisorNote;
    }>(url, requestBody);

    console.log('Update response:', response);

    if (response.success) {
      // Update cache if note exists
      const index = this.notesCache.findIndex(n => Number(n.id) === Number(data.id));

      return {
        success: true,
        data: response.data?.data,
        message: response.message || 'Note updated successfully',
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update note',
    };
  } catch (error) {
    console.error('Update note error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update note',
    };
  }
}


  async deleteNote(
    id: number
  ): Promise<ApiResponse<null>> {
    try {
      const url = AppApis.deleteNotes.replace(':id',id.toString())
      
      console.log('Deleting advisor note:', id,url);

      const response = await this.deleteApiResponse<{
        success: boolean;
        message: string;
      }>(url);

      console.log('Delete advisor note response:', response);

      if (response.success) {
        this.clearCache();

        return {
          success: true,
          data: null,
          message:
            response.data?.message || 'Note deleted successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to delete note',
      };
    } catch (error) {
      console.error('Delete advisor note error:', error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete advisor note',
      };
    }
  }


  getNoteById(id: number): AdvisorNote | undefined {
    return this.notesCache.find(note => Number(note.id) === Number(id));
  }


  clearCache(): void {
    this.notesCache = [];
    this.lastFetchTime = 0;

    console.log('Advisor notes cache cleared');
  }

  getCachedNotes(): AdvisorNote[] {
    return this.notesCache;
  }
}

export const advisorNotesRepository =
  AdvisorNotesRepository.getInstance();