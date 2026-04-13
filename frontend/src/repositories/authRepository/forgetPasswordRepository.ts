import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';

export class PasswordRepository extends BaseApiService {
  private static instance: PasswordRepository;

  private constructor() {
    super();
  }

  static getInstance(): PasswordRepository {
    if (!PasswordRepository.instance) {
      PasswordRepository.instance = new PasswordRepository();
    }
    return PasswordRepository.instance;
  }

  async forgotPassword(sapid: string, newPassword: string): Promise<void> {
    try {

        const body = {
            "sapid": sapid,
            "password": newPassword
        }

        console.log('Forgot password request body:', body);
      const response = await this.postApiWithJson(
        AppApis.ForgetPasswordUrl,
        body
      );

      console.log('Forgot password response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

}

export const passwordRepository = PasswordRepository.getInstance();