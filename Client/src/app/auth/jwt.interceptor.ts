import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { AuthService, User } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;

    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      })
    }

    return next.handle(request);
  }
}
