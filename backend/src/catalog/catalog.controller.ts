import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('navigation')
  navigation() {
    return this.catalogService.getNavigation();
  }

  @Get('categories')
  categories(@Query('domain') domain?: 'indoor' | 'outdoor') {
    return this.catalogService.listCategories(domain);
  }

  @Get('products')
  products(
    @Query('search') search?: string,
    @Query('category') categorySlug?: string,
    @Query('designer') designerSlug?: string,
    @Query('domain') domain?: 'indoor' | 'outdoor',
  ) {
    return this.catalogService.listProducts({
      search,
      categorySlug,
      designerSlug,
      domain,
    });
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  @Get('designers-filter')
  designersFilter() {
    return this.catalogService.listDesignersForFilters();
  }

  @Get('catalogues')
  catalogues() {
    return this.catalogService.listPublicCatalogues();
  }

  @Get('search')
  search(@Query('q') keyword: string) {
    return this.catalogService.searchSuggestions(keyword);
  }
}
