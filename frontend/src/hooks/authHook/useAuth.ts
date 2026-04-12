/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRepository } from '../../repositories/authRepository/authRepository';
import { LoginCredentials } from '@/src/credentials/authCred/loginCred';
import { SignupCredentials } from '@/src/credentials/authCred/signUpCreds';

export const useAuth = () => {
  
  const login = async (credentials: LoginCredentials) => {
    try {
      // Only need to call login - it handles everything internally
      const user = await authRepository.login(credentials);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const user = await authRepository.signup(credentials);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async (userId: number) => {
    try {
      await authRepository.logout(userId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const checkAuth = () => {
    return authRepository.isAuthenticated();
  };

   const getCurrentUser = () => {
    return authRepository.getCurrentUser();
  };


  return {
    login,
    signup,
    logout,
    getCurrentUser,
    checkAuth,
  };
};