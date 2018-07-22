import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {uploadUrl} from '../uploader/uploader.service';

/**
 * 模拟服务器回复文件上载请求
 */
@Injectable()
export class UploadInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 当不是上传文件时
    if (req.url.indexOf(uploadUrl) === -1) {
      return next.handle(req);
    }
    const delay = 300; // TODO: inject delay?
    return createUploadEvents(delay);
  }
}

/**
 * 创建上传事件流的模拟
 *
 * @param delay
 */
function createUploadEvents(delay: number) {
  // 模拟将在ProgressEvent中提供此信息的XHR行为

  /**
   * 块数
   */
  const chunks = 5;

  /**
   * 文件总大小
   */
  const total = 12345678;

  /**
   * 块大小
   */
  const chunkSize = Math.ceil(total / chunks);

  return new Observable<HttpEvent<any>>(observer => {
    // notify the event stream that the request was sent.
    observer.next({type: HttpEventType.Sent});

    uploadLoop(0);

    function uploadLoop(loaded: number) {
      // N.B.: Cannot use setInterval or rxjs delay (which uses setInterval)
      // because e2e test won't complete. A zone thing?
      // Use setTimeout and tail recursion instead.
      setTimeout(() => {
        loaded += chunkSize;

        if (loaded >= total) {
          const doneResponse = new HttpResponse({
            status: 201, // OK but no body;
          });
          observer.next(doneResponse);
          observer.complete();
          return;
        }

        const progressEvent: HttpProgressEvent = {
          type: HttpEventType.UploadProgress,
          loaded,
          total
        };
        observer.next(progressEvent);
        uploadLoop(loaded);
      }, delay);
    }
  });
}
