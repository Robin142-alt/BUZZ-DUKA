import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDebt(businessId: string, userId: string, data: any) {
    return this.prisma.debt.create({
      data: {
        ...data,
        business_id: businessId,
        created_by_user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getDebts(businessId: string) {
    return this.prisma.debt.findMany({
      where: { business_id: businessId },
    });
  }

  async updateDebt(businessId: string, id: string, data: any) {
    const debt = await this.prisma.debt.findFirst({
      where: { id, business_id: businessId },
    });
    if (!debt) throw new NotFoundException('Debt not found');

    return this.prisma.debt.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }
}
