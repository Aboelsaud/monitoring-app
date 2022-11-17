import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { JwtService } from '@nestjs/jwt';
import { Report } from '../report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Check, Report])],
  controllers: [CheckController],
  providers: [CheckService, JwtService],
})
export class CheckModule {}
