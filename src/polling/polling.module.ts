import { Module } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { PollingService } from './polling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';
import { RedisModule } from '../redis/redis.module';
import { CheckService } from '../check/check.service';
import { Check } from '../check/entities/check.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Check, User]), RedisModule],
  providers: [
    PollingService,
    AxiosConfigService,
    ReportService,
    CheckService,
    UserService,
  ],
})
export class PollingModule {}
