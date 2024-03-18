import { Product } from 'src/models/product/entities/product.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column()
  productName: string;

  @Column()
  productQuantity: number;

  @Column()
  inputPrice: number;

  @Column()
  price: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    update: true,
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
  @ManyToMany(() => Product)
  @JoinTable()
  product: Product;
}
