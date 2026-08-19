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
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 10 * 1000; //10 sec wait

  private static failedLoginAttempts = 0;
  private static lockedUntil: number | null = null;

  static getInstance(): LoginRepository {
    if (!LoginRepository.instance) {
      LoginRepository.instance = new LoginRepository();
    }
    return LoginRepository.instance;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
       //Check whether login is currently locked
      if (LoginRepository.lockedUntil !== null) {
        const remainingTime =
          LoginRepository.lockedUntil - Date.now();

        if (remainingTime > 0) {
          const remainingSeconds = Math.ceil(
            remainingTime / 1000
          );
          throw new Error(
            `Too many unsuccessful login attempts. ` +
            `Please wait ${remainingSeconds} seconds before trying again.`
          );
        }
        LoginRepository.lockedUntil = null;
        LoginRepository.failedLoginAttempts = 0;
      }

      const response = await this.postApiWithJson<ApiResponse<User>>(
        AppApis.LoginUrl,
        credentials
      );

      if (response.success && response.data) {
        LoginRepository.failedLoginAttempts = 0;
        LoginRepository.lockedUntil = null;

        if (
          response.data.data?.sessionToken &&
          response.data.data?.id
        ) {
          sessionManager.createSession(
            response.data,
            response.data.data.sessionToken
          );
        }

        return response.data;
      }
      LoginRepository.failedLoginAttempts++;

      if (
        LoginRepository.failedLoginAttempts >=
        LoginRepository.MAX_LOGIN_ATTEMPTS
      ) {
        LoginRepository.lockedUntil =
          Date.now() +
          LoginRepository.LOCKOUT_DURATION;

        throw new Error(
          'Too many unsuccessful login attempts. ' +
          'Please wait 10 seconds before trying again.'
        );
      }

      const remainingAttempts =
        LoginRepository.MAX_LOGIN_ATTEMPTS -
        LoginRepository.failedLoginAttempts;

      throw new Error(
        `${response.error || 'Invalid login credentials.'} ` +
        `${remainingAttempts} attempt(s) remaining.`
      );

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

export const loginRepository = LoginRepository.getInstance();