import {
  IsAscii,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOneLetter } from '../validators/at-least-one-letter.decorator';
import { AtLeastOneNumber } from '../validators/at-least-one-number.decorator';
import { AtLeastOneSpecial } from '../validators/at-least-one-special.decorator';

export class SignUpRequest {
  @IsAscii()
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @ApiProperty({
    description: 'The username of the user',
    example: 'john',
  })
  username: string;

  @IsAscii()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @AtLeastOneNumber()
  @AtLeastOneLetter()
  @AtLeastOneSpecial()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsAscii()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @AtLeastOneNumber()
  @AtLeastOneLetter()
  @AtLeastOneSpecial()
  @ApiProperty({
    description: 'The password confirmation of the user',
    example: 'password',
  })
  confirmPassword: string;

  constructor(payload: Partial<SignUpRequest>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignUpRequest>): SignUpRequest {
    return new SignUpRequest(payload);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
