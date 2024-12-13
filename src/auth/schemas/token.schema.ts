import { ApiProperty } from '@nestjs/swagger';

export class TokenSchema {
  @ApiProperty({ type: 'string', example: 'aaa.bbb.ccc' })
  value!: string;

  @ApiProperty({
    type: 'number',
    example: 3600,
    description: 'The time in seconds until the token expires',
  })
  expiresInSec!: number;

  constructor(payload: Partial<TokenSchema>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<TokenSchema>) {
    return new TokenSchema(payload);
  }
}
