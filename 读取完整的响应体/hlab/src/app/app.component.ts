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
