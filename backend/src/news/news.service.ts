import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsPost } from '../entities/news-post.entity';

interface UpsertNewsPayload {
  titleKa: string;
  titleEn: string;
  excerptKa: string;
  excerptEn: string;
  contentKa: string;
  contentEn: string;
  category: string;
  heroImage?: string;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsPost)
    private readonly newsRepository: Repository<NewsPost>,
  ) {}

  async listPublic(category?: string, year?: number) {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .where('news.published = :published', { published: true });

    if (category) {
      query.andWhere('news.category = :category', { category });
    }

    if (year) {
      query.andWhere('EXTRACT(YEAR FROM news.publishedAt) = :year', { year });
    }

    const posts = await query.orderBy('news.publishedAt', 'DESC').getMany();
    return posts.map((post) => this.toDto(post));
  }

  async listAll() {
    const posts = await this.newsRepository.find({
      order: { updatedAt: 'DESC' },
    });
    return posts.map((post) => this.toDto(post));
  }

  async getPublicBySlug(slug: string) {
    const post = await this.newsRepository.findOne({
      where: { slug, published: true },
    });

    if (!post) {
      throw new NotFoundException('News post not found.');
    }

    return this.toDto(post);
  }

  async create(payload: UpsertNewsPayload) {
    const slug = await this.ensureUniqueSlug(this.slugify(payload.titleEn));

    const post = this.newsRepository.create({
      ...payload,
      slug,
      published: false,
    });

    return this.toDto(await this.newsRepository.save(post));
  }

  async update(id: number, payload: Partial<UpsertNewsPayload>) {
    const post = await this.newsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('News post not found.');
    }

    const previousTitleEn = post.titleEn;
    Object.assign(post, payload);

    if (payload.titleEn && payload.titleEn !== previousTitleEn) {
      post.slug = await this.ensureUniqueSlug(
        this.slugify(payload.titleEn),
        id,
      );
    }

    return this.toDto(await this.newsRepository.save(post));
  }

  async setPublished(id: number, published: boolean) {
    const post = await this.newsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('News post not found.');
    }

    post.published = published;
    post.publishedAt = published ? new Date() : null;

    return this.toDto(await this.newsRepository.save(post));
  }

  private async ensureUniqueSlug(baseSlug: string, currentId?: number) {
    let candidate = baseSlug || `news-${Date.now()}`;
    let index = 1;

    while (true) {
      const existing = await this.newsRepository.findOne({
        where: { slug: candidate },
      });
      if (!existing || existing.id === currentId) {
        return candidate;
      }
      candidate = `${baseSlug}-${index}`;
      index += 1;
    }
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private toDto(post: NewsPost) {
    return {
      id: post.id,
      slug: post.slug,
      titleKa: post.titleKa,
      titleEn: post.titleEn,
      excerptKa: post.excerptKa,
      excerptEn: post.excerptEn,
      contentKa: post.contentKa,
      contentEn: post.contentEn,
      category: post.category,
      heroImage: post.heroImage,
      published: post.published,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    };
  }
}
