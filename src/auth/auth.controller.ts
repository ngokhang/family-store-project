import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from 'src/interceptors/response-message.interceptor';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-strategy/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  handleLogin(@Req() req, @Res() res: Response) {
    return this.authService.login(req.user, res);
  }

  @Post('register')
  @ResponseMessage('Tạo tài khoản mới')
  handleRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
