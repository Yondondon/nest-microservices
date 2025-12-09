import { Controller, Get } from '@nestjs/common';

@Controller()
export class GatewayController {
  constructor() {}

  @Get()
  test() {
    return [];
  }
}
