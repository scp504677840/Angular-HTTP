/* "Barrel" of Http Interceptors */
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {NoopInterceptor} from './noop-interceptor';
import {Injectable} from '@angular/core';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true},
];
