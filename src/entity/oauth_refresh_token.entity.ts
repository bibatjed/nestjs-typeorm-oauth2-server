import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OAuthAccessToken } from './oauth_access_token.entity';
import { User } from './user.entity';
import { OAuthClient } from './oauth_client.entity';

@Entity()
export class OAuthRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refresh_token: string;

  @ManyToOne(() => OAuthClient)
  client: OAuthClient;

  @ManyToOne(() => User)
  user: User;

  @Column()
  expires: Date;

  @Column()
  scope: string;

  @OneToOne(() => OAuthAccessToken)
  @JoinColumn()
  access_token: OAuthAccessToken;
}
