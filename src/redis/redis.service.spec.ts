import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Cache } from 'cache-manager';

describe('HelperService', () => {
  let service: RedisService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call get function', async () => {
    await service.get('key');
    expect(cacheManager.get).toBeCalledWith('key');
  });

  it('should call set function', async () => {
    await service.set('key', 'value');
    expect(cacheManager.set).toBeCalledWith('key', 'value', { ttl: undefined });
  });

  it('should call del function', async () => {
    await service.del('key');
    expect(cacheManager.del).toBeCalledWith('key');
  });
});
