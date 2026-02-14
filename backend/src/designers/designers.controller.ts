import { Controller, Get, Param } from '@nestjs/common';
import { DesignersService } from './designers.service';

@Controller('designers')
export class DesignersController {
  constructor(private readonly designersService: DesignersService) {}

  @Get()
  list() {
    return this.designersService.listDesigners();
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.designersService.getDesigner(slug);
  }
}
