import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getJwtSecret } from './jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    const roles = Array.isArray(payload.roles) ? payload.roles : [];
    const isDriver = roles.includes('driver');
    return {
      userId: payload.sub,
      email: payload.email,
      roles,
      driverId: isDriver ? payload.sub : '',
      riderId: roles.includes('rider') ? payload.sub : undefined,
      fleetId: roles.some((role: string) => role.startsWith('fleet_')) ? payload.sub : undefined,
      adminId: roles.includes('admin') || roles.includes('super_admin') ? payload.sub : undefined,
    };
  }
}
