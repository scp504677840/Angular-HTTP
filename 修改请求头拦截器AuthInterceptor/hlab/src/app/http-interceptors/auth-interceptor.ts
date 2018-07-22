import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../auth.service';

/**
 * 这种可以修改头的拦截器可以用于很多不同的操作，比如：
 * 认证 / 授权
 * 控制缓存行为。比如 If-Modified-Since
 * XSRF 防护
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 从服务中获取身份验证令牌。
    const authToken = this.auth.getAuthorizationToken();

    /*
    * 冗长的方式：
    // 克隆请求并替换原始标头
    // 克隆headers，使用授权进行更新。
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // 克隆请求并一步设置新Headers。
    const authReq = req.clone({setHeaders: {Authorization: authToken}});

    // 将带有Headers的克隆请求发送到下一个处理程序。
    return next.handle(authReq);
  }
}
