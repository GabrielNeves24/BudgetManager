import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  columns = [
    { columnDef: 'clientId', header: '#', cell: (element: any) => `${element.clientId}` },
    { columnDef: 'name', header: 'Nome', cell: (element: any) => `${element.name}` },
    { columnDef: 'address', header: 'Morada', cell: (element: any) => `${element.address}` },
    { columnDef: 'city', header: 'Cidade', cell: (element: any) => `${element.city}` },
    { columnDef: 'phone', header: 'Telefone', cell: (element: any) => `${element.phone}` },
    { columnDef: 'email', header: 'Email', cell: (element: any) => `${element.email}` },
    { columnDef: 'active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    //{ columnDef: 'lastUpdate', header: 'Last Updated', cell: (element: any) => `${element.lastUpdate}` }
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` },
    { columnDef: 'Extrato', header: 'Extrato', cell: (element: any) => `${element.extrato}` }
  ]
  datasource:any = [];
  constructor(
    private clientService: ClientService
  ) { }

  companyId: number = 0;
  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
     this.clientService.getAllClientsByCompany(this.companyId).subscribe((data: any) => {
      this.datasource = data;
    });
  }

}
