import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute  } from  '@angular/router';
import { CommonModule } from '@angular/common';
import { UnitService } from '../../../services/unit.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-unit-create',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,CommonModule,MatSlideToggleModule],
  templateUrl: './unit-create.component.html',
  styleUrl: './unit-create.component.css'
})
export class UnitCreateComponent {

  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private route: ActivatedRoute,
    private unitService: UnitService
    ) {}

  isEditMode = false;
  empresaId: number = 0;
  private fb = inject(FormBuilder);
  unitForm = this.fb.group({
    unitId: 0,
    name: ['', [Validators.required]],
    symbol: ['', [Validators.required]],
    active: [true],
    companyId: 0,
    lastUpdated: null
  });
  unitID = 0;

  ngOnInit(): void {
    this.unitID = this.route.snapshot.params['unitID'];
    if (this.unitID != 0 && this.unitID != null) {
      this.isEditMode = true;
      this.loadUnit(this.unitID);
    }
  }

  loadUnit(unitID: number): void {
    this.unitService.getUnitById(unitID).subscribe((data: any) => {
      this.unitForm.patchValue(data);
    });
  }

  onCancel(): void {
    this.router.navigate(['/unit']);
  }


  onSubmit(): void {
    localStorage.getItem('empresa') ? this.empresaId = Number(localStorage.getItem('empresa')) : this.empresaId = 0;
     if (this.isEditMode) {
       //convert the form value to Item model
       
       this.unitService.updateUnit(this.unitForm.value,this.unitID).subscribe(() => {
         this.toastr.success('Unidade atualizada com sucesso');
         this.router.navigate(['/unit']);
       });
     } else {
      //set empresaId from local storage
      
      this.unitForm.patchValue({companyId: this.empresaId});
       this.unitService.createUnit(this.unitForm.value).subscribe(() => {
         this.toastr.success('Unidade criada com sucesso');
         this.router.navigate(['/unit']);
     });
     }
  }
      
}
