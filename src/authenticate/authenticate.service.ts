import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { OauthServerService } from '../oauth-server/oauth-server.service';
@Injectable()
export class AuthenticateService {
  constructor(private oAuthServer: OauthServerService) {}
  async login(req: Request, res: Response) {
    return this.oAuthServer.authenticate(req, res);
  }
}
