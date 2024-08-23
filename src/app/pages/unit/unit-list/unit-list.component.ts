import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../Model/unit.model';
import { DataTableComponent } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.css'
})
export class UnitListComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private unitService: UnitService
  ) { }
  columns = [
    { columnDef: 'unitId', header: '#', cell: (element: any) => `${element.unitId}` },
    { columnDef: 'name', header: 'Nome', cell: (element: any) => `${element.name}` },
    { columnDef: 'symbol', header: 'Simbolo', cell: (element: any) => `${element.symbol}` },
    { columnDef: 'active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` }
  ]
  datasource: any = [];
  empresaId: number = 0;
  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.empresaId = Number(localStorage.getItem('empresa')) : this.empresaId = 0;
    this.unitService.getUnitByEmpresa(this.empresaId).subscribe((data: Unit) => {
      this.datasource = data;
    });
  }

}
