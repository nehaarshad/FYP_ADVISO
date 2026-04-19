import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { sessionManager } from '../../services/sessionManagement/sessionManager';
import paramsUrl from '@/src/utilits/constructUrl/constructParamsUrl';

export class LogoutRepository extends BaseApiService {
  private static instance: LogoutRepository;

  private constructor() {
    super();
  }

  static getInstance(): LogoutRepository {
    if (!LogoutRepository.instance) {
      LogoutRepository.instance = new LogoutRepository();
    }
    return LogoutRepository.instance;
  }

  async logout(userId: number): Promise<void> {
    try {
    
      const url = paramsUrl(AppApis.LogOutUrl,{ id: userId.toString() })
      const response = await this.postApiWithJson(
        url,
        {},
      );

      // Clear session on success
      if (response.success) {
        sessionManager.destroySession();
      } else {
        throw new Error(response.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Force logout without API call (for token expiration)
  forceLogout(): void {
    sessionManager.destroySession();
  }
}

export const logoutRepository = LogoutRepository.getInstance();