import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute  } from  '@angular/router';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CompanyService } from '../../../../services/company.service';


@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css'
})
export class CompanyCreateComponent {
  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
    ) {}

    isEditMode = false;
    private fb = inject(FormBuilder);
    companyForm = this.fb.group({
      companyId: 0,
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address2: [''],
      postalCode: [''],
      city: [''],
      iban: [''],
      website: [''],
      phone: [''],
      cellPhone: [''],
      email: [''],
      active: [true],
      declaration: [''],
    });
    companyId = 0;

    ngOnInit(): void {
      this.companyId = this.route.snapshot.params['companyId'];
      if (this.companyId != 0 && this.companyId != null) {
        this.isEditMode = true;
        this.loadCompany(this.companyId);
      }
    }

    loadCompany(companyId: number): void {
      this.companyService.getCompanyById(companyId).subscribe((data: any) => {
        this.companyForm.patchValue(data);
      });
    }

    onCancel(): void {
      this.router.navigate(['/company']);
    }
    

    onSubmit(): void {
      if (this.companyForm.invalid) {
        this.toastr.error('Preencha todos os campos obrigatórios');
        return;
      }
      if (this.isEditMode) {
        this.companyService.updateCompany(this.companyForm.value, this.companyId).subscribe((data: any) => {
          this.toastr.success('Empresa atualizada com sucesso');
          this.router.navigate(['/company']);
        });
      } else {
        this.companyService.createCompany(this.companyForm.value).subscribe((data: any) => {
          this.toastr.success('Empresa criada com sucesso');
          this.router.navigate(['/company']);
        });
      }
    }
}
