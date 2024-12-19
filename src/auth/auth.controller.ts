import { AppConfigService } from '@common/common/config/app-config.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import ms from 'ms';
import { Ctx, CtxType } from './decorators/context.decorator';
import { RoleEnum } from './enums/role.enum';
import { StatusEnum } from './enums/status.enum';
import { SignInRequest } from './requests/sign-in.request';
import { SignOutRequest } from './requests/sign-out.request';
import { SignUpRequest } from './requests/sign-up.request';
import { SignUpResponse } from './responses/sign-in.response';
import { SignInResponse } from './responses/sign-up.response';
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';
import { SessionService } from './services/session.service';
import { UsersService } from './services/users.service';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly configService: AppConfigService,
  ) {
    this.refreshTokenExpiresIn = ms(
      configService.getOrThrow('auth.refreshTokenExpiresIn', {
        infer: true,
      }),
    );
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SignUpResponse })
  @ApiConflictResponse({
    description: 'Returns CONFLICT when the user already exists.',
  })
  @ApiBadRequestResponse({
    description:
      'Returns BAD_REQUEST when the payload is invalid or malformed.',
  })
  async signUp(@Body() payload: SignUpRequest) {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await this.hashService.hashPassword(
      payload.password,
    );
    const userEntity = await this.usersService.create(
      payload.email,
      hashedPassword,
      [RoleEnum.User, RoleEnum.Guest],
    );

    return SignUpResponse.from({
      uuid: userEntity.uuid,
      email: userEntity.email,
    });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponse })
  @ApiNotFoundResponse({
    description: 'Returns NOT_FOUND when the user does not exist.',
  })
  @ApiBadRequestResponse({
    description:
      'Returns BAD_REQUEST when the payload is invalid or malformed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Returns UNAUTHORIZED when the credentials are invalid',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Returns UNPROCESSABLE_ENTITY when the user is not active',
  })
  async signIn(@Body() payload: SignInRequest) {
    const user = await this.usersService.getByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordsMatch = await this.hashService.hashCompare(
      payload.password,
      user.password,
    );
    if (!passwordsMatch) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== StatusEnum.Active) {
      throw new UnprocessableEntityException('User is not active');
    }

    const accessToken = this.authService.signAccessToken(user.uuid, user.roles);
    const refreshToken = this.authService.getRefreshToken();

    const expiresIn = this.refreshTokenExpiresIn;
    const expiresAt = new Date(Date.now() + ms(expiresIn));

    await this.sessionService.create(refreshToken.value, user, expiresAt);

    return SignInResponse.from({
      accessToken,
      refreshToken,
      roles: user.roles,
    });
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Returns ACCEPTED when the sign out request is successful',
  })
  async signOut(@Body() payload: SignOutRequest, @Ctx() ctx: CtxType) {
    await this.sessionService
      .delete(payload.refreshToken)
      .catch((error) => ctx.logger.warn(error.message));
  }
}
