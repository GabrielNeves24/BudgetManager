import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-budget-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './budget-detail-modal.component.html',
  styleUrls: ['./budget-detail-modal.component.css']
})
export class BudgetDetailModalComponent implements OnInit {
  budgetDetailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BudgetDetailModalComponent>,
    private itemService: ItemService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.budgetDetailForm = this.fb.group({
      budgetDetailId: [data.budgetDetailId || 0],
      budgetId: [data.budgetId || 0],
      itemId: [data.itemId || '', Validators.required],
      companyId: [data.companyId || 0],
      quantity: [data.quantity || 0, Validators.required],
      unitId: [data.unitId, Validators.required],
      itemDescription: [data.itemDescription || '', Validators.required],
      price: [data.price || 0, Validators.required],
      iva: [data.iva || 0, Validators.required],
      discount: [data.discount || 0],
      total: [{ value: data.total || 0, disabled: false }]
    });
  }

  ngOnInit(): void {
    if (this.data.budgetDetailId > 0 && this.data.itemList) {
      this.budgetDetailForm.patchValue({
        budgetDetailId: this.data.budgetDetailId,
        budgetId: this.data.budgetId,
        itemId: this.data.itemId,
        companyId: this.data.companyId,
        quantity: this.data.quantity,
        unitId: this.data.unitId,
        itemDescription: this.data.itemDescription,
        price: this.data.price,
        iva: this.data.iva,
        discount: this.data.discount,
        total: this.data.total
      });
    }
  }
  calcularDesconto(){
    //discount comes in percentage
    const { quantity, price, iva, discount } = this.budgetDetailForm.value;
    if (quantity && price && iva !== null) {
      const total = quantity * price * (1 + iva / 100);
      const totalDiscount = total - (total * discount / 100);
      this.budgetDetailForm.patchValue({
        total: totalDiscount.toFixed(2)
      });
    }
  }

  getTotal(): void {
    const { quantity, price, iva } = this.budgetDetailForm.value;
    if (quantity && price && iva !== null) {
      const total = quantity * price * (1 + iva / 100);
      this.budgetDetailForm.patchValue({
        total: total.toFixed(2)
      });
    }
  }

  onChangeProduct(item: any): void {

    if (this.data.budgetDetailId != 0) {
      this.budgetDetailForm.patchValue({
        quantity: item.quantity || 1,
        price: item.sellingPrice,
        iva: item.iva,
        unitId: item.unitId,
        itemDescription: item.name
      });
      
    }
    this.getTotal();
  }

  onSave(): void {
    if (this.budgetDetailForm.valid) {
      this.dialogRef.close(this.budgetDetailForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
