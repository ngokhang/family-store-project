import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/interceptors/response-message.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Danh sách người dùng')
  findAll(@Query() queries: any) {
    return this.usersService.findAll(queries);
  }

  @Get(':id')
  @ResponseMessage('Thông tin người dùng')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin người dùng')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
