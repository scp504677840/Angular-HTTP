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
 *
 * retry()
 * 有时候，错误只是临时性的，只要重试就可能会自动消失。
 * 比如，在移动端场景中可能会遇到网络中断的情况，只要重试一下就能拿到正确的结果。
 *
 * RxJS 库提供了几个 retry 操作符，它们值得仔细看看。
 * 其中最简单的是 retry()，它可以对失败的 Observable 自动重新订阅几次。
 * 对 HttpClient 方法调用的结果进行重新订阅会导致重新发起 HTTP 请求。
 *
 * 把它插入到 HttpClient 方法结果的管道中，就放在错误处理器的紧前面。
 * getConfig() {
 *    return this.http.get<Config>(this.configUrl)
 *    .pipe(
 *        retry(3), // retry a failed request up to 3 times
 *        catchError(this.handleError) // then handle the error
 *     );
 * }
 *
 * 可观察对象 (Observable) 与操作符 (operator)
 * 本章的前一节中引用了 RxJS 的 Observable 和 operator，比如 catchError 和 retry。
 * 接下来你还会遇到更多 RxJS 中的概念。
 * RxJS 是一个库，用于把异步调用和基于回调的代码组合成函数式（functional）的、响应式（reactive）的风格。
 * 很多 Angular API，包括 HttpClient 都会生成和消费 RxJS 的 Observable。
 *
 * RxJS 本身超出了本章的范围。你可以在网络上找到更多的学习资源。
 * 虽然只用少量的 RxJS 知识就可以获得解决方案，不过以后你会逐步提高 RxJS 技能，以便更高效的使用 HttpClient。
 *
 * 如果你在跟着教程敲下面这些代码片段，要注意你要自己导入这里出现的 RxJS 的可观察对象和操作符。
 * 就像 ConfigService 中的这些导入。
 * import { Observable, throwError } from 'rxjs';
 * import { catchError, retry } from 'rxjs/operators';
 *
 * 请求非 JSON 格式的数据
 * 不是所有的 API 都会返回 JSON 数据。
 * 在下面这个例子中，DownloaderService 中的方法会从服务器读取文本文件，
 * 并把文件的内容记录下来，然后把这些内容使用 Observable<string> 的形式返回给调用者。
 * getTextFile(filename: string) {
 *    // get（）返回的Observable是Observable <string>类型
 *    // 因为指定了文本响应。
 *    // 不需要将<string>类型参数传递给get（）。
 *    return this.http.get(filename, {responseType: 'text'})
 *        .pipe(
 *            tap( // Log the result or error
 *            data => this.log(filename, data),
 *            error => this.logError(filename, error)
 *        )
 *    );
 * }
 * 这里的 HttpClient.get() 返回字符串而不是默认的 JSON 对象，因为它的 responseType 选项是 'text'。
 * RxJS 的 tap 操作符（可看做 wiretap - 窃听），让这段代码探查由可观察对象传过来的正确值和错误值，而不用打扰它们。
 * 在 DownloaderComponent 中的 download() 方法通过订阅这个服务中的方法来发起一次请求。
 * download() {
 *    this.downloaderService.getTextFile('assets/textfile.txt').subscribe(results => this.contents = results);
 * }
 *
 * 把数据发送到服务器
 * 除了从服务器获取数据之外，HttpClient 还支持修改型的请求，也就是说，
 * 通过 PUT、POST、DELETE 这样的 HTTP 方法把数据发送到服务器。
 *
 * 本指南中的这个范例应用包括一个简化版本的《英雄指南》，它会获取英雄数据，并允许用户添加、删除和修改它们。
 * 下面的这些章节中包括该范例的 HeroesService 中的一些方法片段。
 *
 * 添加请求头
 * 很多服务器在进行保存型操作时需要额外的请求头。
 * 比如，它们可能需要一个 Content-Type 头来显式定义请求体的 MIME 类型。
 * 也可能服务器会需要一个认证用的令牌（token）。
 *
 * HeroesService 在 httpOptions 对象中就定义了一些这样的请求头，并把它传给每个 HttpClient 的保存型方法。
 * const httpOptions = {
 *    headers: new HttpHeaders({
 *        'Content-Type':  'application/json',
 *        'Authorization': 'my-auth-token'
 *    })
 * };
 *
 * 发起一个 POST 请求
 * 应用经常把数据 POST 到服务器。
 * 它们会在提交表单时进行 POST。
 * 下面这个例子中，HeroesService 在把英雄添加到数据库中时，就会使用 POST。
 * addHero (hero: Hero): Observable<Hero> {
 *   return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
 *     .pipe(
 *       catchError(this.handleError('addHero', hero))
 *     );
 * }
 * HttpClient.post() 方法像 get() 一样也有类型参数（你会希望服务器返回一个新的英雄对象），它包含一个资源 URL。
 * 它还接受另外两个参数：
 * - hero - 要 POST 的请求体数据。
 * - httpOptions - 这个例子中，该方法的选项指定了所需的请求头。
 * 当然，它捕获错误的方式很像前面描述的操作方式。
 * HeroesComponent 通过订阅该服务方法返回的 Observable 发起了一次实际的 POST 操作。
 * this.heroesService.addHero(newHero).subscribe(hero => this.heroes.push(hero));
 *
 * 发起 DELETE 请求
 * 该应用可以把英雄的 id 传给 HttpClient.delete 方法的请求 URL 来删除一个英雄。
 * deleteHero (id: number): Observable<{}> {
 *   const url = `${this.heroesUrl}/${id}`; // DELETE api/heroes/42
 * return this.http.delete(url, httpOptions)
 *   .pipe(
 *     catchError(this.handleError('deleteHero'))
 *   );
 * }
 * 当 HeroesComponent 订阅了该服务方法返回的 Observable 时，就会发起一次实际的 DELETE 操作。
 * this.heroesService.deleteHero(hero.id).subscribe();
 * 该组件不会等待删除操作的结果，所以它的 subscribe （订阅）中没有回调函数。
 * 不过就算你不关心结果，也仍然要订阅它。
 * 调用 subscribe() 方法会执行这个可观察对象，这时才会真的发起 DELETE 请求。
 *
 * 你必须调用 subscribe()，否则什么都不会发生。仅仅调用 HeroesService.deleteHero() 是不会发起 DELETE 请求的。
 *
 * 发起 PUT 请求
 * 应用可以发送 PUT 请求，来使用修改后的数据完全替换掉一个资源。 下面的 HeroesService 例子和 POST 的例子很像。
 * updateHero (hero: Hero): Observable<Hero> {
 *   return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
 *     .pipe(
 *       catchError(this.handleError('updateHero', hero))
 *     );
 * }
 * 因为前面解释过的原因，
 * 调用者（这里是 HeroesComponent.update()）必须 subscribe() 由 HttpClient.put() 返回的可观察对象，以发起这个调用。
 *
 * 高级用法
 * 我们已经讨论了 @angular/common/http 的基本 HTTP 功能，但有时候除了单纯发起请求和取回数据之外，你还要再做点别的。
 *
 * 配置请求
 * 待发送请求的其它方面可以通过传给 HttpClient 方法最后一个参数中的配置对象进行配置。
 * 以前你曾在 HeroesService 中通过在其保存方法中传入配置对象 httpOptions 设置过默认头。 你还可以做更多。
 *
 * 修改这些头
 * 你没法直接修改前述配置对象中的现有头，因为这个 HttpHeaders 类的实例是不可变的。
 * 改用 set() 方法代替。 它会返回当前实例的一份克隆，其中应用了这些新修改。
 * 比如在发起下一个请求之前，如果旧的令牌已经过期了，你可能还要修改认证头。
 * httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
 *
 * URL 参数
 * 添加 URL 搜索参数也与此类似。
 * 这里的 searchHeroes 方法会查询名字中包含搜索词的英雄列表。
 * searchHeroes(term: string): Observable<Hero[]> {
 *   term = term.trim();
 *
 *   // Add safe, URL encoded search parameter if there is a search term
 *   const options = term ?
 *    { params: new HttpParams().set('name', term) } : {};
 *
 *   return this.http.get<Hero[]>(this.heroesUrl, options)
 *     .pipe(
 *       catchError(this.handleError<Hero[]>('searchHeroes', []))
 *     );
 * }
 * 如果有搜索词，这段代码就会构造一个包含进行过 URL 编码的搜索词的选项对象。
 * 如果这个搜索词是“foo”，这个 GET 请求的 URL 就会是 api/heroes/?name=foo。
 *
 * HttpParams 是不可变的，所以你也要使用 set() 方法来修改这些选项。
 *
 * 请求的防抖（debounce）
 * 这个例子还包含了搜索 npm 包的特性。
 *
 * 当用户在搜索框中输入名字时，PackageSearchComponent 就会把一个根据名字搜索包的请求发送给 NPM 的 web api。
 * 下面是模板中的相关代码片段：
 * <input (keyup)="search($event.target.value)" id="name" placeholder="Search"/>
 *
 *  <ul>
 *    <li *ngFor="let package of users$ | async">
 *      <b>{{package.name}} v.{{package.version}}</b> -
 *      <i>{{package.description}}</i>
 *    </li>
 *  </ul>
 *  (keyup) 事件绑定把每次击键都发送给了组件的 search() 方法。
 *  如果每次击键都发送一次请求就太昂贵了。
 *  最好能等到用户停止输入时才发送请求。
 *  使用 RxJS 的操作符就能轻易实现它，参见下面的代码片段：
 *  @see UserSearchComponent
 *
 *  拦截请求和响应
 *  HTTP 拦截机制是 @angular/common/http 中的主要特性之一。
 *  使用这种拦截机制，你可以声明一些拦截器，用它们监视和转换从应用发送到服务器的 HTTP 请求。
 *  拦截器还可以用监视和转换从服务器返回到本应用的那些响应。
 *  多个选择器会构成一个“请求/响应处理器”的双向链表。
 *
 *  拦截器可以用一种常规的、标准的方式对每一次 HTTP 的请求/响应任务执行从认证到记日志等很多种隐式任务。
 *  如果没有拦截机制，那么开发人员将不得不对每次 HttpClient 调用显式实现这些任务。
 *
 *  编写拦截器
 *  要实现拦截器，就要实现一个实现了 HttpInterceptor 接口中的 intercept() 方法的类。
 *  这里是一个什么也不做的空白拦截器，它只会不做任何修改的传递这个请求。
 *  @see NoopInterceptor
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
