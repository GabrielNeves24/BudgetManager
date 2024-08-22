import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private readonly tokenKey = 'authToken';
  private apiUrl = 'https://plataforma-orcamentos.somee.com/api';
  //private apiUrl = 'https://localhost:7231/api';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
    ) { }


  getApiUrl(): string {
    return this.apiUrl || '';
  }
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  logout(): void {
    this.clearToken();
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }
  clearLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('empresa');
      localStorage.removeItem('userId');
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/Home']);
    }
  }

  onLogin(obj: any): Observable<any> {
    const json = JSON.stringify(obj);
    return this.http.post<any>(`${this.apiUrl}/User/Login`, json, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'UTF-8'
      },
      withCredentials: true
    }).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token);
          //set local storage
          localStorage.setItem('user', res.user);
          this.toastr.success('Login successful');
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(this.handleError)
    );
  }

  canActivate(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Occorreu um erro. Por favor, tente novamente.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'O Servidor não está disponível. Por favor, tente mais tarde.';
      } else {
        errorMessage = `Erro (${error.status}): ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  checkIfUserIsAdmin(): boolean {
    let user = JSON.parse(localStorage.getItem('user') as string);
    if (user.role !== 'A') {
      this.toastr.error('Sem permissões', 'Acesso negado');
      //navigate to the home page
      this.router.navigate(['/budget']);
      return false;
    }
    return true;
  }
}
