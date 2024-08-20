import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css'
})
export class ClientCreateComponent implements OnInit {
  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    ) {}
  isEditMode = false;
  private fb = inject(FormBuilder);
  ClientForm = this.fb.group({
    clientId: 0,
    companyId: 0,
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    phone: [null],
    email: ['', [Validators.required]],
    nif: [''],
    obs: [''],
    active: ['' , [Validators.required]],
    lastUpdated: null
  });
  clientId = 0;
  companyID = 0;
  ngOnInit(): void {
    this.companyID = Number(localStorage.getItem('empresa'));
    this.clientId = this.route.snapshot.params['clientID'] || 0;
    if (this.clientId != 0 && this.clientId != null) {
      this.isEditMode = true;
      this.clientService.getClientById(this.clientId).subscribe((data: any) => {
        this.ClientForm.patchValue(data);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/client']);
  }

  onSubmit(): void {
    if (this.ClientForm.valid) {
      if (this.isEditMode) {
        this.clientService.updateClient(this.ClientForm.value,this.clientId).subscribe(() => {
          this.toastr.success('Cliente atualizado com sucesso');
          this.router.navigate(['/client']);
        });
      } else {
        this.ClientForm.patchValue({companyId: this.companyID});
        this.clientService.createClient(this.ClientForm.value).subscribe(() => {
          this.toastr.success('Cliente criado com sucesso');
          this.router.navigate(['/client']);
        });
      }
    }
  }

}
