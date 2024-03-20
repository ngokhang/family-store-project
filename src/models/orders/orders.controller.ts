import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseMessage } from 'src/common/interceptors/response-message.interceptor';
import { UserDecorator } from 'src/common/decorators/User.decorator';
import { IUser } from '../users/interface/user.interface';
import { IQueriesParams } from '../users/interface/queriesParams.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Tạo mới hoá đơn')
  create(@Body() createOrderDto: CreateOrderDto, @UserDecorator() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ResponseMessage('Lấy tất cả hoá đơn')
  findAll(@Query() queries: IQueriesParams) {
    return this.ordersService.findAll(queries);
  }

  @Get(':userId')
  @ResponseMessage('Lấy hoá đơn của người dùng')
  findOneByUserId(@Param('userId') userId: string) {
    return this.ordersService.findOneByUserId(userId);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật yêu cầu đặt hàng')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ResponseMessage('Xoá yêu cầu đặt hàng')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
