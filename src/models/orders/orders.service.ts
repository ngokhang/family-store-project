import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { metadataResponseFetch } from 'src/common/constants';
import { checkExisted, paginationList } from 'src/common/utils';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { IQueriesParams } from '../users/interface/queriesParams.interface';
import { IUser } from '../users/interface/user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { NotExistedException } from 'src/common/exceptions/existed.exception';
import { ProductToOrder } from '../productToOrder/productToOrder.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductToOrder)
    private productToOrderRepository: Repository<ProductToOrder>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { productOrder } = createOrderDto;

    return await Promise.all(
      productOrder.map(async (order) => {
        const productExisted = await this.productRepository.findOne({
          where: { id: order.productId },
        });
        const price = order.price;
        const quantityOrder = order.quantity;

        if (!productExisted) {
          throw new NotExistedException('Sản phẩm');
        }
        if (quantityOrder > productExisted.quantity)
          throw new BadRequestException('Số lượng sản phẩm không đủ');
        if (price < productExisted.inputPrice)
          throw new BadRequestException('Giá bán không hợp lệ');

        await this.productRepository.update(productExisted.id, {
          quantity: productExisted.quantity - quantityOrder,
        });

        const newOrder = await this.orderRepository.save({
          userId: user.id,
          quantity: quantityOrder,
          totalPrice: quantityOrder * price,
        });

        await this.productToOrderRepository.save({
          product: productExisted,
          order: newOrder,
          quantity: quantityOrder,
        });

        return newOrder;
      }),
    )
      .then((res) => res)
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  async findAll(queries: IQueriesParams) {
    const { page, pageSize } = queries;
    const orderList = await paginationList(
      this.orderRepository,
      'orders',
      queries,
    )
      .leftJoinAndSelect('orders.productToOrder', 'productToOrder')
      .leftJoinAndSelect('productToOrder.product', 'product')
      .getManyAndCount();
    const totalPages = Math.ceil(orderList[1] / pageSize);

    return {
      metadata: metadataResponseFetch(page, pageSize, orderList[1], totalPages),
      result: orderList[0],
    };
  }

  async findOneByUserId(userId: string) {
    const userExisted = await checkExisted(this.userRepository, {
      key: 'id',
      value: userId,
    });
    if (!userExisted) {
      throw new NotExistedException('Người dùng');
    }

    return await this.orderRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
      relations: {
        productToOrder: {
          product: true,
        },
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderExisted = await checkExisted(this.orderRepository, {
      key: 'id',
      value: id,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    if (!orderExisted) {
      throw new NotExistedException('Đơn hàng');
    }
    await queryRunner.startTransaction();

    try {
      await this.orderRepository.update(id, {
        quantity: updateOrderDto.quantity,
        totalPrice: updateOrderDto.quantity * updateOrderDto.price,
      });
      await this.productToOrderRepository.update(
        { orderId: In([id]), productId: updateOrderDto.productId },
        {
          quantity: updateOrderDto.quantity,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return true;
  }

  async remove(id: string) {
    const orderExisted = await checkExisted(this.orderRepository, {
      key: 'id',
      value: id,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    if (!orderExisted) {
      throw new NotExistedException('Đơn hàng');
    }

    await queryRunner.startTransaction();
    try {
      await this.productToOrderRepository.softDelete({ orderId: id });
      await this.orderRepository.softDelete({ id: orderExisted.id });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return true;
  }
}
