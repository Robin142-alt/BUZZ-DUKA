import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SyncPayload {
  records: any[];
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processSync(payload: SyncPayload, businessId: string) {
    const { records } = payload;
    let processedCount = 0;
    const results: any[] = [];

    for (const record of records) {
      const { table_name, operation_type, data } = record;
      const parsedData = JSON.parse(data);
      
      // Enforce Business Isolation
      // Note: users table might not have business_id in some schemas but we do
      // If table is businesses, its id is businessId
      const recordBusinessId = table_name === 'businesses' ? parsedData.id : parsedData.business_id;
      
      if (recordBusinessId && recordBusinessId !== businessId) {
        this.logger.warn(`Unauthorized sync attempt for table ${table_name} by business ${businessId}`);
        results.push({ id: record.id, success: false, error: 'Unauthorized business_id' });
        continue;
      }
      
      try {
        if (table_name === 'businesses') {
          await this.upsertBusiness(parsedData);
        } else if (table_name === 'users') {
          await this.upsertUser(parsedData);
        } else if (table_name === 'products') {
          await this.upsertProduct(parsedData);
        } else if (table_name === 'categories') {
          await this.upsertCategory(parsedData);
        } else if (table_name === 'sales') {
          await this.upsertSale(parsedData);
        } else if (table_name === 'sale_items') {
          await this.upsertSaleItem(parsedData);
        } else if (table_name === 'debts') {
          await this.upsertDebt(parsedData);
        } else if (table_name === 'expenses') {
          await this.upsertExpense(parsedData);
        }
        processedCount++;
        results.push({ id: record.id, success: true, server_id: parsedData.id }); // we assume local id equals server id or we can use generated ids
      } catch (error) {
        this.logger.error(`Failed to process record for ${table_name} with idempotency ${parsedData.idempotency_key}: ${error.message}`);
        results.push({ id: record.id, success: false, error: error.message });
      }
    }

    return { success: true, processedCount, results };
  }

  private async upsertBusiness(data: any) {
    await this.prisma.business.upsert({
      where: { id: data.id },
      update: {
        business_name: data.business_name,
        business_category: data.business_category,
        location: data.location,
        owner_user_id: data.owner_user_id,
        status: data.status,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_name: data.business_name,
        business_category: data.business_category,
        location: data.location,
        owner_user_id: data.owner_user_id,
        status: data.status,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertUser(data: any) {
    await this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
        status: data.status,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
        status: data.status,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertProduct(data: any) {
    await this.prisma.product.upsert({
      where: { id: data.id },
      update: {
        product_name: data.product_name,
        sku: data.sku,
        current_stock_quantity: data.current_stock_quantity,
        low_stock_level: data.low_stock_level,
        default_buying_price_cents: data.default_buying_price_cents,
        current_selling_price_cents: data.current_selling_price_cents,
        average_unit_cost_cents: data.average_unit_cost_cents,
        stock_value_cents: data.stock_value_cents,
        is_active: data.is_active,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        category_id: data.category_id,
        product_name: data.product_name,
        sku: data.sku,
        current_stock_quantity: data.current_stock_quantity,
        low_stock_level: data.low_stock_level,
        default_buying_price_cents: data.default_buying_price_cents,
        current_selling_price_cents: data.current_selling_price_cents,
        average_unit_cost_cents: data.average_unit_cost_cents,
        stock_value_cents: data.stock_value_cents,
        is_active: data.is_active,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertCategory(data: any) {
    await this.prisma.category.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        is_active: data.is_active,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        name: data.name,
        is_active: data.is_active,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertSale(data: any) {
    await this.prisma.sale.upsert({
      where: { id: data.id },
      update: {
        customer_id: data.customer_id,
        total_amount_cents: data.total_amount_cents,
        amount_paid_cents: data.amount_paid_cents,
        balance_due_cents: data.balance_due_cents,
        payment_method: data.payment_method,
        sale_status: data.sale_status,
        sold_by_user_id: data.sold_by_user_id,
        device_id: data.device_id,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        customer_id: data.customer_id,
        total_amount_cents: data.total_amount_cents,
        amount_paid_cents: data.amount_paid_cents,
        balance_due_cents: data.balance_due_cents,
        payment_method: data.payment_method,
        sale_status: data.sale_status,
        sold_by_user_id: data.sold_by_user_id,
        device_id: data.device_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertSaleItem(data: any) {
    await this.prisma.saleItem.upsert({
      where: { id: data.id },
      update: {
        quantity: data.quantity,
        unit_price_cents: data.unit_price_cents,
        unit_cost_cents: data.unit_cost_cents,
        subtotal_cents: data.subtotal_cents,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        sale_id: data.sale_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price_cents: data.unit_price_cents,
        unit_cost_cents: data.unit_cost_cents,
        subtotal_cents: data.subtotal_cents,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertDebt(data: any) {
    await this.prisma.debt.upsert({
      where: { id: data.id },
      update: {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        original_amount_cents: data.original_amount_cents,
        remaining_balance_cents: data.remaining_balance_cents,
        related_sale_id: data.related_sale_id,
        status: data.status,
        due_date: data.due_date ? new Date(data.due_date) : null,
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        original_amount_cents: data.original_amount_cents,
        remaining_balance_cents: data.remaining_balance_cents,
        related_sale_id: data.related_sale_id,
        status: data.status,
        due_date: data.due_date ? new Date(data.due_date) : null,
        created_by_user_id: data.created_by_user_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }

  private async upsertExpense(data: any) {
    await this.prisma.expense.upsert({
      where: { id: data.id },
      update: {
        category: data.category,
        amount_cents: data.amount_cents,
        description: data.description,
        expense_date: new Date(data.expense_date),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
      create: {
        id: data.id,
        business_id: data.business_id,
        category: data.category,
        amount_cents: data.amount_cents,
        description: data.description,
        recorded_by_user_id: data.recorded_by_user_id,
        expense_date: new Date(data.expense_date),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        idempotency_key: data.idempotency_key,
      },
    });
  }
}

