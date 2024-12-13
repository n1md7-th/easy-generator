import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/users.entity';
import { HashEnum } from './enums/hash.enum';
import { TimerParams } from './enums/timer.enum';
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';
import { SessionService } from './services/session.service';
import { TimerService } from './services/timer.service';
import { UsersService } from './services/users.service';
import ms from 'ms';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    UsersService,
    SessionService,
    TimerService,
    {
      provide: HashEnum.SaltRounds,
      useValue: 8,
    },
    {
      provide: TimerParams.NextTick,
      useValue: ms('10 minutes'),
    },
  ],
})
export class AuthModule {}
