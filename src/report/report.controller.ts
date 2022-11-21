import { Controller, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Body('userId') userId: string, @Body('tag') tags?: string[]) {
    return this.reportService.findAll(userId, tags);
  }
}
