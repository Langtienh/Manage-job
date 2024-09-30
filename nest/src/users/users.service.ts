import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  private checkId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    if (!this.checkId(id)) {
      return { message: 'Invalid ID' };
    }
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndDelete(id, updateUserDto).exec();
  }

  remove(id: string) {
    if (!this.checkId(id)) {
      return { message: 'Invalid ID' };
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
