import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.productsService.createProduct(user.businessId, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.productsService.getProducts(user.businessId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.getProduct(user.businessId, id);
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
    return this.productsService.updateProduct(user.businessId, id, data);
  }
}
