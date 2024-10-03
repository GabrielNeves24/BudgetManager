import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../../../services/budget.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
//import autoTable from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';


import autoTable from 'jspdf-autotable';
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
  imports: [DatePipe, CommonModule, MatIcon, MatButtonModule],
  templateUrl: './budget-pdf.component.html',
  styleUrls: ['./budget-pdf.component.css']
})
export class BudgetPdfComponent implements OnInit {
  // Existing properties
  Budget: any;
  BudgetDetails: any;
  ClientInfo: any;
  CompanyInfo: any;
  ItemList: any;
  companyId: number = 0;
  unitList: any;
  imageAddress: any;
  existValuesWithDiscont: boolean = false;

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Retrieve company ID from localStorage
    const storedCompany = localStorage.getItem('empresa');
    this.companyId = storedCompany ? Number(storedCompany) : 0;

    // Get budget ID from route parameters
    const budgetId = this.route.snapshot.params['id'];
    if (budgetId) {
      this.loadBudgetData(budgetId);
    }

    // Load items and units
    this.loadItems();
    this.loadUnits();

    // Set company logo URL
    this.imageAddress = `${this.authService.getApiUrl()}/company/logo/${this.companyId}`;
  }

  // Navigate back to the budget list
  navigateBack() {
    this.router.navigate(['/budget']);
  }

  // Load items based on the company ID
  private loadItems() {
    this.itemService.getItemsByEmpresa(this.companyId).subscribe({
      next: (itemData: any) => {
        this.ItemList = itemData;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar a lista de itens', err);
      }
    });
  }

  // Load units based on the company ID
  private loadUnits() {
    this.unitService.getUnitByEmpresa(this.companyId).subscribe({
      next: (unitData: any) => {
        this.unitList = unitData;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar a lista de unidades', err);
      }
    });
  }

  // Get the symbol for a given unit ID
  getSymbolUniId(unitId: any) {
    const unit = this.unitList.find((unit: { unitId: any; }) => unit.unitId === unitId);
    return unit ? unit.symbol : '';
  }

  // Get the description for a given item ID
  getItemDescription(itemId: any) {
    const item = this.ItemList.find((item: { itemId: any; }) => item.itemId === itemId);
    return item ? item.symbol : '';
  }

  // Check if declarations exist
  seExist() {
    return this.CompanyInfo?.declaration !== '';
  }

  // Check if observations exist
  seExist2() {
    //console.log(this.Budget.obs)
    return this.Budget.obs !== '';
  }

  // Load budget data along with related information
  loadBudgetData(budgetId: number) {
    this.budgetService.getBudgetById(budgetId).subscribe({
      next: (budgetData: any) => {
        this.Budget = this.formatBudget(budgetData);

        if (this.Budget?.clientId) {
          this.loadClientInfo(this.Budget.clientId, budgetId);
        } else {
          this.toastr.error('Erro ao carregar as informações do orçamento');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar as informações do orçamento', err);
      }
    });
  }

  // Format budget numbers
  private formatBudget(budgetData: any) {
    budgetData.totalWithIva = this.formatNumber(budgetData.totalWithIva);
    budgetData.totalWithoutIva = this.formatNumber(budgetData.totalWithoutIva);
    budgetData.totalIva = this.formatNumber(budgetData.totalIva);
    return budgetData;
  }

  // Format numbers with commas
  private formatNumber(value: any): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Load client information
  private loadClientInfo(clientId: number, budgetId: number) {
    this.clientService.getClientById(clientId).subscribe({
      next: (clientData: any) => {
        this.ClientInfo = clientData;
        this.loadCompanyInfo(budgetId);
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar as informações do cliente', err);
      }
    });
  }

  // Load company information
  private loadCompanyInfo(budgetId: number) {
    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (companyData: any) => {
        this.CompanyInfo = companyData;
        this.loadBudgetDetails(budgetId);
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar as informações da empresa', err);
      }
    });
  }

  // Load budget details
  private loadBudgetDetails(budgetId: number) {
    this.budgetDetailService.getAllBudgetDetails(budgetId).subscribe({
      next: (budgetDetailsData: any) => {
        this.BudgetDetails = budgetDetailsData.map((detail: any) => this.formatBudgetDetail(detail));
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os detalhes do orçamento', err);
      }
    });
  }

  // Format budget detail numbers and check for discounts
  private formatBudgetDetail(detail: any) {
    detail.price = this.formatNumber(detail.price);
    detail.total = this.formatNumber(detail.total);
    if (!this.existValuesWithDiscont && detail.discount > 0) {
      this.existValuesWithDiscont = true;
    }
    return detail;
  }

  // Generate PDF using jsPDF-AutoTable
  // Generate PDF using jsPDF-AutoTable
