// Spec: specs/api/auth.spec.md (全模块通用基础设施)
import { EggAppConfig, PowerPartial } from 'egg';

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ai_platform',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

export default (): PowerPartial<EggAppConfig> => {
  return {
    // 关闭 CSRF（API 服务）
    security: {
      csrf: {
        enable: false,
      },
    },

    // CORS
    cors: {
      origin: (ctx: { get: (key: string) => string }) => {
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
        ];
        const origin = ctx.get('Origin');
        return allowedOrigins.includes(origin) ? origin : '';
      },
      credentials: true,
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    },

    // 中间件加载顺序
    middleware: ['errorHandler', 'response'],

    // 数据库配置（从环境变量读取）
    database: dbConfig,

    // JWT 配置
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback-secret-please-change',
      expiresIn: '8h',
    },

    // 端口
    cluster: {
      listen: {
        port: Number(process.env.PORT) || 3000,
      },
    },
  };
};
