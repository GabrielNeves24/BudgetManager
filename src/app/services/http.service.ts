import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.apiUrl = this.authService.getApiUrl();
  }

  

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'The server is currently unreachable. Please try again later.';
      } else {
        errorMessage = `Server error (${error.status}): ${error.message}`;
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
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, obj: any): Observable<T> {
    const token = this.authService.getToken();
    
    // Set headers differently if `obj` is an instance of FormData
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    // If obj is FormData, let the browser set the Content-Type
    const options = obj instanceof FormData ? { headers } : { headers: headers.set('Content-Type', 'application/json') };
  
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, obj, options)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, obj: any): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, obj, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
