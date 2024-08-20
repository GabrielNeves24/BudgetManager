import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { CompanyService } from '../../../../services/company.service';

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
    private companyService: CompanyService
  ) { }

  columns = [
    { columnDef: 'CompanyId', header: '#', cell: (element: any) => `${element.companyId}` },
    { columnDef: 'Name', header: 'Nome', cell: (element: any) => `${element.name}` },
    { columnDef: 'Address', header: 'Endereço', cell: (element: any) => `${element.address}` },
    { columnDef: 'Phone', header: 'Telefone', cell: (element: any) => `${element.phone}` },
    { columnDef: 'Email', header: 'Email', cell: (element: any) => `${element.email}` },
    { columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'LastUpdate', header: 'Última Atualização', cell: (element: any) => `${element.lastUpdate}` },
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` }
  ]

  datasource: any = [];
  ngOnInit(): void {
    this.companyService.getAllCompanies().subscribe((data: any) => {
      this.datasource = data;
    });
  }

}
