import { BaseEntity } from '../../base_entities/base_entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Check } from '../../check/entities/check.entity';
import { Report } from '../../report/entities/report.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => Check, (check) => check.user)
  checks?: Check[];

  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];
}
