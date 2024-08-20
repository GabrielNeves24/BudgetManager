import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HTTPService } from '../../services/http.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { debounce } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj = {
    "username": "",
    "password": ""
  }

  constructor(
    private authservice : AuthService,
    private router: Router,
    private toastr: ToastrService,
    private httpservice: HTTPService
  ) { }
  isLoading: boolean = false;
  onLogin() {
    this.isLoading = true;
    this.httpservice.post('/User/Login', this.loginObj).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.status) {
          // Login successful
          this.toastr.success(res.message);
          this.authservice.setToken(res.token);
          localStorage.setItem('empresa', res.empresa);
          localStorage.setItem('user', JSON.stringify(res.user));
          //set a userID
          localStorage.setItem('userId', res.user.userId);
          this.router.navigate(['/budget']);
        } else {
          // Handle error case
          this.toastr.error(res.message);
        }
      },
      (error) => {
        // Handle HTTP errors
        this.isLoading = false;
        this.toastr.error('An error occurred while logging in. Please try again.' );
        console.error('Login error', error);
      }
    );
  }
  
  

}
