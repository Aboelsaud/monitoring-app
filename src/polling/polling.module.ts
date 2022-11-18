import { Module } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { AxiosConfigService } from '../axios-config/axiosConfig.service';
import { PollingService } from './polling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [PollingService, AxiosConfigService, ReportService],
})
export class PollingModule {}
