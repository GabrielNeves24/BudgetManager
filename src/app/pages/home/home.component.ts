import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables  } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private clientService: ClientService,
    private budgetService: BudgetService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  clientId!: number;
  chart: any;
  chart2: any;
  budgetsList: any[] = [];
  clientsList: any[] = [];
  companyId: any = 0;


  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['clientId'] || 0;
    this.companyId = localStorage.getItem('empresa') || 0;
    this.fetchClientData();
    this.fetchBudgets();
  }

  fetchClientData() {
    this.clientService.getAllClientsByCompany(this.companyId).subscribe((data: any) => {
      this.clientsList = data;
    });
  }

  fetchBudgets() {
    this.budgetService.getBudgetByCompanyId(this.companyId).subscribe((data: any) => {
      this.budgetsList = data;
      this.createBudgetStateChart();
      this.fetchMonthlyBudgets();
    });
  }

  createBudgetStateChart() {
    const data = {
      labels: ['Pendente', 'Adjudicado', 'Rejeitado'],
      datasets: [
        {
          label: 'Orçamentos',
          data: [
            this.budgetsList.filter((budget) => budget.state === 'Pendente').length,
            this.budgetsList.filter((budget) => budget.state === 'Adjudicado').length,
            this.budgetsList.filter((budget) => budget.state === 'Rejeitado').length,
          ],
          backgroundColor: ['yellow', 'green', 'red'],
        },
      ],
    };

    this.chart = new Chart('OrçamentosChart', {
      type: 'doughnut',
      data: data,
    });
  }

  fetchMonthlyBudgets() {
    const monthlyBudgets = this.budgetsList.reduce((result: any, budget: any) => {
      const date = new Date(budget.lastUpdate);
      const month = date.getMonth();
      const status = budget.state;

      if (!result[month]) {
        result[month] = {
          Pendente: 0,
          Adjudicado: 0,
          Rejeitado: 0,
          totalWithIva: 0,
        };
      }

      result[month][status]++;
      result[month].totalWithIva += budget.totalWithIva;

      return result;
    }, {});

    const labels = Object.keys(monthlyBudgets).map((month) => this.getMonthName(Number(month)));

    const datasets = [
      {
        label: 'Pendente',
        data: labels.map((label, index) => monthlyBudgets[index]?.Pendente || 0),
        backgroundColor: 'yellow',
      },
      {
        label: 'Adjudicado',
        data: labels.map((label, index) => monthlyBudgets[index]?.Adjudicado || 0),
        backgroundColor: 'green',
      },
      {
        label: 'Rejeitado',
        data: labels.map((label, index) => monthlyBudgets[index]?.Rejeitado || 0),
        backgroundColor: 'red',
      },
    ];

    const data = {
      labels: labels,
      datasets: datasets,
    };

    this.chart = new Chart('MonthlyBudgetsChart', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  }

  getMonthName(month: number) {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return monthNames[month];
  }
  createMonthlyBudgetChart() {
    const monthlyBudgets = this.budgetsList.reduce((result: any, budget: any) => {
      const date = new Date(budget.lastUpdate);
      const month = date.getMonth();
      const monthName = this.getMonthName(month);
  
      if (!result[monthName]) {
        result[monthName] = 0;
      }
  
      result[monthName]++;
      return result;
    }, {});
  
    const data = {
      labels: Object.keys(monthlyBudgets),
      datasets: [
        {
          label: 'Orçamentos por Mês',
          data: Object.values(monthlyBudgets),
          backgroundColor: 'blue',
        },
      ],
    };
  
    this.chart = new Chart('MonthlyBudgetsChart', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  createBudgetTotalsChart() {
    try {
      const monthlyTotals = this.budgetsList.reduce((result: any, budget: any) => {
        const date = new Date(budget.lastUpdate);
        const month = date.getMonth();
        const monthName = this.getMonthName(month);
  
        if (!result[monthName]) {
          result[monthName] = {
            totalWithIva: 0,
            totalWithoutIva: 0,
            totalIva: 0
          };
        }
  
        result[monthName].totalWithIva += budget.totalWithIva;
        result[monthName].totalWithoutIva += budget.totalWithoutIva;
        result[monthName].totalIva += budget.totalIva;
  
        return result;
      }, {});
  
      const labels = Object.keys(monthlyTotals);
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Total com IVA',
            data: labels.map((month) => monthlyTotals[month].totalWithIva),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
          },
          {
            label: 'Total sem IVA',
            data: labels.map((month) => monthlyTotals[month].totalWithoutIva),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
            tension: 0.1
          },
          {
            label: 'Total IVA',
            data: labels.map((month) => monthlyTotals[month].totalIva),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            fill: false,
            tension: 0.1
          }
        ],
      };
  
      if (this.chart2) {
        this.chart2.destroy();  // Destroy existing chart instance if it exists
      }
  
      this.chart2 = new Chart('BudgetTotalsChart', {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month'
              },
              beginAtZero: true,
            },
            y: {
              title: {
                display: true,
                text: 'Amount'
              },
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao criar o gráfico de totais de orçamentos');
    }
  }
  

}
