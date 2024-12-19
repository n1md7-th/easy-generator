import { Document } from 'mongoose';
import { RoleEnum } from '../enums/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  uuid!: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    type: [String],
    required: true,
    enum: [RoleEnum.User, RoleEnum.Admin, RoleEnum.Guest],
  })
  roles!: RoleEnum[];

  @Prop({
    type: String,
    enum: StatusEnum,
    default: StatusEnum.Active,
  })
  status!: StatusEnum;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
