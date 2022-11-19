import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { JwtService } from '@nestjs/jwt';
import { Report } from '../report/entities/report.entity';
import { EventEmitterService } from '../event-emitter/eventEmitter.sevice';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RedisModule } from '../redis/redis.module';
import { PollingService } from '../polling/polling.service';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { ReportService } from '../report/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Check, Report, User]), RedisModule],
  controllers: [CheckController],
  providers: [
    CheckService,
    JwtService,
    UserService,
    PollingService,
    AxiosConfigService,
    ReportService,
  ],
})
export class CheckModule {}
