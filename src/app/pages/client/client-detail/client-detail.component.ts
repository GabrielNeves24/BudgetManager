import { Component,Input, OnInit  } from '@angular/core';
import { Chart } from 'chart.js/auto'; // or import { BaseChartDirective } from 'ng2-charts';
import { ClientService } from '../../../services/client.service';
import { BudgetService } from '../../../services/budget.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [DatePipe,CommonModule,DataTableComponent],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent implements OnInit {
  clientId!: number;

  client: any;
  budgets: any[] = [];
  totalBudgets = 0;
  totalRevenue = 0;
  chart: any;
  totalWithIva: any;
  totalWithoutIva: any;
  totalIva: any;

  constructor(
    private clientService: ClientService,
    private budgetService: BudgetService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['clientId'] || 0;
    this.fetchClientDetails();
    this.fetchClientBudgets();
  }

  fetchClientDetails() {
    this.clientService.getClientById(this.clientId).subscribe((data: any) => {
      this.client = data;
    });
  }

  fetchClientBudgets() {
    this.budgetService.getBudgetByClientID(this.clientId).subscribe((data: any) => {
      this.budgets = data;
      this.totalBudgets = this.budgets.length;
      this.totalRevenue = this.budgets.reduce((acc, budget) => acc + budget.totalWithIva, 0).toFixed(2);
      this.totalWithIva = this.budgets.reduce((acc, budget) => acc + budget.totalWithIva, 0).toFixed(2);
      this.totalWithoutIva = this.budgets.reduce((acc, budget) => acc + budget.totalWithoutIva, 0).toFixed(2);
      this.totalIva = this.budgets.reduce((acc, budget) => acc + budget.totalIva, 0).toFixed(2);
      this.createBudgetStateChart();
      this.datasource = data;
    });
  }

  createBudgetStateChart() {
    // Create an object to hold the aggregated data
    const budgetStates = this.budgets.reduce((acc, budget) => {
      // Initialize the state if it doesn't exist
      if (!acc[budget.state]) {
        acc[budget.state] = { count: 0, totalWithIva: 0 };
      }
      
      // Increment the count of budgets for this state
      acc[budget.state].count += 1;
      // Add the total with IVA to the state total
      acc[budget.state].totalWithIva += budget.totalWithIva;

      return acc;
    }, {});

    // Create labels and datasets for the chart
    const labels = Object.keys(budgetStates);
    const counts = labels.map(state => budgetStates[state].count);
    const totalsWithIva = labels.map(state => budgetStates[state].totalWithIva);
    const totalsWithoutIva = labels.map(state => budgetStates[state].totalWithoutIva);
    const totalIva = labels.map(state => budgetStates[state].totalIva);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Estado',
          data: counts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        },
        {
          label: 'Total C/IVA',
          data: totalsWithIva,
          backgroundColor: ['#FF9F40', '#FFCD56', '#4BC0C0', '#FF6384'],
          hoverBackgroundColor: ['#FF9F40', '#FFCD56', '#4BC0C0', '#FF6384']
        },
      ]
    };

    // Initialize the chart with the data
    this.chart = new Chart('budgetStateChart', {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  columns = [
    { columnDef: 'BudgetId', header: '#', cell: (element: any) => `${element.budgetId}` },
    { columnDef: 'Date', header: 'Data', cell: (element: any) => `${element.date}` },
    { columnDef: 'Total S/Iva', header: 'Total S/Iva', cell: (element: any) => `${element.totalWithoutIva} €` },
    { columnDef: 'Iva', header: 'Iva', cell: (element: any) => `${element.totalIva} €` },
    { columnDef: 'Total c/Iva', header: 'Total c/Iva', cell: (element: any) => `${element.totalWithIva} €` },
    { columnDef: 'State', header: 'Estado', cell: (element: any) => `${element.state}` },
    //{ columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'actions', header: 'Ações', cell: (element: any) => `${element.actions}` },
    { columnDef: 'print', header: 'Print', cell: (element: any) => `${element.print}` }
  ]
  datasource: any  = [];

}
