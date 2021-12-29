import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorator/user.decorator';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  public async getUserProfile(@User() user) {
    return this.usersService.getUserProfile(user.id);
  }
}
