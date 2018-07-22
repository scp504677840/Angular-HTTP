import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserInfo} from '../user-info';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {UserSearchService} from './user-search.service';

/**
 * searchText$ 是一个序列，包含用户输入到搜索框中的所有值。
 * 它定义成了 RxJS 的 Subject 对象，这表示它是一个多播 Observable，
 * 同时还可以自行调用 next(value) 来产生值。
 * search() 方法中就是这么做的。
 *
 * 除了把每个 searchText 的值都直接转发给 UserSearchService 之外，
 * ngOnInit() 中的代码还通过下列三个操作符对这些搜索值进行管道处理：
 * 1.debounceTime(500) - 等待，直到用户停止输入（这个例子中是停止 1/2 秒）。
 * 2.distinctUntilChanged() - 等待，直到搜索内容发生了变化。
 * 3.switchMap() - 把搜索请求发送给服务。
 *
 * 这些代码把 users$ 设置成了使用搜索结果组合出的 Observable 对象。
 * 模板中使用 AsyncPipe 订阅了 users$，一旦搜索结果的值发回来了，就显示这些搜索结果。
 *
 * 这样，只有当用户停止了输入且搜索值和以前不一样的时候，搜索值才会传给服务。
 *
 * 这种缓存并刷新的选项是由自定义的 x-refresh 头触发的。
 *
 * switchMap()
 * 这个 switchMap() 操作符有三个重要的特征：
 * 1.它的参数是一个返回 Observable 的函数。UserSearchService.search 会返回 Observable，其它数据服务也一样。
 * 2.如果以前的搜索结果仍然是在途状态（这会出现在慢速网络中），它会取消那个请求，并发起这个新的搜索。
 * 3.它会按照原始的请求顺序返回这些服务的响应，而不用关心服务器实际上是以乱序返回的它们。
 *
 * 如果你觉得将来会复用这些防抖逻辑，
 * 可以把它移到单独的工具函数中，
 * 或者移到 UserSearchService 中。
 */
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  withRefresh = false;
  users$: Observable<UserInfo[]>;
  private searchText$ = new Subject<string>();

  search(userName: string) {
    this.searchText$.next(userName);
  }

  ngOnInit() {
    this.users$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(userName =>
        this.searchService.search(userName, this.withRefresh))
    );
  }

  constructor(private searchService: UserSearchService) {
  }


  toggleRefresh() {
    this.withRefresh = !this.withRefresh;
  }

}
