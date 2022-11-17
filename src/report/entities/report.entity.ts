import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Check } from '../../check/entities/check.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 200 })
  status: string;

  @Column({ default: 0 })
  availability: string;

  @Column({ default: 0 })
  outages: number;

  @Column({ default: 0 })
  downtime: number;

  @Column({ default: 0 })
  uptime: number;

  @Column({ default: 0 })
  responseTime: number;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Check, (check) => check.reports, {
    onDelete: 'CASCADE',
  })
  check: Check;

  @Column()
  checkId: string;
}
