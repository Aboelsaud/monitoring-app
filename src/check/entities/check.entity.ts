import { User } from '../../user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../../report/entities/report.entity';

export enum Protocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  TCP = 'TCP',
}

@Entity()
export class Check extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @Column({ type: 'enum', enum: Protocol, default: Protocol.HTTP })
  protocol: Protocol;

  @Column({ default: '/' })
  path: string;

  @Column({ nullable: true })
  port: number;

  @Column({ nullable: true })
  webhook: string;

  @Column({ default: 5 })
  timeout: number;

  @Column({ default: 10 })
  interval: number;

  @Column({ default: 1 })
  threshold: number;

  @Column({ nullable: true, type: 'jsonb' })
  authentication: {
    username: string;
    password: string;
  };

  @Column({ type: 'simple-array', array: true, nullable: true })
  tags: string[];

  @Column({ nullable: true, type: 'jsonb' })
  httpHeaders: [
    {
      key: String;
      value: String;
    },
  ];

  @Column({ nullable: true, type: 'jsonb' })
  assert: {
    statusCode: number;
  };

  @Column()
  ignoreSSL: boolean;

  @ManyToOne(() => User, (user) => user.checks)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Report, (report) => report.check, {
    onDelete: 'CASCADE',
  })
  reports?: Report[];
}
