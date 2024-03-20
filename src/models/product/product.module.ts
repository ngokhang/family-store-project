import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductToOrder } from '../productToOrder/productToOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductToOrder])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
