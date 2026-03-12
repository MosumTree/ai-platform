// Spec: specs/api/auth.spec.md (全模块通用基础设施)
// JWT 解析中间件：从 Authorization Header 解析 Bearer Token，写入 ctx.state.user
import { Context } from 'egg';
import * as jwt from 'jsonwebtoken';
import { UserRole } from 'shared';

interface AppJwtPayload {
  sub: number;
  role: UserRole;
  permissions: string[];
}

export default () => {
  return async function jwtMiddleware(ctx: Context, next: () => Promise<void>) {
    const authorization = ctx.get('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7);
      try {
        const secret = (ctx.app.config as unknown as { jwt: { secret: string } }).jwt.secret;
        const payload = jwt.verify(token, secret) as unknown as AppJwtPayload;
        ctx.state.user = {
          id: payload.sub,
          role: payload.role,
          permissions: payload.permissions || [],
        };
      } catch {
        // Token 无效时不报错，只清空 user，各路由自行决定是否要求登录
        ctx.state.user = null;
      }
    }
    await next();
  };
};
