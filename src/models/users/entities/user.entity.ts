import { Order } from 'src/models/orders/entities/order.entity';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['id', 'account'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true, default: null, select: false })
  refresh_token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;
  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];
}
