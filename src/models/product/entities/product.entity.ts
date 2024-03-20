import { Category } from 'src/models/categories/entities/category.entity';
import { Order } from 'src/models/orders/entities/order.entity';
import { ProductToOrder } from 'src/models/productToOrder/productToOrder.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  inputPrice: number;

  @Column({ nullable: true, default: null })
  description: string;

  @Column({ unsigned: true, default: 0 })
  quantity: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => ProductToOrder, (productToOrder) => productToOrder.product)
  productToOrder: ProductToOrder[];
}
