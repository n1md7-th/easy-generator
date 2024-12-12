import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import ms from 'ms';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  private readonly startedAt = Date.now();

  @ApiOkResponse({
    description: 'Check the status of the service.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        uptime: { type: 'string' },
      },
    },
  })
  @Get()
  check() {
    return {
      status: 'UP',
      uptime: ms(Date.now() - this.startedAt),
    };
  }
}
