import { UserEntity } from 'src/models/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id', 'name'])
export class RoleEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
