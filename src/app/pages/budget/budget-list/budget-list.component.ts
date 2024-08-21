import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { BudgetService } from '../../../services/budget.service';
import { ClientService } from '../../../services/client.service';
@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css'
})
export class BudgetListComponent {

  columns = [
    { columnDef: 'BudgetId', header: '#', cell: (element: any) => `${element.budgetId}` },
    { columnDef: 'ClientName', header: 'Cliente', cell: (element: any) => `${element.clientName}` },
    { columnDef: 'Date', header: 'Data', cell: (element: any) => `${element.date}` },
    { columnDef: 'Total S/Iva', header: 'Total S/Iva', cell: (element: any) => `${element.totalWithoutIva} €` },
    { columnDef: 'Iva', header: 'Iva', cell: (element: any) => `${element.totalIva} €` },
    { columnDef: 'Total c/Iva', header: 'Total c/Iva', cell: (element: any) => `${element.totalWithIva} €` },
    { columnDef: 'State', header: 'Estado', cell: (element: any) => `${element.state}` },
    //{ columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'actions', header: 'Ações', cell: (element: any) => `${element.actions}` },
    { columnDef: 'print', header: 'Print', cell: (element: any) => `${element.print}` }
  ]
  
  constructor(
    private budgetService: BudgetService,
    private clientService: ClientService,
  ) { }
  datasource: any  = [];
  clientsList: any = [];
  companyId: number = 0;
  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
    this.loadBudgets();
  }

  loadBudgets() {
    // Fetch budgets
    this.budgetService.getBudgetByCompanyId(this.companyId).subscribe((budgets: any[]) => {
      this.datasource = budgets;

      // Fetch clients after getting budgets to ensure data merging
      this.clientService.getAllClientsByCompany(this.companyId).subscribe((clients: any[]) => {
        this.clientsList = clients;

        // Merge client name into the datasource
        this.datasource.forEach((element: any) => {
          const client = this.clientsList.find((client: any) => client.clientId === element.clientId);
          element.clientName = client ? client.name : 'Unknown'; // Store client name in a new property
        });
      });
    });
  }
}
