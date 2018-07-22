import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {UsersComponent} from './users/users.component';
import {UserSearchComponent} from './users/user-search/user-search.component';
import {httpInterceptorProviders} from './http-interceptors';
import {UploaderComponent} from './uploader/uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchComponent,
    UploaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
