import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/helpers';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneBy({ account });
    } catch (error) {
      throw new BadRequestException(`Tài khoản ${account} không tồn tại`);
    }
  }

  async createNewUser(createUserDTO: CreateUserDto) {
    const isExisted = await this.findOneByAccount(createUserDTO.account);

    if (isExisted) {
      throw new BadRequestException(
        `Tài khoản ${createUserDTO.account} đã tồn tại`,
      );
    }

    try {
      createUserDTO.password = hashPassword(createUserDTO.password);
      return await this.userRepository
        .save(createUserDTO)
        .then(async (user) => user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
