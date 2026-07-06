import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkSubscriptions() {
    this.logger.log('Running daily subscription check...');
    const now = new Date();

    const expiredLicenses = await this.prisma.license.findMany({
      where: {
        is_active: true,
        valid_until: {
          lt: now,
        },
      },
    });

    for (const license of expiredLicenses) {
      await this.prisma.license.update({
        where: { id: license.id },
        data: { is_active: false },
      });

      // Update business status to inactive if no other active licenses exist
      const activeLicenses = await this.prisma.license.count({
        where: {
          business_id: license.business_id,
          is_active: true,
        },
      });

      if (activeLicenses === 0) {
        await this.prisma.business.update({
          where: { id: license.business_id },
          data: { status: 'inactive' },
        });
        this.logger.log(`Deactivated business ${license.business_id} due to expired subscription.`);
      }
    }
  }

  async getSubscriptionStatus(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        licenses: {
          where: { is_active: true },
          orderBy: { valid_until: 'desc' },
        },
      },
    });

    if (!business) {
      return { status: 'unknown', plan: 'none' };
    }

    const activeLicense = business.licenses[0];

    return {
      status: business.status,
      plan: activeLicense ? activeLicense.plan_tier : 'none',
      valid_until: activeLicense ? activeLicense.valid_until : null,
      device_limit: activeLicense ? activeLicense.device_limit : 0,
    };
  }
}
