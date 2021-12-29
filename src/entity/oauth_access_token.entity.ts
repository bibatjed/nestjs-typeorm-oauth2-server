import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { OAuthClient } from './oauth_client.entity';

@Entity()
export class OAuthAccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  access_token: string;

  @ManyToOne(() => OAuthClient)
  client: OAuthClient;

  @ManyToOne(() => User)
  user: User;

  @Column()
  expires: Date;

  @Column()
  scope: string;

}
