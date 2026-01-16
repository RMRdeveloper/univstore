import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { UserRole } from '../../../common/enums/index.js';

export interface JwtPayload {
  sub: Types.ObjectId;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret') ?? 'default_secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: { sub: string; email: string; role: UserRole }): JwtPayload {
    return {
      sub: new Types.ObjectId(payload.sub),
      email: payload.email,
      role: payload.role,
    };
  }
}
