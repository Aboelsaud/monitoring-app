import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { CheckService } from '../check/check.service';
import { Check } from '../check/entities/check.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ReportController } from './report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Check, User]), RedisModule],
  controllers: [ReportController],
  providers: [ReportService, JwtService, CheckService, UserService],
})
export class ReportModule {}
