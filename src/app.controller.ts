import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Render('home')
  getHello() {
    console.log('check port: ', this.configService.get<string>('PORT'));

    // return this.appService.getHello();
  }
}
