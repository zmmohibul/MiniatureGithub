import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  userName: string;
  password: string;
}

interface SignupResponse {
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  rootUrl = 'https://localhost:5001/api';
  signedin$ = new BehaviorSubject(false);

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
      .post<SignupResponse>(`${this.rootUrl}/auth/register`, credentials)
      .pipe(
        tap(() => {
          this.signedin$.next(true);
        })
      )
  }
}
