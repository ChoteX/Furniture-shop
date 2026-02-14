import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Visibility } from '../common/enums/visibility.enum';
import { Product } from './product.entity';
import { Catalogue } from './catalogue.entity';

@Entity('downloadable_files')
export class DownloadableFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_ka' })
  titleKa: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'local_path' })
  localPath: string;

  @Column({ name: 's3_key', nullable: true })
  s3Key?: string;

  @Column({ type: 'varchar', default: Visibility.PUBLIC })
  visibility: Visibility;

  @ManyToMany(() => Product, (product) => product.files)
  products: Product[];

  @OneToMany(() => Catalogue, (catalogue) => catalogue.pdfFile)
  catalogues: Catalogue[];
}
