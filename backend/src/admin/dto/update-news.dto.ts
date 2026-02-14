import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  titleKa?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  excerptKa?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  contentKa?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  heroImage?: string;

  @IsOptional()
  @IsBoolean()
  publishImmediately?: boolean;
}
