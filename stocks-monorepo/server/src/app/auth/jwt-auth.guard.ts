import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../guards/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;

    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      req.user = {
        userId: payload.sub,
        email: payload.email,
      };
      return true;
    } catch (e: any) {
      return false;
    }
  }
}
