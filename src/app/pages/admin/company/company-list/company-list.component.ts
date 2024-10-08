import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { CompanyService } from '../../../../services/company.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private companyService: CompanyService,
    private router: Router,
    private authService: AuthService
  ) { }

  columns = [
    { columnDef: 'companyId', header: '#', cell: (element: any) => `${element.companyId}` },
    { columnDef: 'name', header: 'Nome', cell: (element: any) => `${element.name}` },
    { columnDef: 'address', header: 'Endereço', cell: (element: any) => `${element.address}` },
    { columnDef: 'phone', header: 'Telefone', cell: (element: any) => `${element.phone}` },
    { columnDef: 'email', header: 'Email', cell: (element: any) => `${element.email}` },
    { columnDef: 'active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'lastUpdate', header: 'Última Atualização', cell: (element: any) => `${element.lastUpdate}` },
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` }
  ]

  datasource: any = [];
  ngOnInit(): void {
    this.authService.checkIfUserIsAdmin();
    this.companyService.getAllCompanies().subscribe((data: any) => {
      this.datasource = data;
    });
  }

}
