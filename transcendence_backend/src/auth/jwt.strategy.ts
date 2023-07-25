import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
        console.log('request dans ='+request.cookies);
        return request?.cookies?.jwt;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('payload dans jwt.strategy'+payload);
    const user = await this.authService.validateUser(payload.id);
    console.log('user dans user = '+user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
