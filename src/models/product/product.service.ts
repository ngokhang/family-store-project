import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { checkExisted, paginationList } from 'src/common/utils';
import { ExistedException } from 'src/common/exceptions/existed.exception';
import { IQueriesParams } from '../users/interface/queriesParams.interface';
import { metadataResponseFetch } from 'src/common/constants';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productExisted = await checkExisted(this.productRepository, {
      key: 'productName',
      value: createProductDto.productName,
    });

    if (productExisted) {
      throw new ExistedException('Sản phẩm');
    }

    try {
      const { categories, ...productData } = createProductDto;

      const product = await this.productRepository.save(productData);

      const result = Promise.all(
        categories.map(async (categoryId) => {
          await this.productRepository
            .createQueryBuilder()
            .relation(Product, 'categories')
            .of(product.id)
            .add(categoryId);
        }),
      )
        .then((res) => product)
        .catch((error) => error.message);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(queries: IQueriesParams) {
    const { page, pageSize } = queries;
    const productList = await paginationList(
      this.productRepository,
      'product',
      queries,
    )
      .orderBy('product.price', 'ASC')
      .getManyAndCount();
    const totalPages = Math.ceil(productList[1] / pageSize);

    return {
      metadata: metadataResponseFetch(
        page,
        pageSize,
        productList[1],
        totalPages,
      ),
      result: productList[0],
    };
  }

  async findOne(id: string) {
    const productExisted = await checkExisted(this.productRepository, {
      key: 'id',
      value: id,
    });

    if (!productExisted) {
      throw new ExistedException('Sản phẩm');
    }

    return productExisted;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productExisted = await checkExisted(this.productRepository, {
      key: 'id',
      value: id,
    });

    if (!productExisted) {
      throw new ExistedException('Sản phẩm');
    }

    console.log(updateProductDto);

    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    const productExisted = await checkExisted(this.productRepository, {
      key: 'id',
      value: id,
    });

    if (!productExisted) {
      throw new ExistedException('Sản phẩm');
    }

    return await this.productRepository.softDelete(id);
  }
}
