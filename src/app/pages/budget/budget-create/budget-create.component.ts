import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { ItemService } from '../../../services/item.service';
import { BudgetService } from '../../../services/budget.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BudgetDetail } from '../../../Model/budgetDetail.model';
import { FormsModule } from '@angular/forms';
import { BudgetDetailModalComponent } from '../budget-detail-modal/budget-detail-modal.component'; // Adjust the path as necessary
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UnitService } from '../../../services/unit.service';
import { BudgetDetailService } from '../../../services/budget-detail.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-budget-create',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatIcon,
    MatDatepicker,
    MatDatepickerModule,
    MatCheckboxModule,FormsModule,BudgetDetailModalComponent,MatDialogModule,ConfirmationDialogComponent
  ],
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.css',
})
export class BudgetCreateComponent implements OnInit {
value: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private itemService: ItemService,
    private budgetService: BudgetService,   
    private dialog: MatDialog ,
    private unitService: UnitService,
    private budgetDetailService: BudgetDetailService
  ) {
    this.companyId = Number(localStorage.getItem('empresa'));
  }

  budgetArray: BudgetDetail[] = []; // Initialize the budgetArray property
  dataSource = new MatTableDataSource<BudgetDetail>(this.budgetArray);
  isEditMode = false;
  clientList: any[] = [];
  itemList: any[] = [];
  unitList: any[] = [];
  totalWithoutIva = 0;
  totalIva = 0;
  totalWithIva = 0;
  numberOfBudgetIfEdit: number = 0;


  private fb = inject(FormBuilder);
  budgetForm = this.fb.group({
    budgetId: 0,
    clientId: [0,[Validators.required,Validators.min(1)]],
    companyId: [0],
    date: [new Date().toISOString(),[Validators.required]],
    origin: '',
    totalWithoutIva: [0,[Validators.required, Validators.min(0.01)]],
    totalIva: [0,[Validators.required, Validators.min(0.01)]],
    totalWithIva: [0,[Validators.required, Validators.min(0.01)]],
    obs:'',
    state: 'Pendente',
    active: true,
    lastUpdate: null,
  });

  companyId: number = 0;
  isEditing = true;
  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
    this.clientService.getAllClientsByCompany(this.companyId).subscribe((data: any) => {
      this.clientList = data;
    });

    this.itemService.getItemsByEmpresa(this.companyId).subscribe((data: any) => {
      this.itemList = data;
    });

    this.unitService.getUnitByEmpresa(this.companyId).subscribe((data: any) => {
      this.unitList = data;
    });
    this.numberOfBudgetIfEdit = this.route.snapshot.params['budgetId'];

    if (this.numberOfBudgetIfEdit != 0 && this.numberOfBudgetIfEdit != null) {
      this.budgetService.getBudgetById(this.numberOfBudgetIfEdit).subscribe((data: any) => {

        if (data.date) {
          data.date = new Date(data.date).toISOString().split('T')[0];
        }
        this.budgetForm.setValue(data);
        this.isEditing = false;
      });
      this.budgetDetailService.getAllBudgetDetails(this.numberOfBudgetIfEdit).subscribe((data: any) => {  
        this.budgetArray = data;
        this.dataSource.data = this.budgetArray;
      });
    }   
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }); 
  }


  validateForm(item:any): void {

  }
  onCancel(item:any): void{

  }

  onEdit(element: any): void {
    const itemIndext = this.budgetArray.findIndex(item =>
      item.budgetDetailId === element.budgetDetailId
    );
    const dialogRef = this.dialog.open(BudgetDetailModalComponent, {
      width: '600px',
      data: {
        ...this.budgetArray[itemIndext],  // Passing the found item for editing
        itemList: this.itemList,          // Passing the item list
        unitList: this.unitList           // Passing the unit list
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.companyId = this.companyId;
        //now get the result and fill wioth tge addicional data
        this.budgetArray[itemIndext] = result;
        this.dataSource.data = [...this.budgetArray];
        //if this.numberOfBudgetIfEdit>0 then update the budgetDetail
        if (this.numberOfBudgetIfEdit > 0) {
          this.budgetDetailService.updateBudgetDetail(result, result.budgetDetailId).subscribe(
            (response: any) => {
              if (response && response.budgetDetail && response.budgetDetail.budgetDetailId > 0) {
                this.toastr.success('Linha atualizada com sucesso');
              } else {
                this.toastr.error('Erro ao atualizar a linha');
              }
            },
            (error) => {
              this.toastr.error('Occoreu um erro ao tentar atualizar a linha:' + error);
            }
          );
        } else {
        }
      }else{

      }}
      
      );
  }
  createLine(): void {
    const dialogRef = this.dialog.open(BudgetDetailModalComponent, {
      width: '600px',
      data: { itemList: this.itemList, unitList:this.unitList } // Passing itemList to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.numberOfBudgetIfEdit > 0) {
          result.companyId = this.companyId;
          result.budgetDetailId = 0;
          result.budgetId = this.numberOfBudgetIfEdit;
          this.budgetDetailService.createBudgetDetail(result).subscribe(
            (response: any) => {
              if (response && response.budgetDetail && response.budgetDetail.budgetDetailId > 0) {
                this.toastr.success('Linha criada com sucesso');
                result.budgetDetailId = response.budgetDetail.budgetDetailId;
              } else {
                this.toastr.error('Erro ao criar linha');
              }
            },
            (error) => {
              this.toastr.error('Occoreu um erro ao tentar criar a linha:');
            }
          );
        }else{
          result.budgetDetailId = 0;
          result.budgetId = 0;
        }
        this.budgetArray.push(result);
        this.dataSource.data = this.budgetArray;
      }
    });
  }
  onDelete(index: number): void {
    const indexToDelete = index;
  
    if (this.numberOfBudgetIfEdit > 0) {
      if (this.budgetArray.length === 1) {
        this.confirmDeleteBudget();
      } else {
        this.confirmDeleteLine(indexToDelete);
      }
    } else {
      this.removeItemFromArray(indexToDelete);
    }
  }
  private confirmDeleteBudget(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja eliminar o orçamento todo' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.budgetService.deleteBudget(this.numberOfBudgetIfEdit).subscribe(
          (response: any) => {
            if (response) {
              this.toastr.success('Orçamento eliminado com sucesso');
              this.router.navigate(['/budget']);
            } else {
              this.toastr.error('Erro a eliminar o orçamento');
            }
          },
          (error) => {
            this.toastr.error('Occoreu um erro ao tentar remover o orçamento');
          }
        );
      } else {
        this.toastr.error('O orçamento tem de ter pelo menos uma linha');
      }
    });
  }
  
  private confirmDeleteLine(indexToDelete: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Deseja eliminar o linha?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.budgetDetailService.deleteBudgetDetail(indexToDelete).subscribe(
          (response: any) => {
            if (response) {
              const index2 = this.budgetArray.findIndex(item => item.budgetDetailId === indexToDelete);
              if (index2 !== -1) {
                this.budgetArray.splice(index2, 1);
                this.dataSource.data = [...this.budgetArray];
                this.toastr.success('Linha eliminada com sucesso');
              }
            } else {
              this.toastr.error('Erro a eliminar a linha');
            }
          },
          (error) => {
            this.toastr.error('Occoreu um erro ao tentar remover a linha');
          }
        );
      }
    });
  }
  
  private removeItemFromArray(indexToDelete: number): void {
    this.budgetArray.splice(indexToDelete, 1);
    this.dataSource.data = [...this.budgetArray];
  }
   

  calculateTotals(): void {
    if(this.isEditing){
      this.totalWithoutIva = 0;
    this.totalIva = 0;
    this.totalWithIva = 0;
    this.budgetArray.forEach(item => {
      // Parse quantity and price as numbers before performing calculations
      const quantity = parseFloat(item.quantity.toString());
      const price = parseFloat(item.price.toString());
      const iva = parseFloat(item.iva.toString());
      const total = parseFloat(item.total.toString());
  
      if (!isNaN(quantity) && !isNaN(price) && !isNaN(iva) && !isNaN(total)) {
        this.totalWithoutIva += quantity * price;
        this.totalIva += quantity * price * iva / 100;
        this.totalWithIva += total;
      }
    });
  
    this.budgetForm.patchValue({
      totalWithoutIva: this.totalWithoutIva,
      totalIva: this.totalIva,
      totalWithIva: this.totalWithIva
    });
    }
    this.isEditing=true;
  }
  isManualUpdate = false;
  onManualTotalChange(event: any): void {
    this.isManualUpdate = true;
    //get $event.target value
    // Extract the value from the event
    let value = event.value;
    
    // Remove the currency symbol if present
    if (value.includes('€')) {
      value = value.replace('€', '').trim();
    }
    
    // Parse the value to a float
    const totalWithIva = parseFloat(value.replace(',', '.'));

    // Ensure the parsed value is valid
    if (isNaN(totalWithIva)) {
      console.error('Invalid total value');
      return;
    }

    // Calculate totalWithoutIva and totalIva
    this.totalWithIva = totalWithIva;
    const conta = this.totalWithIva / 1.23;
    this.totalWithoutIva = //only 2 decimals

    parseFloat(conta.toFixed(2));
    this.totalIva = this.totalWithIva - this.totalWithoutIva;

    this.budgetForm.get('totalWithoutIva')?.setValue(this.totalWithoutIva);
    this.budgetForm.get('totalIva')?.setValue(this.totalIva);
    this.budgetForm.get('totalWithIva')?.setValue(this.totalWithIva);
    


  
  }
  


  preSelectDate(): void {
    //set the date to today
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    this.budgetForm.patchValue({
      date: formattedDate
    });
  }


  
  getNameSymbol(unitId:any): any {

    //get from itemList the symbol  
    const unit = this.unitList.find((unit) => unit.unitId === unitId);
    return unit ? unit.symbol : '';
  }

  displayedColumns: string[] = ['itemDescription', 'quantity', 'price','unit' ,'iva', 'discount','totalsiva', 'total', 'actions'];

  onSubmit(): void {

    if (this.budgetForm.valid && this.budgetArray.length > 0) {
      const budgetData = this.budgetForm.value;
  
      // Check if it's a new budget or an existing one
      if (budgetData.budgetId === 0) {
        budgetData.companyId = this.companyId;
        this.budgetService.createBudget(budgetData).subscribe(
          (response: any) => {
  
            if (response && response.budget && response.budget.budgetId > 0) {
              //this.toastr.success('Orçamento criado com sucesso');
  
              // Update budgetId in the details array
              this.budgetArray.forEach((item) => {
                item.budgetId = response.budget.budgetId;
                item.companyId = this.companyId;
              });
  
              // Create each budget detail
              let detailCreationPromises = this.budgetArray.map((item) => {
                return this.budgetDetailService.createBudgetDetail(item).toPromise();
              });
  
              // Wait for all details to be created
              Promise.all(detailCreationPromises)
                .then((detailResponses: any[]) => {
                  let allDetailsCreatedSuccessfully = true;
  
                  detailResponses.forEach((detailResponse) => {
                    if (!detailResponse || detailResponse.budgetDetail.budgetDetailId === 0) {
                      allDetailsCreatedSuccessfully = false;
                      this.toastr.error('Erro ao criar detalhe do orçamento');
                    } else {
                      //this.toastr.success('Orçamento criado com sucesso');
                    }
                  });
  
                  if (allDetailsCreatedSuccessfully) {
                    this.toastr.success('Todos os detalhes do orçamento foram criados com sucesso');
                    this.router.navigate(['/budget']);
                  } else {
                    this.toastr.error('Houve erros ao criar os detalhes do orçamento');
                  }
                })
                .catch((error) => {
                  this.toastr.error('Occoreu um erro ao tentar criar os detalhes do orçamento');
                });
            } else {
              this.toastr.error('Erro ao criar o orçamento');
            }
          },
          (error) => {
            this.toastr.error('Erro ao criar o orçamento');
          }
        );
      } else {
        const budgetId = budgetData.budgetId || 0;
        this.budgetService.updateBudget(budgetData, budgetId).subscribe(
          (response: any) => {  
            if (response && response.budget && response.budget.budgetId > 0) {
              this.toastr.success('Orçamento atualizado com sucesso');
              this.budgetArray.forEach((item) => {
                item.budgetId = response.budget.budgetId;
              });
             
              this.router.navigate(['/budget']);
            } else {
              this.toastr.error('Erro ao atualizar o orçamento');
            }
          },
          (error) => {
            this.toastr.error('Occoreu um erro ao tentar atualizar o orçamento');
          }
        );
      }
    }else{
      this.toastr.error('Preencha todos os campos');
    }
  }

  onCancelFull(): void {
    this.router.navigate(['/budget']);
  }
}
