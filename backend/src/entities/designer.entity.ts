import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('designers')
export class Designer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ name: 'bio_ka', type: 'text' })
  bioKa: string;

  @Column({ name: 'bio_en', type: 'text' })
  bioEn: string;

  @Column({ name: 'photo_path', nullable: true })
  photoPath?: string;

  @ManyToMany(() => Product, (product) => product.designers)
  @JoinTable({
    name: 'product_designers',
    joinColumn: { name: 'designer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
