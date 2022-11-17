import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.reportService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/:userId')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(id, updateReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:userId')
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
