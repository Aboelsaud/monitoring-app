import {
  CacheModule,
  CACHE_MANAGER,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';

const redis_vars = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  ttl: parseInt(process.env.REDIS_TTL),
};
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return process.env.NODE_ENV !== 'test' ? redis_vars : {};
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  public onModuleInit(): any {
    const logger = new Logger('Cache');
  }
}
