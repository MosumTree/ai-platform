// Spec: specs/api/auth.spec.md
import { Controller } from 'egg';
import AuthService from '../service/auth';

export default class AuthController extends Controller {
  private get svc(): AuthService {
    return (this.ctx.service as unknown as { auth: AuthService }).auth;
  }

  // GET /api/auth/callback - SSO 回调
  async callback() {
    const { ctx } = this;
    const code = ctx.query.code as string;
    ctx.body = await this.svc.ssoCallback(code);
  }

  // POST /api/auth/refresh - 刷新 Token
  async refresh() {
    const { ctx } = this;
    const { refreshToken } = ctx.request.body as { refreshToken: string };
    if (!refreshToken) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'refreshToken 不能为空', data: null };
      return;
    }
    ctx.body = await this.svc.refreshToken(refreshToken);
  }

  // GET /api/auth/me - 获取当前用户（需要 JWT）
  async me() {
    const { ctx } = this;
    const user = ctx.state.user as { id: number } | null;
    if (!user) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录', data: null };
      return;
    }
    ctx.body = await this.svc.getMe(user.id);
  }

  // POST /api/auth/logout - 退出（需要 JWT）
  async logout() {
    const { ctx } = this;
    const user = ctx.state.user as { id: number } | null;
    if (!user) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录', data: null };
      return;
    }
    ctx.body = await this.svc.logout(user.id);
  }
}
