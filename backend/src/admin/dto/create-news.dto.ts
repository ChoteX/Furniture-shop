import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  titleKa: string;

  @IsString()
  titleEn: string;

  @IsString()
  excerptKa: string;

  @IsString()
  excerptEn: string;

  @IsString()
  contentKa: string;

  @IsString()
  contentEn: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  heroImage?: string;

  @IsOptional()
  @IsBoolean()
  publishImmediately?: boolean;
}
