import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(businessId: string, userId: string, data: any) {
    return this.prisma.stockMovement.create({
      data: {
        ...data,
        business_id: businessId,
        created_by_user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getMovements(businessId: string) {
    return this.prisma.stockMovement.findMany({
      where: { business_id: businessId },
    });
  }
}
