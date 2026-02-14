import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleCode } from '../common/enums/role-code.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'bowen-secret'),
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    fullName: string;
    role: RoleCode;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
    };
  }
}
