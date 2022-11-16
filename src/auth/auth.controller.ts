import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthService } from './auth.service';
import { LoginAuthInput } from './dto/login-auth.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() signUpUserDto: LoginAuthInput) {
    return this.authService.login(signUpUserDto);
  }

  @Post('signUp')
  signUp(@Body() signUpUserDto: CreateUserInput): Promise<User> {
    return this.authService.signUp(signUpUserDto);
  }

  @Get('confirm')
  confirmEmail(@Query('token') token: any) {
    return this.authService.confirmEmail(token);
  }
}
