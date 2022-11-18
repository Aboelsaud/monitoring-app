import { Module } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { PollingService } from '../polling/polling.service';
import { EventEmitterService } from './eventEmitter.sevice';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [
    EventEmitterService,
    PollingService,
    AxiosConfigService,
    ReportService,
  ],
})
export class EventEmittersModule {}
