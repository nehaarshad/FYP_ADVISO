 type UserRole = 'student' | 'advisor' | 'admin' | 'coordinator';

export interface User {
  id: number;
  sapid: number;
  password: string | null;
  role: UserRole;
  isActive: boolean | null;
  sessionToken: string | null;
  deactivateAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}