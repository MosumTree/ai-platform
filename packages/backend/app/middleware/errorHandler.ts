// Spec: specs/api/auth.spec.md (全模块通用基础设施)
// 全局异常处理中间件：捕获所有未处理错误，返回 { code, message, data: null }
import { Context } from 'egg';

export default () => {
  return async function errorHandlerMiddleware(ctx: Context, next: () => Promise<void>) {
    try {
      await next();
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      ctx.status = status;
      ctx.body = {
        code: status,
        message,
        data: null,
      };

      // 5xx 错误记录日志
      if (status >= 500) {
        ctx.logger.error('[ErrorHandler]', err);
      }
    }
  };
};
