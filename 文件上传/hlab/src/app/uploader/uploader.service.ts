import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {MessageService} from '../message.service';
import {catchError, last, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';

export const uploadUrl = 'http://localhost:8080/upload/file';

/**
 * 监听进度事件
 * 有时，应用会传输大量数据，并且这些传输可能会花费很长时间。
 * 典型的例子是文件上传。
 * 可以通过在传输过程中提供进度反馈，来提升用户体验。
 *
 * 要想开启进度事件的响应，你可以创建一个把 reportProgress 选项设置为 true 的 HttpRequest 实例，以开启进度跟踪事件。
 *
 * 这个范例应用中并没有一个用来接收上传的文件的真实的服务器。
 * app/http-interceptors/upload-interceptor.ts 中的 UploadInterceptor 会拦截并短路掉上传请求，
 * 改为返回一个带有各个模拟事件的可观察对象。
 */
@Injectable()
export class UploaderService {

  constructor(
    private http: HttpClient,
    private messenger: MessageService) {
  }

  // 如果上传多个文件，请更改为：
  // upload(files: FileList) {
  //   const formData = new FormData();
  //   files.forEach(f => formData.append(f.name, f));
  //   new HttpRequest('POST', uploadUrl, formData, {reportProgress: true});
  //   ...
  // }

  upload(file: File) {
    if (!file) {
      return;
    }

    // COULD HAVE WRITTEN:
    // return this.http.post(uploadUrl, file, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).pipe(

    // 表单数据，非常重要！！！
    const formData = new FormData();
    formData.append('file', file);

    // 创建将文件POST到上传的请求对象。
    // `reportProgress`选项告诉HttpClient监听并返回XHR进度事件。
    // 每个进度事件都会触发变更检测，所以，你应该只有当确实希望在 UI 中报告进度时才打开这个选项。
    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    // 接下来，把这个请求对象传给 HttpClient.request() 方法，
    // 它返回一个 HttpEvents 的 Observable，同样也可以在拦截器中处理这些事件。
    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
  }

  /**
   * 返回已发送，上传进度和响应事件的不同消息
   * getEventMessage 方法会解释事件流中的每一个 HttpEvent 类型。
   *
   * @param event
   * @param file
   */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */
  private handleError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      this.messenger.add(`${userMessage} ${message}`);

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

  private showProgress(message: string) {
    this.messenger.add(message);
  }
}
