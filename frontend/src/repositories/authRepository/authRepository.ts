
import { SignupCredentials } from '@/src/credentials/authCred/signUpCreds';
import { LoginCredentials } from '../../credentials/authCred/loginCred';
import { sessionManager } from '../../services/sessionManagement/sessionManager';
import { loginRepository } from './loginRepository';
import { ApiResponse } from '@/src/services/baseApiServices/ApiResponseType/apiResponseType';
import { User } from '@/src/models/userModel';
import { signUpRepository } from './signUpRepository';
import { logoutRepository } from './logoutRepository';
import { passwordRepository } from './forgetPasswordRepository';

export class AuthRepository {
  private static instance: AuthRepository;

  private constructor() {}

  static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  // Login operations
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return loginRepository.login(credentials);
  }

  // Signup operations
  async signup(credentials: SignupCredentials): Promise<ApiResponse<User>> {
    return signUpRepository.signUp(credentials);
  }

  // Logout operations
  async logout(userId: number): Promise<void> {
    return logoutRepository.logout(userId);
  }

  // Password operations
  async forgotPassword(sapid: string, newPassword: string): Promise<void> {
    return passwordRepository.forgotPassword(sapid, newPassword);
  }

  getCurrentUser(): ApiResponse<User> | null {
    return sessionManager.getCurrentUser<ApiResponse<User>>();
  }

  isAuthenticated(): boolean {
    return sessionManager.hasActiveSession();
  }

  getAuthHeaders() {
    return sessionManager.getAuthHeaders();
  }


  forceLogout(): void {
    logoutRepository.forceLogout();
  }

}

// Export singleton instance
export const authRepository = AuthRepository.getInstance();