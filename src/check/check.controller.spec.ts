import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportService } from '../report/report.service';
import { UserService } from '../user/user.service';
import { Report } from '../report/entities/report.entity';
import { User } from '../user/entities/user.entity';
import { CheckController } from './check.controller';
import { CheckService } from './check.service';
import { Check } from './entities/check.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisModule } from '../redis/redis.module';
import { JwtService } from '@nestjs/jwt';

describe('CheckController', () => {
  let controller: CheckController;
  let service: CheckService;

  const checkRepositoryToken = getRepositoryToken(Check);
  const reportRepositoryToken = getRepositoryToken(Report);
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      controllers: [CheckController],
      providers: [
        CheckService,
        {
          provide: checkRepositoryToken,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: reportRepositoryToken,
          useValue: {},
        },
        {
          provide: userRepositoryToken,
          useValue: {},
        },
        UserService,
        ReportService,
        EventEmitter2,
        JwtService,
      ],
    }).compile();

    controller = module.get<CheckController>(CheckController);
    service = module.get<CheckService>(CheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create function in checkService', () => {
    const CreateCheckDto: any = {};
    const userId: string = 'fakeUserId';

    const spyCreate = jest.spyOn(service, 'create');
    controller.create(CreateCheckDto, userId);

    expect(spyCreate).toBeCalledWith({}, 'fakeUserId');
  });

  it('should call findOne function in checkService', () => {
    const id: string = 'fakeId';
    const userId: string = 'fakeUserId';

    const spyFindOne = jest.spyOn(service, 'findOne');
    controller.findOne(id, userId);

    expect(spyFindOne).toBeCalledWith('fakeId', 'fakeUserId');
  });

  it('should call update function in checkService', () => {
    const id: string = 'fakeId';
    const updateCheckDto: any = {};
    const userId: string = 'fakeUserId';

    const spyUpdate = jest.spyOn(service, 'update');
    controller.update(id, updateCheckDto, userId);

    expect(spyUpdate).toBeCalledWith('fakeId', {}, 'fakeUserId');
  });

  it('should call delete function in checkService', () => {
    const id: string = 'fakeId';
    const userId: string = 'fakeUserId';

    const spyRemove = jest.spyOn(service, 'remove');
    controller.remove(id, userId);

    expect(spyRemove).toBeCalledWith('fakeId', 'fakeUserId');
  });
});
