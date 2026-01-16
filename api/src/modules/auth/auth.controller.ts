import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService, type AuthResponse } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { UserDocument } from '../users/schemas/user.schema.js';
import { UserRole } from '../../common/enums/index.js';

interface JwtPayload {
  sub: Types.ObjectId;
  email: string;
  role: UserRole;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: UserDocument): Promise<AuthResponse> {
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.authService.getProfile(user.sub);
  }
}
