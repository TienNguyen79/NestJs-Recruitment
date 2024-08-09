import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true }) // biểu hiện cho thuộc tính
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: Object })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
