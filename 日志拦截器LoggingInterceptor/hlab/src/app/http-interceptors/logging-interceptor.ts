import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {MessageService} from '../message.service';
import {finalize, tap} from 'rxjs/operators';

/**
 * 记日志
 * 因为拦截器可以同时处理请求和响应，所以它们也可以对整个 HTTP 操作进行计时和记录日志。
 * 考虑下面这个 LoggingInterceptor，
 * 它捕获请求的发起时间、响应的接收时间，并使用注入的 MessageService 来发送总共花费的时间。
 *
 * RxJS 的 tap 操作符会捕获请求成功了还是失败了。
 * RxJS 的 finalize 操作符无论在响应成功还是失败时都会调用（这是必须的），然后把结果汇报给 MessageService。
 * 在这个可观察对象的流中，无论是 tap 还是 finalize 接触过的值，都会照常发送给调用者。
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private messenger: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 开始请求时间
    const started = Date.now();
    // ok
    let ok: string;

    // 通过日志记录扩展服务器响应observable
    return next.handle(req)
      .pipe(
        tap(
          // 当有回应时成功; 忽略其他事件
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // 请求失败; 错误是HttpErrorResponse
          error => ok = 'failed'
        ),
        // 当响应可观察完成或错误时记录
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          this.messenger.add(msg);
        })
      );
  }
}
