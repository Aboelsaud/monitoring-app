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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  create(
    @Body() createCheckDto: CreateCheckDto,
    @Param('userId') userId: string,
  ) {
    return this.checkService.create(createCheckDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.checkService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/:userId')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/:userId')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    return this.checkService.update(id, updateCheckDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:userId')
  remove(@Param('id') id: string) {
    return this.checkService.remove(id);
  }
}
