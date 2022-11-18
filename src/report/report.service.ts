import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}
  async findAll(userId: string) {
    return await this.reportRepository.find({
      where: { userId: userId } as unknown,
    });
  }

  async findOne(id: string) {
    const report = await this.reportRepository.findOneBy({ id: id });
    if (!report) throw new NotFoundException('report_not_found');
    return report;
  }

  async findOneByCheckId(checkId: string) {
    const report = await this.reportRepository.findOneBy({ checkId: checkId });
    if (!report) throw new NotFoundException('report_not_found');
    return report;
  }

  update(id: string, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
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
        return await this.reportRepository.save(updatedReport);
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
