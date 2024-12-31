import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/customize';

@Controller('home')
export class AppController {
  constructor(private readonly configService: AppService) {}

  @Get()
  @Public()
  // @Render('home')
  getHello() {
    // console.log('check port: ', this.configService.get<string>('PORT'));
    return this.configService.getHello();
  }
}
