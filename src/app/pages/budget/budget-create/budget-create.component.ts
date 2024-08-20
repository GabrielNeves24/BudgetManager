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
    MatCheckboxModule,FormsModule,BudgetDetailModalComponent,MatDialogModule
  ],
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.css',
})
export class BudgetCreateComponent implements OnInit {

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
    clientId: [0,[Validators.required]],
    companyId: 0,
    date: [new Date().toISOString(),[Validators.required]],
    origin: '',
    totalWithoutIva: [0],
    totalIva: [0],
    totalWithIva: [0],
    obs:'',
    state: '',
    active: true,
    lastUpdate: null,
  });

  companyId: number = 0;

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
        this.budgetForm.patchValue(data);
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
    console.log(itemIndext); // Debugging line
    console.log('Current budgetArray1:', this.budgetArray); // Debugging line
    console.log('Current budgetArray2:', this.budgetArray[itemIndext]); // Debugging line
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
          console.log('Result from modal:', result); // Debugging line
          console.log('Current budgetArray:', this.budgetArray); // Debugging line
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
    const itemToDelete = index;
    if(this.numberOfBudgetIfEdit > 0){
      this.budgetDetailService.deleteBudgetDetail(itemToDelete).subscribe(
        (response: any) => {
          if (response) {
            const index2 = this.budgetArray.findIndex(item =>
              item.budgetDetailId === itemToDelete
            );
            this.budgetArray.splice(index2, 1);
            this.dataSource.data = [...this.budgetArray];
            this.toastr.success('Linha eliminada com sucesso');
          } else {
            this.toastr.error('Erro a eliminar a linha');
          }
        },
        (error) => {
          this.toastr.error('Occoreu um erro ao tentar remover a linha');
        }
      );
    }else{
      this.budgetArray.splice(index, 1);
      this.dataSource.data = [...this.budgetArray];
    }
  }
   

  calculateTotals(): void {
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

  displayedColumns: string[] = ['itemDescription', 'quantity', 'price','unit' ,'iva', 'discount', 'total', 'actions'];

  onSubmit(): void {
    if (this.budgetForm.valid && this.budgetArray.length > 0) {
      const budgetData = this.budgetForm.value;
  
      // Check if it's a new budget or an existing one
      if (budgetData.budgetId === 0) {
        budgetData.companyId = this.companyId;
        this.budgetService.createBudget(budgetData).subscribe(
          (response: any) => {
            console.log('Response:', response);
  
            if (response && response.budget && response.budget.budgetId > 0) {
              console.log(`Budget created with ID: ${response.budget.budgetId}`);
              this.toastr.success('Budget created successfully');
  
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
                      console.log('Error creating budget detail');
                      this.toastr.error('Error creating budget detail');
                    } else {
                      console.log(`Budget detail created with ID: ${detailResponse.budgetDetail.budgetDetailId}`);
                    }
                  });
  
                  if (allDetailsCreatedSuccessfully) {
                    this.toastr.success('All budget details created successfully');
                    this.router.navigate(['/budget']);
                  } else {
                    this.toastr.error('Some budget details could not be created');
                  }
                })
                .catch((error) => {
                  console.error('An error occurred while creating budget details:', error);
                  this.toastr.error('An unexpected error occurred while creating budget details');
                });
            } else {
              console.log('Error creating budget');
              this.toastr.error('Error creating budget');
            }
          },
          (error) => {
            console.error('An error occurred while creating the budget:', error);
            this.toastr.error('An unexpected error occurred while creating the budget');
          }
        );
      } else {
        const budgetId = budgetData.budgetId || 0;
        this.budgetService.updateBudget(budgetData, budgetId).subscribe(
          (response: any) => {
            console.log('Response:', response);
  
            if (response && response.budget && response.budget.budgetId > 0) {
              console.log(`Budget updated with ID: ${response.budget.budgetId}`);
              this.toastr.success('Budget updated successfully');
  
              // Update budgetId in the details array
              this.budgetArray.forEach((item) => {
                item.budgetId = response.budget.budgetId;
              });
              
              // Handle creation or update of each budget detail
              // let detailPromises = this.budgetArray.map((item) => {
              //   if (item.budgetDetailId && item.budgetDetailId > 0) {
              //     // Update existing budget detail
              //     return this.budgetDetailService.updateBudgetDetail(item,item.budgetDetailId ).toPromise();
              //   } else {
              //     // Create new budget detail
              //     return this.budgetDetailService.createBudgetDetail(item).toPromise();
              //   }
              // });
  
              // // Wait for all details to be processed
              // Promise.all(detailPromises)
              //   .then((detailResponses: any[]) => {
              //     let allDetailsProcessedSuccessfully = true;
  
              //     detailResponses.forEach((detailResponse) => {
              //       if (!detailResponse || !detailResponse.budgetDetail.budgetDetailId) {
              //         allDetailsProcessedSuccessfully = false;
              //         console.log('Error processing budget detail');
              //         this.toastr.error('Error processing budget detail');
              //       } else {
              //         console.log(`Budget detail processed with ID: ${detailResponse.budgetDetail.budgetDetailId}`);
              //       }
              //     });
  
              //     if (allDetailsProcessedSuccessfully) {
              //       this.toastr.success('All budget details processed successfully');
              //       this.router.navigate(['/budget']);
              //     } else {
              //       this.toastr.error('Some budget details could not be processed');
              //     }
              //   })
              //   .catch((error) => {
              //     console.error('An error occurred while processing budget details:', error);
              //     this.toastr.error('An unexpected error occurred while processing budget details');
              //   });
              this.router.navigate(['/budget']);
            } else {
              console.log('Error updating budget');
              this.toastr.error('Error updating budget');
            }
          },
          (error) => {
            console.error('An error occurred while updating the budget:', error);
            this.toastr.error('An unexpected error occurred while updating the budget');
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
