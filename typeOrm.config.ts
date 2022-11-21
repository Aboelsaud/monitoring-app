import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/user/entities/user.entity';
import { AddUserEntity1668613880242 } from './migrations/1668613880242-AddUserEntity';
import { Check } from './src/check/entities/check.entity';
import { Report } from './src/report/entities/report.entity';
import { AddCheckEntity1669037495439 } from './migrations/1669037495439-AddCheckEntity';
import { AddReportEntity1669037593135 } from './migrations/1669037593135-AddReportEntity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  entities: [User, Check, Report],
  migrations: [
    AddUserEntity1668613880242,
    AddCheckEntity1669037495439,
    AddReportEntity1669037593135,
  ],
});

if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize();
}
