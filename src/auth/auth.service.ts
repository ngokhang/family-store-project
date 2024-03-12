import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { comparePassword } from 'src/helpers';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByAccount(username);

    if (user && comparePassword(password, user.password)) {
      return user;
    }

    return null;
  }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
    });
  }

  async login(user: IUser, res: Response) {
    const { id, firstName, lastName, account, phoneNumber, address } = user;
    const payload = {
      id,
      firstName,
      lastName,
      account,
      phoneNumber,
      address,
    };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge:
        (ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) * 10) /
        1000,
    });

    try {
      await this.userService.updateRefreshToken(id, refresh_token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return {
      id,
      firstName,
      lastName,
      account,
      phoneNumber,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  register(createUserDTO: CreateUserDto) {
    return this.userService.create(createUserDTO);
  }

  async logout(user: IUser, res: Response) {
    res.clearCookie('refresh_token');

    try {
      await this.userService.updateRefreshToken(user.id, null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
