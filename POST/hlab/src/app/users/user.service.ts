import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {UserInfo} from './user-info';
import {Observable, throwError} from 'rxjs';
import {catchError, retry, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

/**
 * 为什么要写服务
 * 这个例子太简单，所以它也可以在组件本身的代码中调用 Http.get()，而不用借助服务。
 *
 * 不过，数据访问很少能一直这么简单。
 * 你通常要对数据做后处理、添加错误处理器，还可能加一些重试逻辑，以便应对网络抽风的情况。
 *
 * 该组件很快就会因为这些数据方式的细节而变得杂乱不堪。
 * 组件变得难以理解、难以测试，并且这些数据访问逻辑无法被复用，也无法标准化。
 *
 * 这就是为什么最佳实践中要求把数据展现逻辑从数据访问逻辑中拆分出去，
 * 也就是说把数据访问逻辑包装进一个单独的服务中，
 * 并且在组件中把数据访问逻辑委托给这个服务。
 * 就算是这么简单的应用也要如此。
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:8080/heroes';
  private downloadUrl = 'http://localhost:8080/download';
  private saveUrl = 'http://localhost:8080/save';

  constructor(private http: HttpClient) {
  }

  listUsers() {
    return this.http.get<UserInfo[]>(this.usersUrl)
      .pipe(retry(3), catchError(this.handleError));
  }

  listUsersResponse(): Observable<HttpResponse<UserInfo[]>> {
    return this.http.get<UserInfo[]>(this.usersUrl, {observe: 'response'})
      .pipe(retry(3), catchError(this.handleError));
  }

  getTextFile() {
    console.log('call');
    return this.http.get(this.downloadUrl, {responseType: 'text'})
      .pipe(tap(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      ));
  }

  saveUserInfo(userInfo: UserInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.saveUrl, userInfo, httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * 错误处理器
   * 注意，该处理器返回一个带有用户友好的错误信息的 RxJS ErrorObservable 对象。
   * 该服务的消费者期望服务的方法返回某种形式的 Observable，就算是“错误的”也可以。
   *
   * 现在，你获取了由 HttpClient 方法返回的 Observable，并把它们通过管道传给错误处理器。
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {

    // 如果是ErrorEvent类型
    if (error.error instanceof ErrorEvent) {
      // 发生客户端或网络错误。 相应地处理它。
      console.error('An error occurred:', error.error.message);
    } else {
      // 后端返回了一个不成功的响应代码。
      console.error(`Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // 返回带有面向用户的错误消息的observable
    return throwError('网络异常，请稍后再试。');

  }

}
