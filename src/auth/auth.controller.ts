import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from 'src/interceptors/response-message.interceptor';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-strategy/local-auth.guard';
import { PublicRoute } from 'src/decorators/PublicRoute.decorator';
import { UserDecorator } from 'src/decorators/User.decorator';
import { IUser } from 'src/users/interface/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  handleLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @PublicRoute()
  @Post('register')
  @ResponseMessage('Tạo tài khoản mới')
  handleRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  @ResponseMessage('Đăng xuất thành công')
  handleLogout(
    @UserDecorator() user: IUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user, res);
  }
}
