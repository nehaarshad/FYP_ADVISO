 type UserRole = 'student' | 'advisor' | 'admin' | 'coordinator';

export interface User {
  id: number;
  sapid: number;
  password: string;
  role: UserRole;
  isActive: boolean;
  sessionToken: string | null;
  deactivateAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}