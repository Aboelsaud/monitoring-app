import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';
import { In, Repository } from 'typeorm';
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
        user_email: user.email,
      });

      return check;
    } catch (err) {
      throw new BadRequestException('check_creation_failed');
    }
  }

  async findAll(userId: string) {
    return await this.checkRepository.find({
      where: { userId: userId },
    });
  }

  async findAllWithTags(userId: string, tags: string[]) {
    return await this.checkRepository.find({
      select: ['id'],
      where: {
        userId: userId,
        tags: In(tags),
      },
    });
  }

  async findOne(id: string, userId: string) {
    const check = await this.checkRepository.findOneBy({
      id: id,
      userId: userId,
    });
    if (!check) throw new NotFoundException('check_not_found');
    return check;
  }

  async update(id: string, updateCheckDto: UpdateCheckDto, userId: string) {
    const check = await this.checkRepository.findOneBy({
      id: id,
      userId: userId,
    });
    if (check) {
      try {
        const Check = await this.checkRepository.preload({
          id: id,
          ...updateCheckDto,
        });
        const user: any = await this.userService.findOne(Check.userId);

        const updatedCheck = await this.checkRepository.save(Check);
        this.eventEmitter.emit('updateCheck', {
          updatedCheck,
          user_email: user.email,
        });
        return updatedCheck;
      } catch (err) {
        throw new BadRequestException('error_on_removing_check');
      }
    } else {
      throw new NotFoundException('check_not_found');
    }
  }

  async remove(id: string, userId: string) {
    const check = await this.checkRepository.findOneBy({
      id: id,
      userId: userId,
    });

    if (check) {
      try {
        await this.checkRepository.delete(id);
        this.eventEmitter.emit('deleteCheck', id);
        return 1;
      } catch (err) {
        throw new BadRequestException('error_on_removing_check');
      }
    } else {
      throw new NotFoundException('check_not_found');
    }
  }
}
