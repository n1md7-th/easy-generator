import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInRequest {
  @IsAscii()
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @ApiProperty({
    description: 'The username of the user',
    example: 'john007',
  })
  username: string;

  @IsAscii()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd',
  })
  password: string;

  constructor(payload: Partial<SignInRequest>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignInRequest>): SignInRequest {
    return new SignInRequest(payload);
  }
}
