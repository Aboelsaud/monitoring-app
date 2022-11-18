import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { JwtService } from '@nestjs/jwt';
import { Report } from '../report/entities/report.entity';
import { eventEmitter } from '../services/eventEmitter.sevice';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Check, Report, User]), RedisModule],
  controllers: [CheckController],
  providers: [CheckService, JwtService, eventEmitter, UserService],
})
export class CheckModule {}
