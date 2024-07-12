import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_TOKEN } from 'src/environments';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AtStrategiest extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_TOKEN,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}