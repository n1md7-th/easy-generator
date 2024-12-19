import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoleEnum } from '../enums/role.enum';
import { StatusEnum } from '../enums/status.enum';

export class SignUpResponse {
  @Exclude() _id: number;
  @Exclude() password: string;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;
  @Exclude() status: StatusEnum;
  @Exclude() email: string;
  @Exclude() roles: RoleEnum[];

  @ApiProperty({
    type: 'string',
    example: 'd0f5c2c0-0f8a-4f1a-8f0a-2b5b8a0e1c1e',
  })
  uuid!: string;

  constructor(payload: Partial<SignUpResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignUpResponse>) {
    return new SignUpResponse(payload);
  }
}
