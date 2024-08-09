import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //userName / pass là 2 tham số thư viện passport ném về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOnebyUsername(username);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);

      if (isValid === true) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, email, name, role } = user;
    const payload = {
      sub: 'Token Login',
      iss: 'From Server',
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    // update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    //...
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')), //ms là chuyển sang miligiay
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      users: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(registerUser: RegisterUserDto) {
    const user = await this.usersService.findOnebyUsername(registerUser.email);
    if (user) throw new BadRequestException('User already exists');

    return await this.usersService.registerUser(registerUser);
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      // const a = this.jwtService.verify(refreshToken, {
      //   secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      // });

      const user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        const { _id, email, name, role } = user;
        const payload = {
          sub: 'refresh token',
          iss: 'From Server',
          _id,
          name,
          email,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);

        //  xóa cookie trước

        response.clearCookie('refresh_token');

        // update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //...
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          users: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh Token không hợp lệ vui lòng login',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh Token không hợp lệ vui lòng login',
      );
    }
  };

  logOut = async (refreshToken: string, response: Response) => {
    const user = await this.usersService.findUserByToken(refreshToken);
    if (user) {
      response.clearCookie('refresh_token');

      await this.usersService.updateUserToken('', user._id.toString());
      return 'Logged Out';
    } else {
      throw new BadRequestException(
        'Refresh Token không hợp lệ vui lòng login',
      );
    }
  };
}
