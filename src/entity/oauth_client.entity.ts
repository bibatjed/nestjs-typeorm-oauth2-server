import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class OAuthClient {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  client_id: string;

  @Column({
    nullable: true,
  })
  client_secret: string;

  @Column({
    nullable: true,
  })
  redirect_uri: string;

  @Column('json')
  grant_types: object;

  @Column()
  scope: string;

}
