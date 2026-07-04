/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRepository } from '../../repositories/authRepository/authRepository';
import { LoginCredentials } from '@/src/credentials/authCred/loginCred';
import { SignupCredentials } from '@/src/credentials/authCred/signUpCreds';
import { userManagementRepository } from '@/src/repositories/userManagementRepository/userManagementRepo';

export const useAuth = () => {
  
  const login = async (credentials: LoginCredentials) => {
    try {
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

   const forgotPassword = async (sapid: string, newPassword: string) => {
    try {
      await authRepository.forgotPassword(sapid, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (error: any) {
      return { success: false, error: error.message || "Password reset failed" };
    }
  };

  const updateUserStatus = async (sapid: string, currentStatus: string) => {
    try {

      const result = await userManagementRepository.updateUserStatus({ sapid, currentStatus });
      
      if (result.success) {
        return { 
          success: true, 
          message: result.message || "Status updated successfully",
          data: result.data 
        };
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "An error occurred while updating status" 
      };
    }
  };

  return {
    login,
    signup,
    logout,
    forgotPassword,
    getCurrentUser,
    checkAuth,
    updateUserStatus
  };
};