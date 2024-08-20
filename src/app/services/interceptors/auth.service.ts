import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.toastr.error('Client-side error:', error.error.message);
        } else {
          // Handle server-side errors
          if (error.status === 401) {
            this.toastr.error('Unauthorized:', error.message);
            this.router.navigate(['/login']);
          } else if (error.status === 0) {
            this.toastr.error('Network error:', error.message);
          } else {
            this.toastr.error('Server-side error:', error.message);
          }
        }
        return throwError(error);
      })
    );
  }
}
