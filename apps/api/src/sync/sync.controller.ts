import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import type { SyncPayload } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  async handleSync(@CurrentUser() user: any, @Body() payload: SyncPayload) {
    if (!payload.records || !Array.isArray(payload.records)) {
      return { success: false, message: 'Invalid payload format' };
    }
    
    return this.syncService.processSync(payload, user.businessId);
  }
}
