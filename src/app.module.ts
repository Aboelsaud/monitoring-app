import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CheckModule } from './check/check.module';
import { ReportModule } from './report/report.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PollingModule } from './polling/polling.module';
import { AxiosConfigModule } from './axios-config/axiosConfig.module';
import { EventEmittersModule } from './event-emitter/eventEmitter.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    CheckModule,
    ReportModule,
    PollingModule,
    AxiosConfigModule,
    EventEmittersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
