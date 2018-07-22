import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UserInfo} from './user-info';
import {Observable} from 'rxjs';

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

  usersUrl = 'http://localhost:8080/heroes';

  constructor(private http: HttpClient) {
  }

  listUsers() {
    return this.http.get<UserInfo[]>(this.usersUrl);
  }

  listUsersResponse(): Observable<HttpResponse<UserInfo[]>> {
    return this.http.get<UserInfo[]>(this.usersUrl, {observe: 'response'});
  }

}
