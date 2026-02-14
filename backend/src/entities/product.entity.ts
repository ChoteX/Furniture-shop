import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Designer } from './designer.entity';
import { DownloadableFile } from './downloadable-file.entity';
import { Visibility } from '../common/enums/visibility.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'name_ka' })
  nameKa: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'description_ka', type: 'text' })
  descriptionKa: string;

  @Column({ name: 'description_en', type: 'text' })
  descriptionEn: string;

  @Column({ nullable: true })
  collection?: string;

  @Column({ name: 'hero_image', nullable: true })
  heroImage?: string;

  @Column({ type: 'varchar', default: Visibility.PUBLIC })
  visibility: Visibility;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Designer, (designer) => designer.products)
  designers: Designer[];

  @ManyToMany(() => DownloadableFile, (file) => file.products, { eager: true })
  @JoinTable({
    name: 'product_files',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'file_id', referencedColumnName: 'id' },
  })
  files: DownloadableFile[];
}
