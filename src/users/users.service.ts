import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneByAccount(account: string) {
    return await this.userRepository.findOneByAccount(account);
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.createNewUser(createUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
