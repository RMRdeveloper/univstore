import { IsOptional, IsNumber, IsString, IsBoolean, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortField, SortOrder } from '../../../common/enums/index.js';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  inStock?: boolean;

  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;
}
