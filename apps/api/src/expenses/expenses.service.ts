import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async createExpense(businessId: string, userId: string, data: any) {
    return this.prisma.expense.create({
      data: {
        ...data,
        business_id: businessId,
        recorded_by_user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getExpenses(businessId: string) {
    return this.prisma.expense.findMany({
      where: { business_id: businessId },
    });
  }

  async getExpense(businessId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, business_id: businessId },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }
}
