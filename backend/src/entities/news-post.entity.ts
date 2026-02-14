import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news_posts')
export class NewsPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'title_ka' })
  titleKa: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column({ name: 'excerpt_ka', type: 'text' })
  excerptKa: string;

  @Column({ name: 'excerpt_en', type: 'text' })
  excerptEn: string;

  @Column({ name: 'content_ka', type: 'text' })
  contentKa: string;

  @Column({ name: 'content_en', type: 'text' })
  contentEn: string;

  @Column({ name: 'hero_image', nullable: true })
  heroImage?: string;

  @Column()
  category: string;

  @Column({ default: true })
  published: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
