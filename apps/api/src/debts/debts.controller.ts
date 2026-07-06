import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.debtsService.createDebt(user.businessId, user.userId, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.debtsService.getDebts(user.businessId);
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
    return this.debtsService.updateDebt(user.businessId, id, data);
  }
}
