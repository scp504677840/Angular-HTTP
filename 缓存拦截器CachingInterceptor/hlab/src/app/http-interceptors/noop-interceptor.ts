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
 *
 * HttpEvents
 * 你可能会期望 intercept() 和 handle() 方法会像大多数 HttpClient 中的方法那样返回 HttpResponse<any> 的可观察对象。
 * 然而并没有，它们返回的是 HttpEvent<any> 的可观察对象。
 * 这是因为拦截器工作的层级比那些 HttpClient 方法更低一些。
 * 每个 HTTP 请求都可能会生成很多个事件，包括上传和下载的进度事件。
 * 实际上，HttpResponse 类本身就是一个事件，它的类型（type）是 HttpEventType.HttpResponseEvent。
 *
 * 很多拦截器只关心发出的请求，而对 next.handle() 返回的事件流不会做任何修改。
 *
 * 但那些要检查和修改来自 next.handle() 的响应体的拦截器希望看到所有这些事件。
 * 所以，你的拦截器应该返回你没碰过的所有事件，除非你有充分的理由不这么做。
 *
 * 不可变性
 * 虽然拦截器有能力改变请求和响应，但 HttpRequest 和 HttpResponse 实例的属性却是只读（readonly）的，
 * 因此，它们在很大意义上说是不可变对象。
 *
 * 有充足的理由把它们做成不可变对象：应用可能会重试发送很多次请求之后才能成功，
 * 这就意味着这个拦截器链表可能会多次重复处理同一个请求。
 * 如果拦截器可以修改原始的请求对象，
 * 那么重试阶段的操作就会从修改过的请求开始，而不是原始请求。
 * 而这种不可变性，可以确保这些拦截器在每次重试时看到的都是同样的原始请求。
 *
 * 通过把 HttpRequest 的属性设置为只读的，TypeScript 可以防止你犯这种错误。
 * // Typescript不允许以下赋值，因为req.url是readonly
 * req.url = req.url.replace('http://', 'https://');
 *
 * 要想修改该请求，就要先克隆它，并修改这个克隆体，然后再把这个克隆体传给 next.handle()。
 * 你可以用一步操作中完成对请求的克隆和修改，例子如下：
 * // clone request and replace 'http://' with 'https://' at the same time
 *  const secureReq = req.clone({
 *   url: req.url.replace('http://', 'https://')
 * });
 *  // send the cloned, "secure" request to the next handler.
 *  return next.handle(secureReq);
 * 这个 clone() 方法的哈希型参数允许你在复制出克隆体的同时改变该请求的某些特定属性。
 * @see EnsureHttpsInterceptor
 *
 * 请求体
 * readonly 这种赋值保护，无法防范深修改（修改子对象的属性），也不能防范你修改请求体对象中的属性。
 * req.body.name = req.body.name.trim(); // 馊主意！
 * 如果你必须修改请求体，那么就要先复制它，然后修改这个复本，clone() 这个请求，
 * 然后把这个请求体的复本作为新的请求体，例子如下：
 * // 复制正文并从name属性中修剪空格
 * const newBody = { ...body, name: body.name.trim() };
 * // 克隆请求并设置其正文
 * const newReq = req.clone({ body: newBody });
 * // 将克隆的请求发送到下一个处理程序。
 * return next.handle(newReq);
 *
 * 设置默认请求头
 * 应用通常会使用拦截器来设置外发请求的默认请求头。
 *
 * 该范例应用具有一个 AuthService，它会生成一个认证令牌。
 * 在这里，AuthInterceptor 会注入该服务以获取令牌，并对每一个外发的请求添加一个带有该令牌的认证头：
 */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    console.log('NoopInterceptor');
    return next.handle(req);
  }
}
