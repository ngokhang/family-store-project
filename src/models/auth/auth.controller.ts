import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/PublicRoute.decorator';
import { LocalAuthGuard } from './passport/local-strategy/local-auth.guard';
import { ResponseMessage } from 'src/common/interceptors/response-message.interceptor';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDecorator } from 'src/common/decorators/User.decorator';
import { IUser } from '../users/interface/user.interface';
import { ChangePasswordDto } from '../users/dto/update-user.dto';

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

  @Put('change-password')
  @ResponseMessage('Đổi mật khẩu')
  handleChangePassword(
    @UserDecorator() user: IUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePasswod(user, changePasswordDto);
  }
}
