import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthToken {
  constructor(protected jwtService: JwtService) {}

  //------------ TOKEN ------------//
  protected generateToken(userId: string, email: string) {
    const payload: jwtDto = { userId, email };
    return this.jwtService.sign(payload, {
      secret: process.env.AUTH_SECRET,
      expiresIn: process.env.AUTH_EXPIRES,
    });
  }
}
