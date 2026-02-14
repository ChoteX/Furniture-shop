import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Catalogue } from '../entities/catalogue.entity';
import { DownloadableFile } from '../entities/downloadable-file.entity';
import { RoleCode } from '../common/enums/role-code.enum';
import { Visibility } from '../common/enums/visibility.enum';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Catalogue)
    private readonly catalogueRepository: Repository<Catalogue>,
    @InjectRepository(DownloadableFile)
    private readonly fileRepository: Repository<DownloadableFile>,
  ) {}

  async listAccessibleCatalogues(role: RoleCode) {
    const catalogues = await this.catalogueRepository.find({
      relations: ['pdfFile'],
      order: { year: 'DESC' },
    });

    return catalogues
      .filter((catalogue) => this.isAllowed(catalogue.visibility, role))
      .map((catalogue) => ({
        id: catalogue.id,
        titleKa: catalogue.titleKa,
        titleEn: catalogue.titleEn,
        type: catalogue.type,
        year: catalogue.year,
        visibility: catalogue.visibility,
        pdf: {
          id: catalogue.pdfFile.id,
          titleKa: catalogue.pdfFile.titleKa,
          titleEn: catalogue.pdfFile.titleEn,
          localPath: catalogue.pdfFile.localPath,
          visibility: catalogue.pdfFile.visibility,
        },
      }));
  }

  async listAccessibleDownloads(role: RoleCode) {
    const files = await this.fileRepository.find({ order: { id: 'ASC' } });
    return files
      .filter((file) => this.isAllowed(file.visibility, role, file.fileType))
      .map((file) => ({
        id: file.id,
        titleKa: file.titleKa,
        titleEn: file.titleEn,
        fileType: file.fileType,
        localPath: file.localPath,
        visibility: file.visibility,
      }));
  }

  async authorizeDownload(fileId: number, role: RoleCode) {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    if (!this.isAllowed(file.visibility, role, file.fileType)) {
      throw new ForbiddenException('You do not have access to this file.');
    }

    return {
      fileId: file.id,
      downloadUrl: file.localPath,
      s3Key: file.s3Key,
      note: 'In production this endpoint should return a short-lived signed S3 URL.',
    };
  }

  private isAllowed(visibility: Visibility, role: RoleCode, fileType?: string) {
    if (role === RoleCode.ADMIN || role === RoleCode.AUTHORIZED_DEALER) {
      return true;
    }

    // Press profile is limited to photo archives plus public resources.
    if (role === RoleCode.PRESS) {
      if (visibility === Visibility.PUBLIC) {
        return true;
      }
      return (
        visibility === Visibility.PRESS_ONLY && fileType?.includes('photo')
      );
    }

    switch (visibility) {
      case Visibility.PUBLIC:
        return true;
      case Visibility.AUTHENTICATED:
        return role === RoleCode.ARCHITECT;
      case Visibility.DEALER_ARCHITECT:
        return role === RoleCode.ARCHITECT;
      case Visibility.DEALER_ONLY:
        return false;
      case Visibility.PRESS_ONLY:
        return false;
      default:
        return false;
    }
  }
}
