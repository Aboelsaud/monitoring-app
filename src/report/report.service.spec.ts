import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportService } from './report.service';
import { CheckService } from '../check/check.service';
import { UserService } from '../user/user.service';
import { Check } from '../check/entities/check.entity';
import { User } from '../user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

describe('ReportService', () => {
  let service: ReportService;
  let reportRepository: any;

  const reportRepositoryToken = getRepositoryToken(Report);
  const checkRepositoryToken = getRepositoryToken(Check);
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [
        ReportService,
        {
          provide: reportRepositoryToken,
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        CheckService,
        {
          provide: checkRepositoryToken,
          useValue: {},
        },
        {
          provide: userRepositoryToken,
          useValue: {},
        },
        UserService,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    reportRepository = module.get<Repository<Report>>(
      getRepositoryToken(Report),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllReportByUserId', () => {
    it('should return all reports by authenticated userId', async () => {
      const userId: string = 'fakeUserId';
      const spyFindAll = jest
        .spyOn(reportRepository, 'find')
        .mockReturnValueOnce('' as any);
      await service.findAll(userId, null);

      expect(spyFindAll).toBeCalledWith({ where: { userId: 'fakeUserId' } });
    });
  });

  describe('findOneReport', () => {
    it('should return report', async () => {
      const id: string = 'fakeReportId';
      const userId: string = 'fakeUserId';
      const spyFindAll = jest
        .spyOn(reportRepository, 'findOneBy')
        .mockReturnValueOnce('report' as any);
      await service.findOne(id, userId);

      expect(spyFindAll).toBeCalledWith({
        id: 'fakeReportId',
        userId: 'fakeUserId',
      });
    });

    it('should throw report not found when report not exists', async () => {
      const id: string = 'fakeReportId';
      jest.spyOn(reportRepository, 'findOneBy').mockReturnValueOnce('' as any);
      const error = await getError(
        async () => await service.findOne(id, 'fakeUserId'),
      );

      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toStrictEqual(new NotFoundException('report_not_found'));
    });
  });

  describe('updateReport', () => {
    it('should update report for authenticated user', async () => {
      const checkId: string = 'fakeCheckId';
      const updateReportDetails: any = {};
      const spyFindAll = jest
        .spyOn(reportRepository, 'findOneBy')
        .mockReturnValueOnce({ userId: 'fakeUserId' } as any);
      await service.updateReport(checkId, updateReportDetails);

      const spySave = jest
        .spyOn(reportRepository, 'save')
        .mockReturnValueOnce('');

      expect(spyFindAll).toBeCalledWith({ checkId: 'fakeCheckId' });
      expect(spySave).toBeCalledWith({
        checkId: 'fakeCheckId',
        userId: 'fakeUserId',
      });
    });

    it('should throw an error if report is not found', async () => {
      const checkId: string = 'fakeCheckId';
      const updateReportDetails: any = {};
      const spyFindAll = jest
        .spyOn(reportRepository, 'findOneBy')
        .mockReturnValueOnce(null as any);

      const spySave = jest
        .spyOn(reportRepository, 'save')
        .mockReturnValueOnce('');

      const error = await getError(
        async () => await service.updateReport(checkId, updateReportDetails),
      );

      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toStrictEqual(new NotFoundException('report_not_found'));

      expect(spyFindAll).toBeCalledWith({ checkId: 'fakeCheckId' });
      expect(spySave).not.toBeCalled();
    });
  });

  describe('deleteReport', () => {
    it('should delete report for authenticated user', async () => {
      const id: string = 'fakeReportId';
      const spyFindAll = jest
        .spyOn(reportRepository, 'findOneBy')
        .mockReturnValueOnce({ report: 'fakeReport' } as any);

      const spyDelete = jest
        .spyOn(reportRepository, 'delete')
        .mockReturnValueOnce('');
      await service.remove(id);

      expect(spyFindAll).toBeCalledWith({ id: 'fakeReportId' });
      expect(spyDelete).toBeCalledWith('fakeReportId');
    });

    it('should throw an error if report is not found', async () => {
      const id: string = 'fakeReportId';
      const findOneBy = jest
        .spyOn(reportRepository, 'findOneBy')
        .mockReturnValueOnce(null as any);

      const spyDelete = jest
        .spyOn(reportRepository, 'delete')
        .mockReturnValueOnce('');

      const error = await getError(async () => await service.remove(id));

      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toStrictEqual(new NotFoundException('report_not_found'));

      expect(findOneBy).toBeCalledWith({ id: 'fakeReportId' });
      expect(spyDelete).not.toBeCalled();
    });
  });
});
