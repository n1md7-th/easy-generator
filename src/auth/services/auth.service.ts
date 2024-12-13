import { AppConfigService } from '@common/common/config/app-config.service';
import { toSeconds } from '@common/common/utils/number.utils';
import { Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import ms from 'ms';
import { TokenSchema } from '../schemas/token.schema';

type ReturnType = {
  value: string;
  expiresInSec: number;
};
@Injectable()
export class AuthService {
  private readonly accessTokenExpiresInSec: number;
  private readonly accessTokenExpiresInStr: string;
  private readonly refreshTokenExpiresInSec: number;
  private readonly refreshTokenExpiresInStr: string;
  private readonly jsonWebTokenSecret: string;
  private readonly host: string;

  constructor(configService: AppConfigService) {
    this.host = configService.getOrThrow('http.host', { infer: true });
    this.jsonWebTokenSecret = configService.getOrThrow('auth.secret', {
      infer: true,
    });
    this.accessTokenExpiresInStr = configService.getOrThrow(
      'auth.accessTokenExpiresIn',
      {
        infer: true,
      },
    );
    this.refreshTokenExpiresInStr = configService.getOrThrow(
      'auth.refreshTokenExpiresIn',
      {
        infer: true,
      },
    );
    this.accessTokenExpiresInSec = toSeconds(ms(this.accessTokenExpiresInStr));
    this.refreshTokenExpiresInSec = toSeconds(
      ms(this.refreshTokenExpiresInStr),
    );
  }

  signAccessToken(aud: string, roles: string[]): ReturnType {
    const options: SignOptions = {
      algorithm: 'HS512',
      expiresIn: this.accessTokenExpiresInStr,
    };
    const value = sign(
      {
        iss: this.host,
        aud,
        roles,
      },
      this.jsonWebTokenSecret,
      options,
    );

    return TokenSchema.from({
      value,
      expiresInSec: this.accessTokenExpiresInSec,
    });
  }

  getRefreshToken() {
    const value = randomUUID();

    return TokenSchema.from({
      value,
      expiresInSec: this.refreshTokenExpiresInSec,
    });
  }
}
