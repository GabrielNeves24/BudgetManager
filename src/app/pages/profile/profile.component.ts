import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
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
import { MatCard } from '@angular/material/card';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,MatCard,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  userId: any = 0;
  ngOnInit(): void {
    //the userId is on local storage on user but inseide user u want userId
    this.userId = localStorage.getItem('userId');
    this.userService.getUserById(this.userId).subscribe((data: any) => {
      //password is empty
      data.password = '';
      this.perfilForm.patchValue(data);
    });
  }

  private fb = inject(FormBuilder);
  perfilForm = this.fb.group({
    userId: this.userId,
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onCancel(){
    this.router.navigate(['/profile']);
  }
  onSubmit(){
    this.userService.updateUserPassword(this.perfilForm.value).subscribe((data: any) => {
      this.toastr.success('User editado com sucesso');
      this.router.navigate(['/profile']);
    });
  }


}
