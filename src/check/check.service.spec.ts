import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportService } from '../report/report.service';
import { UserService } from '../user/user.service';
import { RedisModule } from '../redis/redis.module';
import { Report } from '../report/entities/report.entity';
import { User } from '../user/entities/user.entity';
import { CheckService } from './check.service';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

describe('CheckService', () => {
  let service: CheckService;
  let checkRepository: any;
  let reportRepository: any;
  let userService: any = {
    findOne: jest.fn(),
  };

  const checkRepositoryToken = getRepositoryToken(Check);
  const reportRepositoryToken = getRepositoryToken(Report);
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
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
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: reportRepositoryToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: userRepositoryToken,
          useValue: {
            findOne: jest.fn(),
          },
        },
        { provide: UserService, useValue: userService },
        ReportService,
        EventEmitter2,
        JwtService,
      ],
    }).compile();

    service = module.get<CheckService>(CheckService);
    checkRepository = module.get<Repository<Check>>(getRepositoryToken(Check));
    reportRepository = module.get<Repository<Report>>(
      getRepositoryToken(Report),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheck', () => {
    it('should repsond with created check for authenticated user', async () => {
      const createCheckDto: any = {};
      const userId: string = 'fakeUserId';
      const spyCreate = jest
        .spyOn(checkRepository, 'create')
        .mockReturnValueOnce('fakeCheck');
      const spySave = jest
        .spyOn(checkRepository, 'save')
        .mockReturnValueOnce({ id: 'fakeCheckId' });

      const spyCreateReport = jest
        .spyOn(reportRepository, 'create')
        .mockReturnValueOnce('fakeReport');
      const spySaveReport = jest
        .spyOn(reportRepository, 'save')
        .mockReturnValueOnce('');

      const spyUserFindOne = jest
        .spyOn(userService, 'findOne')
        .mockReturnValueOnce('' as any);

      await service.create(createCheckDto, userId);

      expect(spyCreate).toBeCalledWith({ userId: 'fakeUserId' });
      expect(spySave).toBeCalledWith('fakeCheck');
      expect(spyCreateReport).toBeCalledWith({
        checkId: 'fakeCheckId',
        userId: 'fakeUserId',
      });
      expect(spySaveReport).toBeCalledWith('fakeReport');
      expect(spyUserFindOne).toBeCalledWith('fakeUserId');
    });
    it('should repsond with check_creation_failed if error appears', async () => {
      const createCheckDto: any = {};
      const userId: string = 'fakeUserId';
      const spyCreate = jest
        .spyOn(checkRepository, 'create')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const spySave = jest
        .spyOn(checkRepository, 'save')
        .mockReturnValueOnce({ id: 'fakeCheckId' });

      const error = await getError(
        async () => await service.create(createCheckDto, userId),
      );

      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toStrictEqual(
        new BadRequestException('check_creation_failed'),
      );

      expect(spyCreate).toBeCalledWith({ userId: 'fakeUserId' });
      expect(spySave).not.toBeCalled();
    });

    describe('findAll', () => {
      it('should respond with allChecks for authenticated user', async () => {
        const userId: string = 'fakeUserId';
        const spyFind = jest
          .spyOn(checkRepository, 'find')
          .mockReturnValueOnce('');
        await service.findAll(userId);

        expect(spyFind).toBeCalledWith({ where: { userId: 'fakeUserId' } });
      });
    });

    describe('findOne', () => {
      it('should respond with check for authenticated user', async () => {
        const id: string = 'fakeCheckId';
        const userId: string = 'fakeUserId';
        const spyFind = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce('check');
        await service.findOne(id, userId);

        expect(spyFind).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
      });

      it('should respond not found error if check not exists', async () => {
        const id: string = 'fakeCheckId';
        const userId: string = 'fakeUserId';
        const spyFind = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce('');

        const error = await getError(
          async () => await service.findOne(id, userId),
        );
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toStrictEqual(new NotFoundException('check_not_found'));

        expect(spyFind).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
      });
    });

    describe('update', () => {
      it('should respond with updateCheck for authenticated user', async () => {
        const id: string = 'fakeCheckId';
        const updateCheckDto: any = {};
        const userId: string = 'fakeUserId';

        const spyFindOne = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce({ userId: 'fakeUserId' });

        const spyPreLoad = jest
          .spyOn(checkRepository, 'preload')
          .mockReturnValueOnce({ userId: 'fakeUserId' });

        const spyUserFindOne = jest
          .spyOn(userService, 'findOne')
          .mockReturnValueOnce({ email: 'fakeEmail' });

        const spySave = jest
          .spyOn(checkRepository, 'save')
          .mockReturnValueOnce('');
        await service.update(id, updateCheckDto, userId);

        expect(spyFindOne).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
        expect(spyPreLoad).toBeCalledWith({ id: 'fakeCheckId' });
        expect(spyUserFindOne).toBeCalledWith('fakeUserId');
        expect(spySave).toBeCalledWith({ userId: 'fakeUserId' });
      });
      it('should respond with updateCheck for authenticated user', async () => {
        const id: string = 'fakeCheckId';
        const updateCheckDto: any = {};
        const userId: string = 'fakeUserId';

        const spyFindOne = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce(null);

        const spyPreLoad = jest
          .spyOn(checkRepository, 'preload')
          .mockReturnValueOnce('');

        const error = await getError(
          async () => await service.update(id, updateCheckDto, userId),
        );
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toStrictEqual(new NotFoundException('check_not_found'));

        expect(spyFindOne).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
        expect(spyPreLoad).not.toBeCalled();
      });
    });

    describe('delete', () => {
      it('should respond with deletedCheck for authenticated user', async () => {
        const id: string = 'fakeCheckId';
        const userId: string = 'fakeUserId';

        const spyFindOne = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce({ userId: 'fakeUserId' });

        const spyDelete = jest
          .spyOn(checkRepository, 'delete')
          .mockReturnValueOnce('');
        await service.remove(id, userId);

        expect(spyFindOne).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
        expect(spyDelete).toBeCalledWith('fakeCheckId');
      });

      it('should respond with error if check is not found', async () => {
        const id: string = 'fakeCheckId';
        const userId: string = 'fakeUserId';

        const spyFindOne = jest
          .spyOn(checkRepository, 'findOneBy')
          .mockReturnValueOnce('');

        const spyDelete = jest
          .spyOn(checkRepository, 'delete')
          .mockReturnValueOnce('');
        const error = await getError(
          async () => await service.remove(id, userId),
        );
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toStrictEqual(new NotFoundException('check_not_found'));

        expect(spyFindOne).toBeCalledWith({
          id: 'fakeCheckId',
          userId: 'fakeUserId',
        });
        expect(spyDelete).not.toBeCalled();
      });
    });
  });
});
