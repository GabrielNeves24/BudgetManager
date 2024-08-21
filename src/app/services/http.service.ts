import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'; // Import the Router service

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router, // Inject the Router service
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.apiUrl = this.authService.getApiUrl();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Occoreu um erro inesperado, por favor tente novamente mais tarde.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'O Servidor encontrasse indisponível, por favor tente novamente mais tarde.';
      } else if (error.status === 401) {
        // Unauthorized error, redirect to login
        errorMessage = 'Sem login ou sessão expirada, por favor faça login novamente.';
        this.authService.logout(); // Optional: clear any stored auth information
        this.router.navigate(['/login']); // Redirect to the login page
      } else {
        errorMessage = `Erro Servidor (${error.status}): ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'charset': 'UTF-8'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  post<T>(endpoint: string, obj: any): Observable<T> {
    const token = this.authService.getToken();
    
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    const options = obj instanceof FormData ? { headers } : { headers: headers.set('Content-Type', 'application/json') };
  
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, obj, options)
      .pipe(catchError(this.handleError.bind(this)));
  }

  put<T>(endpoint: string, obj: any): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, obj, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
