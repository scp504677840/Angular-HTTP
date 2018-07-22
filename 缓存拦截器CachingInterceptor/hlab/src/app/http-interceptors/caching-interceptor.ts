/**
 * 如果请求是可缓存的（例如，包搜索）并且响应在缓存中，则将缓存的响应返回为可观察的。
 * 如果'x-refresh'标头为true，则还使用next（）的响应重新运行包搜索，返回首先发出缓存响应的observable。
 *
 * 如果不在缓存中或不可缓存，请将请求传递给next（）
 */
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {startWith, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RequestCache, RequestCacheService} from '../request-cache.service';
import {searchUrl} from '../users/user-search/user-search.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 如果不可缓存则继续。
    if (!isCachable(req)) {
      return next.handle(req);
    }

    // 找到缓存
    const cachedResponse = this.cache.get(req);
    // 缓存是否需要刷新，根据x-refresh请求头判断
    if (req.headers.get('x-refresh')) {
      const results$ = sendRequest(req, next, this.cache);
      /**
       * 如果没有缓存的值，拦截器直接返回 result$。
       * 如果有缓存的值，这些代码就会把缓存的响应加入到 result$ 的管道中，
       * 使用重组后的可观察对象进行处理，并发出两次。
       * 先立即发出一次缓存的响应体，然后发出来自服务器的响应。
       * 订阅者将会看到一个包含这两个响应的序列。
       */
      return cachedResponse ?
        results$.pipe(startWith(cachedResponse)) :
        results$;
    }
    // 取出缓存，当有缓存时直接返回，否则发送请求。
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}

/**
 * 此请求是否可缓存？
 *
 * @param req
 */
function isCachable(req: HttpRequest<any>) {
  // 只有GET请求是可缓存的
  return req.method === 'GET' &&
    // 在这个应用程序中只能安装UserInfo搜索
    -1 < req.url.indexOf(searchUrl);
}

/**
 * 通过向`next（）`发送请求来获取服务器响应。
 * 最后添加对缓存的响应。
 */
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache): Observable<HttpEvent<any>> {

  // UserInfo搜索请求中不允许有请求头
  const noHeaderReq = req.clone({headers: new HttpHeaders()});

  return next.handle(noHeaderReq).pipe(
    tap(event => {
      // 除了HttpResponse之外，可能还有其他事件。
      if (event instanceof HttpResponse) {
        cache.put(req, event); // 更新缓存
      }
    })
  );
}
