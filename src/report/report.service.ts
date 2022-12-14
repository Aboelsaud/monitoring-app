import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { In, Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CheckService } from '../check/check.service';
import { AppDataSource } from '../../typeOrm.config';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    private redisService: RedisService,
    private checkService: CheckService,
  ) {}
  async findAll(userId: string, tags: string[]) {
    if (tags) {
      const value: any = await this.redisService.get(JSON.stringify(tags));
      if (value) return JSON.parse(value);
      const checks: any = await this.checkService.findAllWithTags(userId, tags);
      const checksIds = checks.map((check) => {
        return check.id;
      });
      const reports = await this.reportRepository.find({
        where: { checkId: In(checksIds) },
      });
      if (reports.length > 0)
        await this.redisService.set(
          JSON.stringify(tags),
          JSON.stringify(reports),
          10,
        );
      return reports;
    }
    const value: any = await this.redisService.get(userId);
    if (value) return JSON.parse(value);
    const reports = await this.reportRepository.find({
      where: { userId: userId },
    });
    if (reports.length > 0)
      await this.redisService.set(userId, JSON.stringify(reports), 10);
    return reports;
  }

  async findCheck(checkId: string, userId: string) {
    const value: any = await this.redisService.get(checkId);
    if (value) return JSON.parse(value);
    const reports = await this.reportRepository.find({
      where: { userId: userId, checkId: checkId },
    });
    console.log(reports);
    if (reports.length > 0)
      await this.redisService.set(checkId, JSON.stringify(reports), 10);
    return reports;
  }

  async findOne(id: string, userId: string) {
    const report = await this.reportRepository.findOneBy({
      id: id,
      userId: userId,
    });
    if (!report) throw new NotFoundException('report_not_found');
    return report;
  }

  async getDownTimes(checkId: string) {
    return await AppDataSource.getRepository(Report)
      .createQueryBuilder()
      .select('SUM(downtime)')
      .where('checkId=:id', { id: checkId })
      .getRawOne();
  }

  async findOneByCheckId(checkId: string) {
    const report = await this.reportRepository.findOneBy({ checkId: checkId });
    if (!report) throw new NotFoundException('report_not_found');
    return report;
  }

  async updateReport(checkId: string, updateReportDetails: any) {
    const report = await this.reportRepository.findOneBy({ checkId: checkId });
    if (report) {
      try {
        const updatedReport = {
          userId: report.userId,
          checkId: checkId,
          ...updateReportDetails,
        };
        console.log('sssssss', updatedReport);
        const savedReport = await this.reportRepository.save(updatedReport);
        return savedReport;
      } catch (err) {
        throw new BadRequestException('error_on_updating_report', err);
      }
    } else {
      throw new NotFoundException('report_not_found');
    }
  }

  async remove(id: string) {
    const report = await this.reportRepository.findOneBy({ id: id });
    if (report) {
      try {
        await this.reportRepository.delete(id);
        return 1;
      } catch (err) {
        throw new BadRequestException('error_on_removing_report');
      }
    } else {
      throw new NotFoundException('report_not_found');
    }
  }
}
