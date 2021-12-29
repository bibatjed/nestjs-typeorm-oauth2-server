import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { OauthServerService } from '../oauth-server/oauth-server.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private OauthServerService: OauthServerService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    if (!request.headers.authorization) {
      return false;
    }

    const userResult = await this.OauthServerService.checkAuthenticate(
      request,
      response,
    );

    console.log(userResult);
    request.user = userResult.user;
    return Promise.resolve(true);
  }
}
