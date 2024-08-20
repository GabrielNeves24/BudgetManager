import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute  } from  '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../Model/item.model';
import { CommonModule } from '@angular/common';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../Model/unit.model';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-item-create',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule
  ],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.css'
})
export class ItemCreateComponent implements OnInit {

  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private unitService: UnitService
    ) {}
  isEditMode = false;

  private fb = inject(FormBuilder);
  ItemForm = this.fb.group({
    itemId: 0,
    companyId: 0,
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    costPrice: [0, [Validators.required]],
    unitId: [0, [Validators.required]],
    margin: [0, [Validators.required]],
    sellingPrice: [0, [Validators.required]],
    iva: [0, [Validators.required]],
    active: [true],
    lastUpdated: null
  });

  Iva = [ { value: 0, viewValue: '0%' },
   { value: 6, viewValue: '6%' }, 
   { value: 13, viewValue: '13%' },
   { value: 23, viewValue: '23%' }];

   units: any = [];
   itemId: number = 0;
   companyID: number = 0;
  ngOnInit(): void {
    this.companyID = Number(localStorage.getItem('empresa'));
    this.itemId = this.route.snapshot.params['itemID'] || 0;
    if (this.itemId != 0) {
      this.isEditMode = true;
      this.loadItem(this.itemId);
    }
    this.unitService.getUnitByEmpresa(this.companyID).subscribe((data: Unit) => {
      this.units = data;
    });

  }

  loadItem(itemId: number): void {
    this.itemService.getItemById(itemId).subscribe((data: any) => {
      this.ItemForm.patchValue(data);
    });
  }

  calculaPrecoVenda(): void {
    //if the cost prica and margin are set or not equal to 0 then calculate the selling price
    if (this.ItemForm.get('costPrice')?.value == 0 || this.ItemForm.get('margin')?.value == 0) {
      return;
    } else {
      let costPrice = this.ItemForm.get('costPrice')?.value;
      let margin = this.ItemForm.get('margin')?.value ?? 0; // Add nullish coalescing operator
      let sellingPrice = costPrice ? +((costPrice * (1 + (margin / 100))).toFixed(2)) : 0;
      this.ItemForm.patchValue({sellingPrice: +sellingPrice.toFixed(2)}); // Convert sellingPrice to a number
    }
    
  }

  calculaMargem(): void {
    if (this.ItemForm.get('costPrice')?.value == 0 || this.ItemForm.get('sellingPrice')?.value == 0) {
      return;
    } else {
      let costPrice = this.ItemForm.get('costPrice')?.value;
      let sellingPrice = this.ItemForm.get('sellingPrice')?.value ?? 0; // Add nullish coalescing operator
      let margin = costPrice ? +(((sellingPrice - costPrice) / costPrice) * 100) : 0;
      this.ItemForm.patchValue({margin: +margin.toFixed(2)}); // Convert margin to a number
    }
  }
  

  onCancel(): void {
    this.router.navigate(['/item']);
  }


  onSubmit(): void {
     if(this.ItemForm.invalid){
      this.toastr.error('Por favor preencha todos os campos obrigatórios!');
      return;
     }
     debugger;
     if (this.isEditMode) {
      //convert the form value to Item model
      this.itemService.updateItem(this.ItemForm.value,this.itemId).subscribe(() => {
        this.toastr.success('Artigo atualizado com sucesso');
        this.router.navigate(['/item']);
      });
    } else {
     this.ItemForm.patchValue({companyId: this.companyID});
      this.itemService.createItem(this.ItemForm.value).subscribe(() => {
        this.toastr.success('Artigo criado com sucesso');
        this.router.navigate(['/item']);
    });
    }
  }

}
