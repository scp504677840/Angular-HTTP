import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {UsersComponent} from './users/users.component';
import {UserSearchComponent} from './users/user-search/user-search.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
