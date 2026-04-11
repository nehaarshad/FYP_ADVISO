import { AuthStorageKeys } from './Storagekeys/authStorageKey';

export class LocalStorageService {
    
  private static instance: LocalStorageService;
  private AuthStorageKeys: AuthStorageKeys = {
    USER_KEY: 'user',
    TOKEN_KEY: 'token',
  };

  private constructor() {}

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  setItem<T>(key: string, value: T): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    console.warn('Attempted to set item in localStorage on the server side. This operation is ignored.');
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser()) {
      const item = localStorage.getItem(key);
      console.log(`Getting item from localStorage with key: ${key}, value: ${item}`);
      return item ? JSON.parse(item) : null;
    }
    console.warn('Attempted to get item from localStorage on the server side. This operation is ignored.');
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
    console.warn('Attempted to remove item from localStorage on the server side. This operation is ignored.');
  }

   // Specific methods for user
  saveUser<T>(user: T): void {
    this.setItem(this.AuthStorageKeys.USER_KEY, user);
  }

  getUser<T>(): T | null {
    return this.getItem<T>(this.AuthStorageKeys.USER_KEY);
  }

  removeUser(): void {
    this.removeItem(this.AuthStorageKeys.USER_KEY);
  }

  clearAuthStorage(): void {
    if (this.isBrowser()) {
        console.log('Clearing auth storage: Removing user and token from localStorage');
      localStorage.removeItem(this.AuthStorageKeys.USER_KEY);
      localStorage.removeItem(this.AuthStorageKeys.TOKEN_KEY);
    }
  }

  // Specific methods for token
  saveToken(token: string): void {
    this.setItem(this.AuthStorageKeys.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.getItem<string>(this.AuthStorageKeys.TOKEN_KEY);
  }

  removeToken(): void {
    this.removeItem(this.AuthStorageKeys.TOKEN_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getItem(this.AuthStorageKeys.USER_KEY);
  }

}

export const localStorageService = LocalStorageService.getInstance();