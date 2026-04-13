import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { LoginCredentials } from '../../credentials/authCred/loginCred';
import { User } from '@/src/models/userModel';
import { sessionManager } from '../../services/sessionManagement/sessionManager';

export class LoginRepository extends BaseApiService {
  private static instance: LoginRepository;

  private constructor() {
    super();
  }

   apiUrl: string = AppApis.LoginUrl;
  static getInstance(): LoginRepository {
    if (!LoginRepository.instance) {
      LoginRepository.instance = new LoginRepository();
    }
    return LoginRepository.instance;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
  console.log('API Base URL:', AppApis.BASE_URL);
    console.log('Full Login URL:', AppApis.LoginUrl);
    console.log('Login credentials:', credentials);
      const response = await this.postApiWithJson<ApiResponse<User>>(
        AppApis.LoginUrl,
        credentials
      );

      console.log('Login response:', response);

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

export const loginRepository = LoginRepository.getInstance();