import { RoleCode } from '../enums/role-code.enum';

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: RoleCode;
}
