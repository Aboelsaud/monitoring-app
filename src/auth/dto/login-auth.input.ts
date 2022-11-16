import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
