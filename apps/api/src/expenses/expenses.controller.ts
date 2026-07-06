import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.expensesService.createExpense(user.businessId, user.userId, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.expensesService.getExpenses(user.businessId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expensesService.getExpense(user.businessId, id);
  }
}
