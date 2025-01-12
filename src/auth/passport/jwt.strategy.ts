import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // decode giải mã token
  constructor(
    private configService: ConfigService,
    private roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // giải mã token ở header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESSS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { _id, email, name, role } = payload;

    // cần gán thêm permissions vào req.user
    const userRole = role as unknown as { _id: string; name: string };
    const temp = (await this.roleService.findOne(userRole._id)).toObject();

    return {
      _id,
      email,
      name,
      role,
      permissions: temp?.permissions ?? [],
    };
  }
}
