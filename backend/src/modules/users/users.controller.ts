import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get() {
    return this.usersService.getDefaultUser();
  }

  @Post('onboard')
  async onboard(@Body() data: any) {
    const user = await this.usersService.onboardUser(data);
    return { status: 'success', user };
  }
}
