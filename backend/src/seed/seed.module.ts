import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Designer } from '../entities/designer.entity';
import { DownloadableFile } from '../entities/downloadable-file.entity';
import { Product } from '../entities/product.entity';
import { Catalogue } from '../entities/catalogue.entity';
import { NewsPost } from '../entities/news-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      User,
      Category,
      Designer,
      DownloadableFile,
      Product,
      Catalogue,
      NewsPost,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
