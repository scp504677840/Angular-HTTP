import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

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
