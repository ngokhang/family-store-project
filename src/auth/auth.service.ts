import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { comparePassword } from 'src/helpers';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByAccount(username);

    if (user && comparePassword(password, user.password)) {
      return user;
    }

    return null;
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  async login(user: IUser, res: Response) {
    const { id, firstName, lastName, account, phoneNumber } = user;
    const payload = {
      id,
      account,
      phoneNumber,
    };

    try {
      await this.userService.updateRefreshToken(
        id,
        this.generateToken(payload),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return {
      id,
      firstName,
      lastName,
      account,
      phoneNumber,
      access_token: this.generateToken(payload),
      refresh_token: this.generateToken(payload),
    };
  }

  register(createUserDTO: CreateUserDto) {
    return this.userService.create(createUserDTO);
  }
}
