import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByIdWithPassword(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
  }

  async updatePassword(
    id: Types.ObjectId,
    hashedPassword: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .select('-password')
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ email: email.toLowerCase() })
      .exec();
    return count > 0;
  }
}
