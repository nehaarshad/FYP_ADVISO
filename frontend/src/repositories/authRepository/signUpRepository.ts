import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { SignupCredentials } from '../../credentials/authCred/signUpCreds';
import { User } from '@/src/models/userModel';
import { sessionManager } from '../../services/sessionManagement/sessionManager';

export class SignUpRepository extends BaseApiService {
  private static instance: SignUpRepository;

  private constructor() {
    super();
  }

  static getInstance(): SignUpRepository {
    if (!SignUpRepository.instance) {
      SignUpRepository.instance = new SignUpRepository();
    }
    return SignUpRepository.instance;
  }

  async signUp(credentials: SignupCredentials): Promise<ApiResponse<User>> {
    try {
      const response = await this.postApiWithJson<ApiResponse<User>>(
        AppApis.SignUpUrl,
        credentials
      );

      console.log('Sign up response:', response);

      if (response.success && response.data) {

        if (response.data.data?.sessionToken && response.data.data?.id) {

          sessionManager.createSession(response.data, response.data.data.sessionToken);
        }
        return response.data;
      }

      throw new Error(response.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

}

export const signUpRepository = SignUpRepository.getInstance();