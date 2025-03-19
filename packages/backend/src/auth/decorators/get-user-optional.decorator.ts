import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUserOptional = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      if (!(data in user)) {
        throw new UnauthorizedException(`User property ${data} not found`);
      }
      return user[data];
    }

    return user;
  },
);
