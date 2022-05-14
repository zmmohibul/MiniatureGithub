import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, tap } from 'rxjs';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  userName: string;
  password: string;
}

interface SigninCredentials {
  userName: string;
  password: string;
}

export interface User {
  userName: string;
  createdAt: Date;
  token: string;
}

interface SignupResponse {
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  rootUrl = 'http://localhost:5000/api';
  signedin$ = new BehaviorSubject(false);
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  usernameAvailable(username: string) {
    return this.http.post<UsernameAvailableResponse>(
      `${this.rootUrl}/auth/username`,
      {
        userName: username
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http
      .post<User>(`${this.rootUrl}/auth/register`, credentials)
      .pipe(
        tap((user: User) => {
          this.setCurrentUser(user);
          this.signedin$.next(true);
        })
      )
  }

  signin(credentials: SigninCredentials) {
    return this.http
        .post<User>(`${this.rootUrl}/auth/login`, credentials)
        .pipe(
          tap((user: User) => {
            this.setCurrentUser(user);
            this.signedin$.next(true);
          })
        )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getAllUsers() {
    return this.http.get(`${this.rootUrl}/auth/allusers`);
  }
}
