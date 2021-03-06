import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {UserInfo} from './user-info';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userInfos: UserInfo[];

  headers: string[];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.listUsersResponse();
  }

  /**
   * 这个服务方法返回配置数据的 Observable 对象，所以组件要订阅（subscribe） 该方法的返回值。
   * 订阅时的回调函数会把这些数据字段复制到组件的 config 对象中，它会在组件的模板中绑定，以供显示。
   */
  listUsers() {
    this.userService.listUsers().subscribe((userInfos: UserInfo[]) => {
      this.userInfos = userInfos;
      console.log(this.userInfos);
    });
  }

  listUsersResponse() {
    this.userService.listUsersResponse().subscribe((resp: HttpResponse<UserInfo[]>) => {
      const keys = resp.headers.keys();
      this.headers = keys.map(key => `${key}: ${resp.headers.get(key)}`);
      this.userInfos = resp.body;
    });
  }

}
