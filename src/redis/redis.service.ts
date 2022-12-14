import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string) {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: string, ttl?: number) {
    await this.cacheManager.set(key, value, { ttl: ttl });
  }

  public async del(key: any) {
    await this.cacheManager.del(key);
  }
}
