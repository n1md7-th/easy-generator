import bcrypt from 'bcrypt';
import { HashService } from '../hash.service';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from '@jest/globals';

jest.mock('bcrypt');

type HashParams = Parameters<typeof bcrypt.hash>;

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get(HashService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash password and return string', async () => {
      // Arrange
      const password = 'veryStrongPassword321';

      // Act
      const hashed = await service.hashPassword(password);

      // Assert
      expect(hashed).toEqual(expect.any(String));
    });

    it('should hash two passwords and compare', async () => {
      // Arrange
      const passwordOne = 'veryStrongPassword321';
      const passwordTwo = 'veryStrongPassword321';
      const passwordThree = 'somethingElse';

      // Act
      const hashedOne = await service.hashPassword(passwordOne);
      const hashedTwo = await service.hashPassword(passwordTwo);
      const hashedThree = await service.hashPassword(passwordThree);

      // Assert
      expect(hashedOne).not.toBe(hashedTwo);
      expect(hashedOne).not.toBe(hashedThree);
      expect(hashedThree).not.toBe(hashedTwo);
    });
  });

  describe('hashCompare', () => {
    it('should compare hashed password with passed value', async () => {
      // Arrange
      const password = 'veryStrongPassword321';

      // Act
      const hashed = await service.hashPassword(password);
      const hashedAgain = await service.hashPassword(password);

      const isValid = await service.hashCompare(password, hashed);
      const isValidAgain = await service.hashCompare(password, hashedAgain);

      // Assert
      expect(isValid).toBeTruthy();
      expect(isValidAgain).toBeTruthy();
      expect(hashed).not.toBe(hashedAgain);
    });

    it('should reject', async () => {
      // Arrange
      const mockBcrypt = jest.mocked(bcrypt);
      mockBcrypt.hash.mockImplementation(
        (
          password: HashParams[0],
          saltRounds: HashParams[1],
          callback: HashParams[2],
        ) => {
          callback(new Error('ERROR:Rejected'), '');
        },
      );
      const password = 'veryStrongPassword321';

      // Act & Assert
      await service.hashPassword(password).catch((error) => {
        expect(error).toBe('ERROR:Rejected');
      });
    });
  });

  describe('randomChars', () => {
    it('should generate random chars', () => {
      const chars = service.randomChars(10);
      expect(chars).toEqual(expect.any(String));
      expect(chars).toHaveLength(10);
    });
  });

  describe('createHashFromBuffer', () => {
    it('should generate hash from for short text', () => {
      const hash = service.createHashFromBuffer('short');

      expect(hash).toEqual(expect.any(String));
      expect(hash).toHaveLength(128);
    });

    it('should generate hash from for long text', () => {
      const hash = service.createHashFromBuffer('veryLong'.repeat(100));

      expect(hash).toEqual(expect.any(String));
      expect(hash).toHaveLength(128);
    });
  });
});
