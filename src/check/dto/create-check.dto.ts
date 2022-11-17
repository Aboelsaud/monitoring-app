import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Protocol } from '../entities/check.entity';

export class CreateCheckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  protocol: Protocol;

  @IsBoolean()
  ignoreSSL: boolean;
}
