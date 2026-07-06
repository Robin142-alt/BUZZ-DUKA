import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.stockMovementsService.createMovement(user.businessId, user.userId, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.stockMovementsService.getMovements(user.businessId);
  }
}
