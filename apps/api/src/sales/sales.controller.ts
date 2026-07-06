import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.salesService.createSale(user.businessId, user.userId, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.salesService.getSales(user.businessId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesService.getSale(user.businessId, id);
  }
}
