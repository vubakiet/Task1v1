import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
  @Column()
  price: string;
  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
