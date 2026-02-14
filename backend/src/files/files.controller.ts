import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/interfaces/auth-user.interface';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('catalogues')
  catalogues(@CurrentUser() user: AuthUser) {
    return this.filesService.listAccessibleCatalogues(user.role);
  }

  @Get('downloads')
  downloads(@CurrentUser() user: AuthUser) {
    return this.filesService.listAccessibleDownloads(user.role);
  }

  @Get('downloads/:id/authorize')
  authorize(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.filesService.authorizeDownload(id, user.role);
  }
}
