import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { UserDocument } from './schemas/user.schema.js';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.usersRepository.existsByEmail(createUserDto.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword(
    id: Types.ObjectId,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDocument> {
    const user = await this.usersRepository.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      SALT_ROUNDS,
    );
    const updatedUser = await this.usersRepository.updatePassword(id, hashedPassword);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async delete(id: Types.ObjectId): Promise<void> {
    const user = await this.usersRepository.delete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
