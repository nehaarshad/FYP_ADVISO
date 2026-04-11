import { AuthHeaders } from './authHeader';
import { localStorageService } from '../localStorage/authLocalStorageService';


export class SessionManager {
  private static instance: SessionManager;
  localStorageService = localStorageService;
  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Create session after successful login/signup
  createSession<T>(user: T, token: string): void {
    this.localStorageService.saveToken(token);
  }

  destroySession(): void {
    this.localStorageService.clearAuthStorage();
  }

  // Check if session exists
  hasActiveSession(): boolean {
    return localStorageService.isAuthenticated();
  }
  
  getSessionToken(): string | null {
    return localStorageService.getToken();
  }

 getCurrentUser<T>(): T | null {
    return localStorageService.getUser<T>();
  }
  
  getAuthHeaders(): AuthHeaders {
    const token = this.getSessionToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

}

export const sessionManager = SessionManager.getInstance();