import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserDocument } from '../users/schemas/user.schema.js';
import { UserRole } from '../../common/enums/index.js';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.CUSTOMER,
    });
    return this.generateAuthResponse(user);
  }

  async login(user: UserDocument): Promise<AuthResponse> {
    return this.generateAuthResponse(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    return this.usersService.validateCredentials(email, password);
  }

  async getProfile(userId: Types.ObjectId): Promise<UserDocument> {
    return this.usersService.findById(userId);
  }

  private generateAuthResponse(user: UserDocument): AuthResponse {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
