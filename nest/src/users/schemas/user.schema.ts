import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLE, USER_STATUS } from '../dto/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop()
  phone: string;

  @Prop()
  city: string;

  @Prop()
  dayOfbirth: Date;

  @Prop()
  avatar: string;

  @Prop()
  photoCover: string;

  @Prop({ default: USER_ROLE.USER })
  role: USER_ROLE;

  @Prop({ default: USER_STATUS.UNVERIFIED })
  status: USER_STATUS;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
