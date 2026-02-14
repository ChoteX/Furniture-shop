import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { DesignersModule } from './designers/designers.module';
import { NewsModule } from './news/news.module';
import { FilesModule } from './files/files.module';
import { AdminModule } from './admin/admin.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USER', 'bowen'),
        password: configService.get<string>('DB_PASSWORD', 'bowen'),
        database: configService.get<string>('DB_NAME', 'bowen'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    CatalogModule,
    DesignersModule,
    NewsModule,
    FilesModule,
    AdminModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
