import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AtLeastOneLetter } from '../validators/at-least-one-letter.decorator';
import { AtLeastOneNumber } from '../validators/at-least-one-number.decorator';
import { AtLeastOneSpecial } from '../validators/at-least-one-special.decorator';
import { SignInRequest } from './sign-in.request';

export class SignUpRequest extends SignInRequest {
  @IsAscii()
  @IsString()
  @MaxLength(128)
  name: string;

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
    super(payload);

    Object.assign(this, payload);
  }

  static override from(payload: Partial<SignUpRequest>): SignUpRequest {
    return new SignUpRequest(payload);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
