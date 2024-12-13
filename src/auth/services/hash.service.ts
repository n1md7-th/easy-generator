import { Inject, Injectable, Optional } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { HashEnum } from '../enums/hash.enum';

@Injectable()
export class HashService {
  constructor(
    @Optional() @Inject(HashEnum.SaltRounds) private readonly saltRounds = 4,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, this.saltRounds, (error, hash) => {
        if (error) return reject(error);

        resolve(hash);
      });
    });
  }

  async hashCompare(clearText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(clearText, hashed);
  }

  randomChars(len: number): string {
    return crypto.randomBytes(len / 2).toString('hex');
  }

  createHashFromBuffer(fileBuffer: string): string {
    return crypto.createHash('sha512').update(fileBuffer).digest('hex');
  }
}
