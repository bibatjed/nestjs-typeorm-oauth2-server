import { Module, Global } from '@nestjs/common';
import { OauthServerService } from '../oauth-server/oauth-server.service';

@Global()
@Module({
  exports: [OauthServerService],
  providers: [OauthServerService],
})
export class OauthServerModule {}
