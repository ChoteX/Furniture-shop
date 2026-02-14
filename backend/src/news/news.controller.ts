import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  list(@Query('category') category?: string, @Query('year') year?: string) {
    const parsedYear = year ? Number(year) : undefined;
    return this.newsService.listPublic(category, parsedYear);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.newsService.getPublicBySlug(slug);
  }
}
