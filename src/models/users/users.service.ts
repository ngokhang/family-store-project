import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginationList } from 'src/common/utils';
import { USER_ROLE, metadataResponseFetch } from 'src/common/constants';
import { hashPassword } from 'src/common/helpers';

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
    const userList = await paginationList(
      this.userRepository,
      'user_entity',
      queries,
    )
      .leftJoinAndSelect('user_entity.role', 'role')
      .orderBy('user_entity.createdAt', 'ASC')
      .getManyAndCount();
    const totalPages = Math.ceil(userList[1] / pageSize);

    return {
      metadata: metadataResponseFetch(page, pageSize, userList[1], totalPages),
      result: userList[0],
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
