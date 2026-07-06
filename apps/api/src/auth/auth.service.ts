import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { phone: loginDto.phone },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.pin, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, businessId: user.business_id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        business_id: user.business_id,
        role: user.role,
        full_name: user.full_name,
      },
    };
  }

  async registerBusiness(registerDto: RegisterBusinessDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.pin, 10);
    const businessId = randomUUID();
    const userId = randomUUID();

    const result = await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const business = await tx.business.create({
        data: {
          id: businessId,
          business_name: registerDto.businessName,
          created_at: now,
          updated_at: now,
        },
      });

      const user = await tx.user.create({
        data: {
          id: userId,
          business_id: business.id,
          full_name: registerDto.ownerName,
          phone: registerDto.phone,
          password_hash: hashedPassword,
          role: 'owner',
          created_at: now,
          updated_at: now,
        },
      });

      return { business, user };
    });

    const payload = { sub: result.user.id, businessId: result.business.id, role: result.user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result.user.id,
        business_id: result.user.business_id,
        role: result.user.role,
        full_name: result.user.full_name,
      },
    };
  }
}
