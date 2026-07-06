import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(businessId: string, data: any) {
    return this.prisma.product.create({
      data: {
        ...data,
        business_id: businessId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getProducts(businessId: string) {
    return this.prisma.product.findMany({
      where: { business_id: businessId },
    });
  }

  async getProduct(businessId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, business_id: businessId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(businessId: string, id: string, data: any) {
    await this.getProduct(businessId, id); // check existence and ownership
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }
}
