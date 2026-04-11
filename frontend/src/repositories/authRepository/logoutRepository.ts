import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { sessionManager } from '../../services/sessionManagement/sessionManager';

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
    
      const response = await this.postApiWithJson(
        `${AppApis.LogOutUrl}/${userId}`,
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