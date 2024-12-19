import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInRequest {
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({
    description: 'An email of the user',
    example: 'john007@doe.com',
  })
  email: string;

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
