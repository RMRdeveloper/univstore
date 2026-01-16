import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import type { UserDocument } from './schemas/user.schema.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UserRole } from '../../common/enums/index.js';
import { AuthGuard } from '@nestjs/passport';

interface JwtPayload {
  sub: Types.ObjectId;
  email: string;
  role: UserRole;
}

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: JwtPayload): Promise<UserDocument> {
    return this.usersService.findById(user.sub);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.update(user.sub, updateUserDto);
  }

  @Patch('password')
  async updatePassword(
    @CurrentUser() user: JwtPayload,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDocument> {
    return this.usersService.updatePassword(user.sub, updatePasswordDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    return this.usersService.delete(id);
  }
}
