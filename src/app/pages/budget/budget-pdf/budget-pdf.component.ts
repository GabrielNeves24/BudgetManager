import { Component, Inject, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute } from '@angular/router';

import { BudgetService } from '../../../services/budget.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BudgetDetailService } from '../../../services/budget-detail.service';

import { CommonModule, DatePipe } from '@angular/common';
import { ItemService } from '../../../services/item.service';
import { CompanyService } from '../../../services/company.service';
import { UnitService } from '../../../services/unit.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-budget-pdf',
  standalone: true,
  imports: [DatePipe,CommonModule,MatIcon,MatButtonModule],
  templateUrl: './budget-pdf.component.html',
  styleUrl: './budget-pdf.component.css'
})
export class BudgetPdfComponent implements OnInit {
click: any;


  constructor(
    private clientService: ClientService,
    private budgetService: BudgetService,
    private toastr: ToastrService,
    private router: Router,
    private budgetDetailService: BudgetDetailService,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private companyService: CompanyService,
    private unitService: UnitService,
    private authService: AuthService  ) { }

  Budget: any;
  BudgetDetails: any;
  ClientInfo: any;
  CompanyInfo: any;
  ItemList: any;
  companyId: number = 0;
  unitList: any;
  imageAddress: any;
  navigateBack() {
    this.router.navigate(['/budget']);
  }
  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
    const budgetId = this.route.snapshot.params['id'];
    if (budgetId) {
      this.loadBudgetData(budgetId);
    }
    this.itemService.getItemsByEmpresa(this.companyId).subscribe({
      next: (itemData: any) => {
        this.ItemList = itemData;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar a lista de itens', err);
      }
    });
    this.unitService.getUnitByEmpresa(this.companyId).subscribe({
      next: (unitData: any) => {
        this.unitList = unitData;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar a lista de unidades', err);
      }
    });
    //get the logo of the company
    this.imageAddress = `${this.authService.getApiUrl()}/company/logo/${this.companyId}`;
    
  }
  getSymbolUniId(unitId: any) {
    const unit = this.unitList.find((unit: { unitId: any; }) => unit.unitId === unitId);
    if (unit) {
      return unit.symbol;
    }
    return '';
  }
  getItemDesctiption(itemId: any) {
    const item = this.ItemList.find((item: { itemId: any; }) => item.itemId === itemId);
    if (item) {
      return item.symbol;
    }
    return '';

  }

  valorTotalEmTexto: string = '';

  loadBudgetData(budgetId: number) {
    this.budgetService.getBudgetById(budgetId).subscribe({
      next: (budgetData: any) => {

        this.Budget = budgetData;

        if (this.Budget && this.Budget.clientId) {
          // Now we have the budget, we can proceed to get the client info
          this.clientService.getClientById(this.Budget.clientId).subscribe({
            next: (clientData: any) => {
              this.ClientInfo = clientData;

              // Now we can fetch the company info
              this.companyService.getCompanyById(this.companyId).subscribe({
                next: (companyData: any) => {
                  this.CompanyInfo = companyData;

                  // Finally, we can get the budget details
                  this.budgetDetailService.getAllBudgetDetails(budgetId).subscribe({
                    next: (budgetDetailsData: any) => {
                      this.BudgetDetails = budgetDetailsData;
                    },
                    error: (err) => {
                      this.toastr.error('Erro a carregar os detalhes do orçamento', err);
                    }
                  });
                },
                error: (err) => {
                 this.toastr.error('Erro ao carregar as informações da empresa', err);
                }
              });
            },
            error: (err) => {
              this.toastr.error('Erro ao carregar as informações do cliente', err);
            }
          });
        } else {
          this.toastr.error('Erro ao carregar as informações do orçamento');
        }
      },
      error: (err) => {
         this.toastr.error('Erro ao carregar as informações do orçamento', err);
      }
    });
  }
  seExist(){
    if(this.CompanyInfo.declaration != ''){
      return true;
    }
    return false;
  }

  seExist2(){
    if(this.Budget.obs != ''){
      return true;
    }
    return false;
  }



 


  generatePdf() {
    const elementToPrint = document.getElementById('theContent');
    
    if (elementToPrint) {
        // Apply CSS to ensure correct size
        elementToPrint.style.width = '794px';
        elementToPrint.style.height = '1123px';
        elementToPrint.style.transform = 'scale(1)';
        elementToPrint.style.transformOrigin = 'top left';
        
        // Generate PDF
        html2canvas(elementToPrint, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
            let position = 0;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            // Save the PDF
            pdf.save('Orçamento.pdf');
        });
    }
}



  



}
