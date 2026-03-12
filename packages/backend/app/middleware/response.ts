// Spec: specs/api/auth.spec.md (全模块通用基础设施)
// 统一响应包装中间件：将 ctx.body 包装为 { code, message, data }
import { Context } from 'egg';

export default () => {
  return async function responseMiddleware(ctx: Context, next: () => Promise<void>) {
    await next();

    // 仅处理成功响应（2xx）且 body 不为空
    if (ctx.status >= 200 && ctx.status < 300 && ctx.body !== undefined) {
      const statusCode = ctx.status;
      const code = statusCode === 201 ? 201 : 200;
      const message = code === 201 ? 'created' : 'success';
      ctx.body = { code, message, data: ctx.body ?? null };
      // 统一输出 200 HTTP 状态（业务状态码在 body.code 中）
      ctx.status = 200;
    }
  };
};
