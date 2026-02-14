import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DownloadableFile } from './downloadable-file.entity';
import { Visibility } from '../common/enums/visibility.enum';

@Entity('catalogues')
export class Catalogue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title_ka' })
  titleKa: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column()
  type: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'cover_image', nullable: true })
  coverImage?: string;

  @Column({ type: 'varchar', default: Visibility.PUBLIC })
  visibility: Visibility;

  @ManyToOne(() => DownloadableFile, (file) => file.catalogues, { eager: true })
  @JoinColumn({ name: 'pdf_file_id' })
  pdfFile: DownloadableFile;
}
