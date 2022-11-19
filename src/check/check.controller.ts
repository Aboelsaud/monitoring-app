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
  @Post()
  create(
    @Body() createCheckDto: CreateCheckDto,
    @Body('userId') userId: string,
  ) {
    return this.checkService.create(createCheckDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Body('userId') userId: string) {
    return this.checkService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Body('userId') userId: string) {
    return this.checkService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckDto: UpdateCheckDto,
    @Body('userId') userId: string,
  ) {
    return this.checkService.update(id, updateCheckDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.checkService.remove(id, userId);
  }
}
