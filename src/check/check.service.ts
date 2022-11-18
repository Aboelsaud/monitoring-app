import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { Check } from './entities/check.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check) private checkRepository: Repository<Check>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createCheckDto: CreateCheckDto, userId: string) {
    try {
      const body: any = { ...createCheckDto, userId: userId };
      const check = this.checkRepository.create(body);
      const savedCheck: any = await this.checkRepository.save(check);

      const reportBody: any = { checkId: savedCheck.id, userId: userId };
      const report = this.reportRepository.create(reportBody);
      const savedReport = await this.reportRepository.save(report);

      const user: any = await this.userService.findOne(userId);
      this.eventEmitter.emit('createCheck', {
        savedCheck,
        savedReport,
        user_email: user.email,
      });

      return check;
    } catch (err) {
      throw new BadRequestException('check_creation_failed');
    }
  }

  async findAll(userId: string) {
    return await this.checkRepository.find({
      where: { userId: userId } as unknown,
    });
  }

  async findOne(id: string) {
    const check = await this.checkRepository.findOneBy({ id: id });
    if (!check) throw new NotFoundException('check_not_found');
    return check;
  }

  update(id: string, updateCheckDto: UpdateCheckDto) {
    return `This action updates a #${id} check`;
  }

  async remove(id: string) {
    const check = await this.checkRepository.findOneBy({ id: id });
    if (check) {
      try {
        await this.checkRepository.delete(id);
        return 1;
      } catch (err) {
        throw new BadRequestException('error_on_removing_check');
      }
    } else {
      throw new NotFoundException('check_not_found');
    }
  }
}
