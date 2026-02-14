import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designer } from '../entities/designer.entity';

@Injectable()
export class DesignersService {
  constructor(
    @InjectRepository(Designer)
    private readonly designerRepository: Repository<Designer>,
  ) {}

  async listDesigners() {
    const designers = await this.designerRepository.find({
      relations: ['products'],
      order: { name: 'ASC' },
    });

    return designers.map((designer) => ({
      id: designer.id,
      slug: designer.slug,
      name: designer.name,
      bioKa: designer.bioKa,
      bioEn: designer.bioEn,
      photoPath: designer.photoPath,
      products: designer.products?.map((product) => ({
        slug: product.slug,
        nameKa: product.nameKa,
        nameEn: product.nameEn,
      })),
    }));
  }

  async getDesigner(slug: string) {
    const designer = await this.designerRepository.findOne({
      where: { slug },
      relations: ['products'],
    });

    if (!designer) {
      throw new NotFoundException('Designer not found.');
    }

    return {
      id: designer.id,
      slug: designer.slug,
      name: designer.name,
      bioKa: designer.bioKa,
      bioEn: designer.bioEn,
      photoPath: designer.photoPath,
      products: designer.products?.map((product) => ({
        slug: product.slug,
        nameKa: product.nameKa,
        nameEn: product.nameEn,
      })),
    };
  }
}
