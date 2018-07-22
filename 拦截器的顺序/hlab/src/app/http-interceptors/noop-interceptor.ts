import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * intercept 方法会把请求转换成一个最终返回 HTTP 响应体的 Observable。
 * 在这个场景中，每个拦截器都完全能自己处理这个请求。
 *
 * 大多数拦截器拦截都会在传入时检查请求，
 * 然后把（可能被修改过的）请求转发给 next 对象的 handle() 方法，
 * 而 next 对象实现了 HttpHandler 接口。
 *
 * 像 intercept() 一样，handle() 方法也会把 HTTP 请求转换成 HttpEvents 组成的 Observable，
 * 它最终包含的是来自服务器的响应。
 * intercept() 函数可以检查这个可观察对象，并在把它返回给调用者之前修改它。
 *
 * 这个无操作的拦截器，会直接使用原始的请求调用 next.handle()，并返回它返回的可观察对象，而不做任何后续处理。
 *
 * next 对象
 * next 对象表示拦截器链表中的下一个拦截器。
 * 这个链表中的最后一个 next 对象就是 HttpClient 的后端处理器（backend handler），
 * 它会把请求发给服务器，并接收服务器的响应。
 *
 * 大多数的拦截器都会调用 next.handle()，
 * 以便这个请求流能走到下一个拦截器，并最终传给后端处理器。
 * 拦截器也可以不调用 next.handle()，
 * 使这个链路短路，并返回一个带有人工构造出来的服务器响应的 自己的 Observable。
 *
 * 这是一种常见的中间件模式，在像 Express.js 这样的框架中也会找到它。
 *
 * 提供这个拦截器
 * 这个 NoopInterceptor 就是一个由 Angular 依赖注入 (DI)系统管理的服务。
 * 像其它服务一样，你也必须先提供这个拦截器类，应用才能使用它。
 *
 * 由于拦截器是 HttpClient 服务的（可选）依赖，
 * 所以你必须在提供 HttpClient 的同一个（或其各级父注入器）注入器中提供这些拦截器。
 * 那些在 DI 创建完 HttpClient 之后再提供的拦截器将会被忽略。
 *
 * 由于在 AppModule 中导入了 HttpClientModule，
 * 导致本应用在其根注入器中提供了 HttpClient。所以你也同样要在 AppModule 中提供这些拦截器。
 *
 * 在从 @angular/common/http 中导入了 HTTP_INTERCEPTORS 注入令牌之后，
 * 编写如下的 NoopInterceptor 提供商注册语句：
 * { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
 * 注意 multi: true 选项。
 * 这个必须的选项会告诉 Angular HTTP_INTERCEPTORS 是一个多重提供商的令牌，
 * 表示它会注入一个多值的数组，而不是单一的值。
 *
 * 你也可以直接把这个提供商添加到 AppModule 中的提供商数组中，
 * 不过那样会非常啰嗦。
 * 况且，你将来还会用这种方式创建更多的拦截器并提供它们。
 * 你还要特别注意提供这些拦截器的顺序。
 *
 * 认真考虑创建一个封装桶（barrel）文件，
 * 用于把所有拦截器都收集起来，
 * 一起提供给 httpInterceptorProviders 数组，
 * 可以先从这个 NoopInterceptor 开始。
 * @see httpInterceptorProviders
 * 然后导入它，并把它加到 AppModule 的 providers 数组中，就像这样：
 * providers: [
 *  httpInterceptorProviders
 * ],
 * 当你再创建新的拦截器时，就同样把它们添加到 httpInterceptorProviders 数组中，而不用再修改 AppModule。
 *
 * 拦截器的顺序
 * Angular 会按照你提供它们的顺序应用这些拦截器。
 * 如果你提供拦截器的顺序是先 A，再 B，再 C，那么请求阶段的执行顺序就是 A->B->C，而响应阶段的执行顺序则是 C->B->A。
 *
 * 以后你就再也不能修改这些顺序或移除某些拦截器了。
 * 如果你需要动态启用或禁用某个拦截器，那就要在那个拦截器中自行实现这个功能。
 */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    console.log('NoopInterceptor');
    return next.handle(req);
  }
}
