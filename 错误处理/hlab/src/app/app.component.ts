import {Component} from '@angular/core';

/**
 * HttpClient
 * 大多数前端应用都需要通过 HTTP 协议与后端服务器通讯。
 * 现代浏览器支持使用两种不同的 API 发起 HTTP 请求：XMLHttpRequest 接口和 fetch() API。
 *
 * @angular/common/http 中的 HttpClient 类为 Angular 应用程序提供了一个简化的 API 来实现 HTTP 客户端功能。
 * 它基于浏览器提供的 XMLHttpRequest 接口。
 * HttpClient 带来的其它优点包括：可测试性、强类型的请求和响应对象、
 * 发起请求与接收响应时的拦截器支持，以及更好的、基于可观察（Observable）对象的 API 以及流式错误处理机制。
 *
 * 要想使用 HttpClient，就要先导入 Angular 的 HttpClientModule。大多数应用都会在根模块 AppModule 中导入它。
 *
 * 带类型检查的响应
 * 该订阅的回调需要用通过括号中的语句来提取数据的值。
 * .subscribe((data: Config) => this.config = {
 *    heroesUrl: data['heroesUrl'],
 *    textfile:  data['textfile']
 * });
 * 你没法写成 data.heroesUrl ，因为 TypeScript 会报告说来自服务器的 data 对象中没有名叫 heroesUrl 的属性。
 * 这是因为 HttpClient.get() 方法把 JSON 响应体解析成了匿名的 Object 类型。它不知道该对象的具体形态如何。
 * 你可以告诉 HttpClient 该响应体的类型，以便让对这种输出的消费更容易、更明确。
 * getConfig() {
 *    return this.http.get<Config>(this.configUrl);
 * }
 *
 * 读取完整的响应体
 * 响应体可能并不包含你需要的全部信息。
 * 有时候服务器会返回一个特殊的响应头或状态码，以标记出特定的条件，因此读取它们可能是必要的。
 *
 * 要这样做，你就要通过 observe 选项来告诉 HttpClient，你想要完整的响应信息，而不是只有响应体：
 * getConfigResponse(): Observable<HttpResponse<Config>> {
 *    return this.http.get<Config>(this.configUrl, { observe: 'response' });
 * }
 * 现在 HttpClient.get() 会返回一个 HttpResponse 类型的 Observable，而不只是 JSON 数据。
 *
 * 错误处理
 * 如果这个请求导致了服务器错误怎么办？
 * 甚至，在烂网络下请求都没到服务器该怎么办？
 * HttpClient 就会返回一个错误（error）而不再是成功的响应。
 *
 * 通过在 .subscribe() 中添加第二个回调函数，你可以在组件中处理它：
 * subscribe(
 * (data: Config) => this.config = { ...data }, // success path
 * error => this.error = error // error path);
 * 在数据访问失败时给用户一些反馈，确实是个好主意。
 * 不过，直接显示由 HttpClient 返回的原始错误数据还远远不够。
 *
 * 获取错误详情
 * 检测错误的发生是第一步，不过如果知道具体发生了什么错误才会更有用。
 * 上面例子中传给回调函数的 err 参数的类型是 HttpErrorResponse，它包含了这个错误中一些很有用的信息。
 * 可能发生的错误分为两种。如果后端返回了一个失败的返回码（如 404、500 等），它会返回一个错误响应体。
 *
 * 或者，如果在客户端这边出了错误（比如在 RxJS 操作符 (operator) 中抛出的异常或某些阻碍完成这个请求的网络错误），
 * 就会抛出一个 Error 类型的异常。
 *
 * HttpClient 会在 HttpErrorResponse 中捕获所有类型的错误信息，你可以查看这个响应体以了解到底发生了什么。
 * 错误的探查、解释和解决是你应该在服务中做的事情，而不是在组件中。
 * 你可能首先要设计一个错误处理器，就像这样：
 * @see UserService.handleError
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
  }

}
