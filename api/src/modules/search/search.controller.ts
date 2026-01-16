import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { SearchQueryDto } from './dto/search-query.dto.js';
import type { PaginatedResult } from '../products/products.repository.js';
import type { ProductDocument } from '../products/schemas/product.schema.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  async search(
    @Query() queryDto: SearchQueryDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    return this.searchService.search(queryDto);
  }
}
