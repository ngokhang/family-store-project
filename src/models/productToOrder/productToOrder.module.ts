import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductToOrder } from './productToOrder.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductToOrder, Order, Product])],
})
export class ProductToOrderModule {}
