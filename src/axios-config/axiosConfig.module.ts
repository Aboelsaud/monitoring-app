import { Module } from '@nestjs/common';
import { AxiosConfigService } from './axiosConfig.service';

@Module({
  providers: [AxiosConfigService],
})
export class AxiosConfigModule {}
