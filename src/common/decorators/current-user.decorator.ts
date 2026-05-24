import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest, JwtPayload } from '../../utils/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
