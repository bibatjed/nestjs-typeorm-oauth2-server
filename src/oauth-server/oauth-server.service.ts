import { Injectable } from '@nestjs/common';
import authModel from '../oauth-model';
import { Request as RequestO, Response as ResponseO } from 'oauth2-server';
import { Request, Response } from 'express';
import OAuthServer = require('oauth2-server');

@Injectable()
export class OauthServerService {
  public OAuthServer;
  constructor() {
    this.OAuthServer = new OAuthServer({
      model: authModel,
      requireClientAuthentication: { password: false, refresh_token: false },
    });
  }

  async authenticate(req: Request, res: Response) {
    const request = new RequestO(req as any);
    const response = new ResponseO(res as any);
    return this.OAuthServer.token(request, response);
  }

  async checkAuthenticate(req:any, res: any){
    const request = new RequestO(req as any);
    const response = new ResponseO(res as any);
    return this.OAuthServer.authenticate(request, response);
  }
}