generatePdf() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let currentY = margin;
  // Add budget information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Orçamento # ${this.Budget.budgetId || '*****'}`, margin, currentY);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString('en-GB');
  doc.text(`Data: ${currentDate}`, pageWidth - margin , currentY, { align: 'right' });
  currentY += 10;

  // Add company logo
  if (this.imageAddress) {
    doc.addImage(this.imageAddress, 'PNG', pageWidth - margin - 100, currentY, 100, 50); // Adjust logo position to align right
  }

  // Add company information
  const companyInfoX = 10; // X position for company info after logo
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(this.CompanyInfo.name, companyInfoX, currentY + 5);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Morada: ${this.CompanyInfo.address}`, margin, currentY + 10);
  doc.text(`Cod.Postal: ${this.CompanyInfo.postalCode} ${this.CompanyInfo.city}`, margin, currentY + 15);
  doc.text(`Tel: ${this.CompanyInfo.phone}`, margin, currentY + 20);
  doc.text(`Email: ${this.CompanyInfo.email}`, margin, currentY + 25);
  doc.text(`NIF: ${this.CompanyInfo.cellPhone}`, margin, currentY + 30);
  doc.text(`IBAN: ${this.CompanyInfo.iban}`, margin, currentY + 35);

  currentY += 45;

  

  // Add client information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('Endereço de Envio:', margin, currentY);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${this.ClientInfo.name}`, margin, currentY + 5);
  doc.setFontSize(10);
  doc.text(`${this.ClientInfo.address}`, margin, currentY + 10);
  doc.text(`${this.ClientInfo.postalCode} - ${this.ClientInfo.city}`, margin, currentY + 15);
  
  doc.text(`${this.ClientInfo.email}`, margin, currentY + 20);
  doc.text(`${this.ClientInfo.phone}`, margin, currentY + 25);

  currentY += 35;

  // Prepare table headers based on discount existence
  const headers = ['Artigo', 'QTD.', 'Unidade', 'Preço S/Iva', 'IVA'];
  if (this.existValuesWithDiscont) {
    headers.push('Desconto', 'Total');
  } else {
    headers.push('Total');
  }

  // Prepare table rows
  const rows = this.BudgetDetails.map((item: any) => {
    const row = [
      item.itemDescription,
      item.quantity,
      this.getSymbolUniId(item.unitId),
      `${item.price}€`,
      `${item.iva}%`
    ];
    if (this.existValuesWithDiscont) {
      row.push(`${item.discount} %`, `${item.total} €`);
    } else {
      row.push(`${item.total} €`);
    }
    return row;
  });

  // Add table using autoTable
  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: rows,
    margin: { left: 10, right: 10 },
    styles: {
      fontSize: 10,
      halign: 'left',
      valign: 'middle',
      lineWidth: 0.5,
      //lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [221, 221, 221], // Header background color (white)
      textColor: [0, 0, 0], // Header text color
      fontStyle: 'normal',
    },
    bodyStyles: {
      lineColor: [221, 221, 221],
      lineWidth: 0.75,
      fillColor: [255, 255, 255], // White background for body
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // Light gray for alternate rows
    },
    theme: 'striped',
  });

  

  doc.setFontSize(14);
