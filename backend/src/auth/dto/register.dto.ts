import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { NON_ADMIN_ROLES, RoleCode } from '../../common/enums/role-code.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsIn(NON_ADMIN_ROLES)
  requestedRole: Exclude<RoleCode, RoleCode.ADMIN>;
}
