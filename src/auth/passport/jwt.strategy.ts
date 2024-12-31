import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // decode giải mã token
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // giải mã token ở header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESSS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { _id, email, name, role } = payload;
    return {
      _id,
      email,
      name,
      role,
    };
  }
}
