import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Designer } from '../entities/designer.entity';
import { Catalogue } from '../entities/catalogue.entity';
import { Visibility } from '../common/enums/visibility.enum';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Designer)
    private readonly designerRepository: Repository<Designer>,
    @InjectRepository(Catalogue)
    private readonly catalogueRepository: Repository<Catalogue>,
  ) {}

  async getNavigation() {
    const categories = await this.categoryRepository.find({
      relations: ['parent'],
      order: { id: 'ASC' },
    });

    const domains = ['indoor', 'outdoor'].map((domain) => ({
      domain,
      categories: categories
        .filter((category) => category.domain === domain && category.parent)
        .map((category) => ({
          id: category.id,
          slug: category.slug,
          nameKa: category.nameKa,
          nameEn: category.nameEn,
        })),
    }));

    return {
      primarySections: [
        'products',
        'materials',
        'collections',
        'about',
        'news_media',
        'sales_network',
      ],
      domains,
    };
  }

  async listCategories(domain?: 'indoor' | 'outdoor') {
    const categories = await this.categoryRepository.find({
      relations: ['parent'],
    });
    return categories
      .filter((category) => {
        if (!category.parent) {
          return false;
        }
        if (!domain) {
          return true;
        }
        return category.domain === domain;
      })
      .map((category) => ({
        id: category.id,
        slug: category.slug,
        domain: category.domain,
        nameKa: category.nameKa,
        nameEn: category.nameEn,
      }));
  }

  async listProducts(params: {
    search?: string;
    categorySlug?: string;
    designerSlug?: string;
    domain?: 'indoor' | 'outdoor';
  }) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.designers', 'designer')
      .leftJoinAndSelect('product.files', 'file')
      .where('product.visibility = :visibility', {
        visibility: Visibility.PUBLIC,
      });

    if (params.search) {
      query.andWhere(
        '(product.nameKa ILIKE :search OR product.nameEn ILIKE :search OR product.descriptionKa ILIKE :search OR product.descriptionEn ILIKE :search)',
        {
          search: `%${params.search}%`,
        },
      );
    }

    if (params.categorySlug) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: params.categorySlug,
      });
    }

    if (params.designerSlug) {
      query.andWhere('designer.slug = :designerSlug', {
        designerSlug: params.designerSlug,
      });
    }

    if (params.domain) {
      query.andWhere('category.domain = :domain', { domain: params.domain });
    }

    const products = await query.orderBy('product.id', 'DESC').getMany();

    return products.map((product) => this.toProductDto(product));
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['categories', 'designers', 'files'],
    });

    if (!product || product.visibility !== Visibility.PUBLIC) {
      throw new NotFoundException('Product not found.');
    }

    return this.toProductDto(product);
  }

  async listDesignersForFilters() {
    const designers = await this.designerRepository.find({
      order: { name: 'ASC' },
    });

    return designers.map((designer) => ({
      id: designer.id,
      slug: designer.slug,
      name: designer.name,
    }));
  }

  async listPublicCatalogues() {
    const catalogues = await this.catalogueRepository.find({
      relations: ['pdfFile'],
      order: { year: 'DESC' },
    });

    return catalogues
      .filter((catalogue) => catalogue.visibility === Visibility.PUBLIC)
      .map((catalogue) => ({
        id: catalogue.id,
        titleKa: catalogue.titleKa,
        titleEn: catalogue.titleEn,
        type: catalogue.type,
        year: catalogue.year,
        coverImage: catalogue.coverImage,
        visibility: catalogue.visibility,
        pdf: {
          id: catalogue.pdfFile.id,
          titleKa: catalogue.pdfFile.titleKa,
          titleEn: catalogue.pdfFile.titleEn,
          localPath: catalogue.pdfFile.localPath,
        },
      }));
  }

  async searchSuggestions(keyword: string) {
    const safeKeyword = keyword?.trim();
    if (!safeKeyword) {
      return { categories: [], products: [] };
    }

    const [categories, products] = await Promise.all([
      this.categoryRepository
        .createQueryBuilder('category')
        .where(
          'category.nameKa ILIKE :keyword OR category.nameEn ILIKE :keyword',
          {
            keyword: `%${safeKeyword}%`,
          },
        )
        .limit(8)
        .getMany(),
      this.productRepository
        .createQueryBuilder('product')
        .where('product.visibility = :visibility', {
          visibility: Visibility.PUBLIC,
        })
        .andWhere(
          'product.nameKa ILIKE :keyword OR product.nameEn ILIKE :keyword',
          {
            keyword: `%${safeKeyword}%`,
          },
        )
        .limit(8)
        .getMany(),
    ]);

    return {
      categories: categories.map((category) => ({
        slug: category.slug,
        nameKa: category.nameKa,
        nameEn: category.nameEn,
      })),
      products: products.map((product) => ({
        slug: product.slug,
        nameKa: product.nameKa,
        nameEn: product.nameEn,
      })),
    };
  }

  private toProductDto(product: Product) {
    return {
      id: product.id,
      slug: product.slug,
      nameKa: product.nameKa,
      nameEn: product.nameEn,
      descriptionKa: product.descriptionKa,
      descriptionEn: product.descriptionEn,
      collection: product.collection,
      heroImage: product.heroImage,
      visibility: product.visibility,
      categories: product.categories?.map((category) => ({
        slug: category.slug,
        domain: category.domain,
        nameKa: category.nameKa,
        nameEn: category.nameEn,
      })),
      designers: product.designers?.map((designer) => ({
        slug: designer.slug,
        name: designer.name,
      })),
      files: product.files?.map((file) => ({
        id: file.id,
        titleKa: file.titleKa,
        titleEn: file.titleEn,
        fileType: file.fileType,
        localPath: file.localPath,
        visibility: file.visibility,
      })),
    };
  }
}
