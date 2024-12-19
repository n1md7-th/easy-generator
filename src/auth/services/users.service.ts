import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { User } from '../entities/users.entity';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async getByUuid(uuid: string) {
    return await this.userModel.findOne({ uuid }).exec();
  }

  async create(email: string, password: string, roles: RoleEnum[]) {
    if (await this.getByEmail(email)) {
      throw new ConflictException(
        `User with the email "${email}" already exists`,
      );
    }

    return this.userModel.create({
      uuid: randomUUID(),
      email,
      password,
      roles,
    });
  }
}
