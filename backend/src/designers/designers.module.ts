import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designer } from '../entities/designer.entity';
import { DesignersController } from './designers.controller';
import { DesignersService } from './designers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Designer])],
  controllers: [DesignersController],
  providers: [DesignersService],
})
export class DesignersModule {}
