import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale(businessId: string, userId: string, data: any) {
    const saleId = data.id || randomUUID();
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          id: saleId,
          business_id: businessId,
          sold_by_user_id: userId,
          customer_id: data.customer_id,
          total_amount_cents: data.total_amount_cents,
          amount_paid_cents: data.amount_paid_cents,
          balance_due_cents: data.balance_due_cents || 0,
          payment_method: data.payment_method,
          sale_status: data.sale_status || 'completed',
          device_id: data.device_id || 'unknown',
          created_at: new Date(),
          updated_at: new Date(),
          items: {
            create: data.items.map((item: any) => ({
              id: item.id || randomUUID(),
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price_cents: item.unit_price_cents,
              unit_cost_cents: item.unit_cost_cents || 0,
              subtotal_cents: item.subtotal_cents,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          },
        },
        include: { items: true },
      });
      return sale;
    });
  }

  async getSales(businessId: string) {
    return this.prisma.sale.findMany({
      where: { business_id: businessId },
      include: { items: true },
    });
  }

  async getSale(businessId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, business_id: businessId },
      include: { items: true },
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }
}
