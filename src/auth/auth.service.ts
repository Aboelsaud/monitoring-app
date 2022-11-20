import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserInput } from '../user/dto/create-user.input';
import { UserService } from '../user/user.service';
import { sendEmail } from '../utils/sendEmail';
import { AuthHelper } from './auth.helper';
import { AuthToken } from './auth.token';
import { LoginAuthInput } from './dto/login-auth.input';
import VerificationTokenPayload from './interfaces/verificationTokenPayload.interface';
import { jwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService extends AuthToken {
  constructor(
    private userService: UserService,
    protected jwtService: JwtService,
  ) {
    super(jwtService);
  }

  async signUp(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = await this.userService.createUser(createUserInput);
      this.sendVerificationLink(user.email);
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  async login(loginUser: LoginAuthInput): Promise<any> {
    const password = loginUser.password;
    const user = await this.userService.findOneByQuery({
      where: { email: loginUser.email },
    });
    if (user) {
      if (user.isEmailConfirmed) {
        if (!AuthHelper.validate(password, user.password))
          throw new UnauthorizedException('wrong_password');

        const { token } = await this.generateAuthUser(user.id, user.email);

        return { user, token };
      } else {
        throw new UnauthorizedException('email_not_verified');
      }
    } else {
      throw new NotFoundException('user_not_found');
    }
  }

  async validateUser(payload: jwtDto): Promise<boolean | User> {
    try {
      const user = await this.userService.findOneByQuery({
        where: { id: payload.userId, email: payload.email },
      });
      return user;
    } catch (_error) {
      return false;
    }
  }

  async generateAuthUser(userId: string, email: string): Promise<any> {
    try {
      const token = this.generateToken(userId, email);
      return { token };
    } catch (error) {
      return error;
    }
  }
  private sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`,
    });
    const url = `http://localhost:3000/auth/confirm?token=${token}`;
    sendEmail(url, email);
    return { message: 'email has been sent' };
  }
  public async confirmEmail(token: string) {
    const email = await this.decodeConfirmationToken(token);
    const user = await this.userService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    return await this.userService.markEmailAsConfirmed(email);
  }
  private async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
