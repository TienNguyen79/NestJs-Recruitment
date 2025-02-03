import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { Public, ResponseMessage } from './decorator/customize';

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

  @Get('happy-new-year-2025')
  @ResponseMessage('Chúc mừng năm mới 2025')
  @Public()
  happyNewYear2025() {
    return 'Chúc mừng năm mới 2025, Chúc tôi và những người thân yêu của tôi một năm mới dồi dào sức khỏe, gặp nhiều may mắn, an khang thịnh vượng. Chúc công việc của tôi luôn thuận lợi và kiếm được nhiều tiền.';
  }
}
