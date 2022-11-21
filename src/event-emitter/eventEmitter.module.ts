import { Module } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { PollingService } from '../polling/polling.service';
import { EventEmitterService } from './eventEmitter.sevice';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';
import { RedisModule } from '../redis/redis.module';
import { User } from '../user/entities/user.entity';
import { Check } from '../check/entities/check.entity';
import { UserService } from '../user/user.service';
import { CheckService } from '../check/check.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Check]), RedisModule],
  providers: [
    EventEmitterService,
    PollingService,
    AxiosConfigService,
    ReportService,
    UserService,
    CheckService,
  ],
})
export class EventEmittersModule {}