// Calculate finalY manually
const startY = currentY; // The initial Y position where the table starts
const rowHeight = 10; // The height of each row
const numRows = rows.length; // The number of rows in the table

const finalY = startY + (numRows * rowHeight)+5 +10;

 

  const budgetObsLineBreaks = this.Budget.obs.split('\n').length - 1;
  const companyDeclarationLineBreaks = this.CompanyInfo.declaration.split('\n').length - 1;

  // Add observations and declarations
  if (this.seExist2() || this.seExist()) {
    // Add observations
    currentY +=  (budgetObsLineBreaks * 5)+20;
    const headers3 = ['Observações','Declaração'];
    //console.log(this.Budget.obs)
    const rows3 = [[this.Budget.obs, this.CompanyInfo.declaration]];

    autoTable(doc, {
      startY: currentY,
      head: [headers3],
      body: rows3,
      margin: { left: 10, right: 10 },
      styles: {
        fontSize: 10,
        halign: 'left',
        valign: 'middle',
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [221, 221, 221],
        textColor: [0, 0, 0],
        fontStyle: 'normal',
      },
      bodyStyles: {
        lineColor: [221, 221, 221],
        lineWidth: 0.75,
        fillColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      theme: 'striped',
    });
    //get the last position of this table
    
  }

  const finalY2 = currentY + (1 * rowHeight);
    currentY = finalY;


  autoTable(doc, {
    startY: currentY,
    body: [
      ['Total Bruto:', `${this.Budget.totalWithoutIva || 'N/A'} €`],
      ['Total IVA:', `${this.Budget.totalIva || 'N/A'} €`],
      ['Total:', `${this.Budget.totalWithIva || 'N/A'} €`],
    ],
    theme: 'plain',
    margin: { left: pageWidth - margin - 80 },
    styles: {
      fontSize: 12,
      cellPadding: 2,
      halign: 'right',
    },
  });

  const pageCount = doc.internal.pages.length-1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${pageCount}`, margin, doc.internal.pageSize.height - margin);
  }

  // Save the PDF
  doc.save('Orçamento.pdf');
}



// generatePdF_OLD() {
//   const elementToPrint = document.getElementById('theContent');
  
//   if (elementToPrint) {
//       // Apply CSS to ensure correct size
//       elementToPrint.style.width = '794px';
//       elementToPrint.style.height = '1123px';
//       elementToPrint.style.transform = 'scale(1)';
//       elementToPrint.style.transformOrigin = 'top left';
      
//       // Generate PDF
//       html2canvas(elementToPrint, { scale: 2 }).then((canvas) => {
//           const imgData = canvas.toDataURL('image/png');
//           const pdf = new jsPDF('p', 'mm', 'a4');
//           const imgWidth = 210; // A4 width in mm
//           const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
//           let position = 0;
//           let heightLeft = imgHeight;

//           pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//           heightLeft -= pdf.internal.pageSize.getHeight();

//           while (heightLeft > 0) {
//               position = heightLeft - imgHeight;
//               pdf.addPage();
//               pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//               heightLeft -= pdf.internal.pageSize.getHeight();
//           }

//           // Save the PDF
//           pdf.save('Orçamento.pdf');
//       });
//   }
// }
  generatePdf22() {
    const elementToPrint = document.getElementById('theContent');
    // Apply CSS to ensure correct size
    


    if (elementToPrint) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const options = {
        callback: function (doc: { save: (arg0: string) => void; }) {
          doc.save('Orçamento.pdf');
        },
        x: 10,
        y: 10,
        width: 190, // Adjust the width to fit A4 size
        windowWidth: 794, // Ensure the width matches your content's width
        autoPaging: true,
        afterPageContent: function (currentPage: any, totalPage: any) {
          if (currentPage !== totalPage) {
            pdf.addPage();
          }
        },
      };
      pdf.html(elementToPrint, options);
    }

  }
}


