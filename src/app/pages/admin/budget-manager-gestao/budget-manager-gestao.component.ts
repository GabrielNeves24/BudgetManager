import { Component, OnInit } from '@angular/core';
import { BudgetmanagerService } from '../../../services/admin/budgetmanager.service';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { Company } from '../../../Model/company.model';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-budget-manager-gestao',
  standalone: true,
  imports: [DataTableComponent,DatePipe],
  templateUrl: './budget-manager-gestao.component.html',
  styleUrl: './budget-manager-gestao.component.css'
})
export class BudgetManagerGestaoComponent implements OnInit {

  constructor(
    private budgetManagerService: BudgetmanagerService,
    private companyService: CompanyService,
    private userService: UserService
  ) { }

  columns = [
    { columnDef: 'budgetManagerId', header: '#', cell: (element: any) => `${element.budgetManagerId}` },
    { columnDef: 'companyId', header: 'Empresa', cell: (element: any) => `${element.companyname}` },
    { columnDef: 'userId', header: 'Usuário', cell: (element: any) => `${element.username}` },
    { columnDef: 'LastLogin', header: 'Último Login', cell: (element: any) => `${element.lastLogin || 'N/A'} ` },
    { columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'CreationDate', header: 'Data Criação', cell: (element: any) => `${element.creationDate || 'N/A'}` },
    { columnDef: 'ExpirationDate', header: 'Data Expiração', cell: (element: any) => `${element.expirationDate || 'N/A'}` },
    { columnDef: 'LastUpdate', header: 'Última Atualização', cell: (element: any) => `${element.lastUpdate || 'N/A'}` },
    { columnDef: 'actions', header: 'Ações', cell: (element: any) => `${element.actions}` }
  ]

  datasource: any = [];
  companyList: any = [];
  userList: any = [];

  ngOnInit(): void {
    this.budgetManagerService.getAllBudgetManagers().subscribe((data: any) => {
      this.datasource = data;
    });
    this.companyService.getAllCompanies().subscribe((data: any) => {
      this.companyList = data;
      console.log(this.companyList);
      this.datasource.forEach((element: any) => {
        element.companyname = this.companyList.find((company: any) => company.companyId == element.companyId)?.name;
      });
    });
    this.userService.getAllUsers().subscribe((data: any) => {
      this.userList = data;
      this.datasource.forEach((element: any) => {
        element.username = this.userList.find((user: any) => user.userId == element.userId)?.username;
      });
    });
    
  }

}
