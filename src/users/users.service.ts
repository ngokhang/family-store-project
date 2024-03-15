import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_ROLE } from 'src/constants';
import { hashPassword } from 'src/helpers';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async checkExisted(id: string) {
    const isExisted = await this.userRepository.find({
      where: { id },
    });

    return isExisted || false;
  }

  async findAll(queries: any) {
    const { page, pageSize } = queries;
    const totalItems = await this.userRepository.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    const userList = await this.userRepository
      .createQueryBuilder('user_entity')
      .select([
        'user_entity.id',
        'user_entity.account',
        'user_entity.firstName',
        'user_entity.lastName',
        'user_entity.phoneNumber',
        'user_entity.address',
      ])
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('user_entity.lastName', 'ASC')
      .leftJoinAndSelect('user_entity.role', 'role')
      .getMany();
    const metadata = {
      page: Number(page),
      pageSize: Number(pageSize),
      total: totalItems,
      pageCount: totalPages,
    };

    return {
      metadata,
      result: userList,
    };
  }

  async findOneById(id: string) {
    const isExisted = await this.checkExisted(id);

    return isExisted
      ? isExisted
      : new BadRequestException('Người dùng không tồn tại');
  }

  async findOneByAccount(account: string) {
    return await this.userRepository
      .createQueryBuilder('user_entity')
      .where('user_entity.account = :account', { account })
      .getOne();
  }

  async create(createUserDto: CreateUserDto) {
    const isExisted = await this.findOneByAccount(createUserDto.account);

    if (isExisted) {
      throw new BadRequestException(
        `Tài khoản ${createUserDto.account} đã tồn tại`,
      );
    }

    try {
      createUserDto.password = hashPassword(createUserDto.password);
      return await this.userRepository
        .save({ ...createUserDto, role: { id: USER_ROLE } })
        .then(async (user) => user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isExisted = await this.checkExisted(id);

    if (!isExisted) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    return this.userRepository.update(id, { refresh_token: refresh_token });
  }

  async updatePassword(id: string, password: string) {
    return this.userRepository.update(id, { password });
  }

  async remove(id: string) {
    const isExisted = await this.checkExisted(id);
    if (!isExisted) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    return this.userRepository.softDelete(id);
  }
}
