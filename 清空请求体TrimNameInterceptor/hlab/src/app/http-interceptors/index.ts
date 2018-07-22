/* "Barrel" of Http Interceptors */
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {NoopInterceptor} from './noop-interceptor';
import {Injectable} from '@angular/core';
import {EnsureHttpsInterceptor} from './ensure-https-interceptor';
import {TrimNameInterceptor} from './trim-name-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: TrimNameInterceptor, multi: true},
];
