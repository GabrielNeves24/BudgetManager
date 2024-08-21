import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
    ) {}

    isEditMode = false;
    private fb = inject(FormBuilder);
    userForm = this.fb.group({
      userId: 0,
      username: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      active: [true],
    });
    userId = 0;
    ngOnInit(): void {
      this.authService.checkIfUserIsAdmin();
      this.userId = this.route.snapshot.params['userId'];
      if (this.userId != 0 && this.userId != null) {
        this.isEditMode = true;
        this.loadUser(this.userId);
      }
    }
    loadUser(userId: any): void {
      this.userService.getUserById(userId).subscribe((data: any) => {
        this.userForm.patchValue(data);
      });
    }
    
    onCancel(): void {
      this.router.navigate(['/user']);
    }

    onSubmit(): void {
      if (this.isEditMode) {
        this.userService.updateUser(this.userForm.value, this.userId).subscribe(() => {
          this.toastr.success('User atualizado com sucesso!');
          this.router.navigate(['/user']);
        });
      } else {
        this.userService.createUser(this.userForm.value).subscribe(() => {
          this.toastr.success('User criado com sucesso!');
          this.router.navigate(['/user']);
        });
      }
    }
}
