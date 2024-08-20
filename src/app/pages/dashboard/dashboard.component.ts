import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule here
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { BaseChartDirective } from 'ng2-charts';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetService } from '../../services/budget.service';
import { ClientService } from '../../services/client.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,  // Use CommonModule instead of BrowserModule
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  datasource: any = [];
  clientList: any = [];
  companyId: number = 0;

  // Chart properties
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Budget' },
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Clients' }
    ]
  };

  constructor(
    private budgetService: BudgetService,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
    this.loadBudgets(this.companyId);
    this.loadClients(this.companyId);
  }

  loadBudgets(companyId: number) {
    this.budgetService.getBudgetByCompanyId(companyId).subscribe((budgets: any[]) => {
      this.datasource = budgets.map(b => ({
        name: b.clientId,  // Initially set clientId; will replace with client name later
        amount: b.totalWithIva
      }));
      this.barChartData.labels = budgets.map(b => b.clientId);  // Assume `clientId` is a property of each budget
      this.barChartData.datasets[0].data = budgets.map(b => b.totalWithIva);  // Assume `totalWithIva` is a property of each budget
    });
  }

  loadClients(companyId: number) {
    this.clientService.getAllClientsByCompany(companyId).subscribe((clients: any[]) => {
      this.clientList = clients;
      this.pieChartData.labels = clients.map(c => c.name);  // Assume `name` is a property of each client
      this.pieChartData.datasets[0].data = clients.map(c => this.getTotalWithIvaSumFromBudgets(c.clientId));  // Assume `clientId` is a property of each client
      
      // Replace client IDs with names in the datasource
      this.datasource.forEach((d: any) => {
        const client = clients.find(c => c.clientId === d.name);
        if (client) {
          d.name = client.name;
        }
      });
    });
  }

  getTotalWithIvaSumFromBudgets(clientId: number) {
    return this.datasource
      .filter((b: { name: number; }) => b.name === clientId)
      .reduce((acc: number, b: { amount: number; }) => acc + b.amount, 0);
  }
}
