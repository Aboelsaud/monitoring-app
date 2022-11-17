import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    try {
      const payload = this.jwtService.verify(jwt, {
        secret: process.env.AUTH_SECRET,
      });
      const userId = request.params.userId;
      if (payload.userId != userId) return false;
      return true;
    } catch (err) {
      throw new ForbiddenException('invalid auth token');
    }
  }
}
