import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * 清空请求体
 * 有时你需要清空请求体，而不是替换它。
 * 如果你把克隆后的请求体设置成 undefined，
 * Angular 会认为你是想让这个请求体保持原样。 这显然不是你想要的。
 * 但如果把克隆后的请求体设置成 null，那 Angular 就知道你是想清空这个请求体了。
 * newReq = req.clone({ ... }); // 请求体没有提取 => 保持原请求体
 * newReq = req.clone({ body: undefined }); // 保持原请求体
 * newReq = req.clone({ body: null }); // 清空请求体
 */
@Injectable()
export class TrimNameInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const body = req.body;
    if (!body || !body.name) {
      return next.handle(req);
    }
    // 复制正文并从name属性中修剪空格
    const newBody = {...body, name: body.name.trim()};
    // 克隆请求并设置其正文
    const newReq = req.clone({body: newBody});
    // 将克隆的请求发送到下一个处理程序。
    return next.handle(newReq);
  }
}
