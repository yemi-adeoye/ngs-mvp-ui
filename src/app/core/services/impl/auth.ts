import { inject, Service, signal } from '@angular/core';
import { IAuthService } from '../iauth';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../../../models/register-request';
import environment from '../../../environment/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { RegisterResponse } from '../../../models/register-reponse';
import { LoginRequest } from '../../../models/login-request';
import { LoginResponse } from '../../../models/login-response';
import { Router } from '@angular/router';

@Service()
export class AuthService implements IAuthService {
  private router = inject(Router)

  authState = signal<'authenticated' | 'pending' | 'anonymous'>('pending')
  accessToken = signal<string>('')

  refresh(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${environment.BACKEND_URL}/auth/refresh`, { withCredentials: true })
  }

  private readonly http = inject(HttpClient)

  login(request: LoginRequest): Observable<LoginResponse> {
    console.log(request)
    return this.http.post<LoginResponse>(`${environment.BACKEND_URL}/auth/login`, request, { withCredentials: true })
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.BACKEND_URL}/auth/register`, request,)
  }

  verifyAuthentication() {
    if (this.authState() === 'anonymous') {
      return of(this.router.createUrlTree(['']));
    }

    if (this.authState() === 'authenticated') {
      return true
    }

    return this.tryRefresh(true, this.router.createUrlTree(['']))
  }

  tryRefresh(valOnSuccess: any, valOnError: any) {
    return this.refresh().pipe(
      map(response => {
        this.authState.set('authenticated')
        this.accessToken.set(response.access_token)
        return valOnSuccess
      }),
      catchError(() => {
        return of(valOnError);
      })
    )
  }
}
