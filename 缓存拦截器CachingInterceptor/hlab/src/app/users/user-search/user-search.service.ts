import {Injectable} from '@angular/core';
import {HandleError, HttpErrorHandlerService} from '../../http-error-handler.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserInfo} from '../user-info';

export const searchUrl = 'http://localhost:8080/users';

const httpOptions = {
  headers: new HttpHeaders({
    'x-refresh': 'true'
  })
};

/**
 * 创建HttpOptions
 *
 * @param userName
 * @param refresh
 */
function createHttpOptions(userName: string, refresh = false) {
  // npm package name search api
  // e.g., http://localhost:8080/users?name=dom
  const params = new HttpParams({fromObject: {name: userName}});
  const headerMap = refresh ? {'x-refresh': 'true'} : {};
  const headers = new HttpHeaders(headerMap);
  return {headers, params};
}

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  search(userName: string, refresh = false): Observable<UserInfo[]> {
    // 当用户名为空时
    if (!userName.trim()) {
      return of([]);
    }

    const options = createHttpOptions(userName, refresh);

    return this.http.get<UserInfo[]>(searchUrl, options).pipe(
      /*map((data: any) => {
        return data.results.map(entry => ({
            name: entry.name[0],
            version: entry.version[0],
            description: entry.description[0]
          } as UserInfo)
        );
      }),*/
      catchError(this.handleError('search', []))
    );
  }
}
