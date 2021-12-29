import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { Request, Response } from 'express';
@Controller('authenticate')
export class AuthenticateController {
  constructor(private authenticateService: AuthenticateService) {}
  @Post('/token')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authenticateService.login(req, res);
  }
}
