import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/user/entities/user.entity';
import { AddUserEntity1668613880242 } from './migrations/1668613880242-AddUserEntity';
import { Check } from './src/check/entities/check.entity';
import { Report } from './src/report/entities/report.entity';
import { AddCheckEntity1668695232762 } from './migrations/1668695232762-AddCheckEntity';
import { AddReportEntity1668695287330 } from './migrations/1668695287330-AddReportEntity';
import { AddCascadeDelete1668696035724 } from './migrations/1668696035724-AddCascadeDelete';

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
    AddCheckEntity1668695232762,
    AddReportEntity1668695287330,
    AddCascadeDelete1668696035724,
  ],
});

if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize();
}
