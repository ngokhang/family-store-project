import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { comparePassword } from 'src/helpers';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByAccount(username);

    if (user && comparePassword(password, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: IUser, res: Response) {
    const { id, firstName, lastName, account, phoneNumber } = user;

    return res;
  }

  register(createUserDTO: CreateUserDto) {
    return this.userService.create(createUserDTO);
  }
}
