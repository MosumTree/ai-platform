// Spec: specs/api/auth.spec.md
import { Service } from 'egg';

export default class AuthService extends Service {
  async ssoCallback(_code: string): Promise<null> {
    // TODO: 用 code 换取 SSO 用户信息，写库后签发 JWT
    return null;
  }

  async refreshToken(_refreshToken: string): Promise<null> {
    // TODO: 验证 refreshToken，签发新的 accessToken + refreshToken
    return null;
  }

  async getMe(_userId: number): Promise<null> {
    // TODO: 查库返回当前用户信息
    return null;
  }

  async logout(_userId: number): Promise<null> {
    // TODO: 使 refreshToken 失效
    return null;
  }
}
