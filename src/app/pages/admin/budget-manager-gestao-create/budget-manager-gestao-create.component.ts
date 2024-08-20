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
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company.service';
import { BudgetmanagerService } from '../../../services/admin/budgetmanager.service';

@Component({
  selector: 'app-budget-manager-gestao-create',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './budget-manager-gestao-create.component.html',
  styleUrl: './budget-manager-gestao-create.component.css'
})
export class BudgetManagerGestaoCreateComponent implements OnInit {
  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private companyService: CompanyService,
    private budgetManagerService: BudgetmanagerService
    ) {}
  isEditMode = false;

  private fb = inject(FormBuilder);
  BudgetManagerForm = this.fb.group({
    budgetManagerId: 0,
    companyId: [0, [Validators.required]],
    userId: [0, [Validators.required]],
    expirationDate: [Date(), [Validators.required]],
    active: [true],
  });

  userList: any = [];
  companyList: any = [];
  budgetManagerId=0;
  ngOnInit(): void {
    this.budgetManagerId = this.route.snapshot.params['budgetManagerId'] || 0;
    if (this.budgetManagerId != 0) {
      this.isEditMode = true;
      this.loadBudgetManager(this.budgetManagerId);
    }
    this.companyService.getAllCompanies().subscribe((data: any) => {
      this.companyList = data;
    });
    this.userService.getAllUsers().subscribe((data: any) => {
      this.userList = data;
    });
    this.BudgetManagerForm.get('expirationDate')?.setValue(new Date().toISOString().split('T')[0]);
    this.budgetManagerService.getAllBudgetManagers().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.userList = this.userList.filter((user: any) => user.userId != element.userId);
      });
    });
    this.budgetManagerService.getAllBudgetManagers().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.companyList = this.companyList.filter((company: any) => company.companyId != element.companyId);
      });
    });


  }
  loadBudgetManager(budgetManagerId: number) {
    this.budgetManagerService.getBudgetManagerById(budgetManagerId).subscribe((data: any) => {
      data.expirationDate = new Date(data.expirationDate).toISOString().split('T')[0];
      this.BudgetManagerForm.patchValue(data);
    });
  }
  onCancel(): void {
    this.router.navigate(['/budgetManager']);
  }
  onSubmit(): void {
    if (this.BudgetManagerForm.valid) {
      if (this.isEditMode) {
        this.budgetManagerService.updateBudgetManager(this.BudgetManagerForm.value,this.budgetManagerId).subscribe((data: any) => {
          this.toastr.success('Empresa atualizada com sucesso');
          this.router.navigate(['/budgetManager']);
        });
      } else {
        this.budgetManagerService.createBudgetManager(this.BudgetManagerForm.value).subscribe((data: any) => {
          this.toastr.success('Empresa criada com sucesso');
          this.router.navigate(['/budgetManager']);
        });
      }
    } else {
      this.toastr.error('Preencimento obrigatório');
    }
  }
}
