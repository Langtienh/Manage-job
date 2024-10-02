import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSalt, hash } from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  checkPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  private checkId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid ID');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User> {
    this.checkId(id);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (user) return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username });
    if (user) return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    this.checkId(id);
    return this.userModel.softDelete({ _id: id });
  }
}
