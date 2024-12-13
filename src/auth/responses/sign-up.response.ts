import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../enums/role.enum';
import { TokenSchema } from '../schemas/token.schema';

export class SignInResponse {
  @ApiProperty({ type: TokenSchema })
  accessToken: TokenSchema;

  @ApiProperty({ type: TokenSchema })
  refreshToken: TokenSchema;

  @ApiProperty({
    enum: RoleEnum,
    example: [RoleEnum.Admin, RoleEnum.User, RoleEnum.Guest],
    isArray: true,
  })
  roles: string[];

  constructor(payload: Partial<SignInResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignInResponse>) {
    return new SignInResponse(payload);
  }
}
