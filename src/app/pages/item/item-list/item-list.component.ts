import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../Model/item.model';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../Model/unit.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit {

  columns = [
    { columnDef: 'ItemId', header: '#', cell: (element: any) => `${element.itemId}` },
    { columnDef: 'Code', header: 'Codigo', cell: (element: any) => `${element.code}` },
    { columnDef: 'Name', header: 'Nome', cell: (element: any) => `${element.name}` },
    { columnDef: 'UnitId', header: 'Unidade Medida', cell: (element: any) => `${element.symbol}` },
    { columnDef: 'CostPrice', header: 'Preço Custo (S/Iva)', cell: (element: any) => `${element.costPrice} €` },
    { columnDef: 'Margin', header: 'Margem ', cell: (element: any) => `${element.margin} %` },
    { columnDef: 'SellingPrice', header: 'Preço Venda (S/Iva)', cell: (element: any) => `${element.sellingPrice} €` },
    { columnDef: 'Iva', header: 'Iva', cell: (element: any) => `${element.iva} %` },
    { columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    //{ columnDef: 'lastUpdated', header: 'Last Updated', cell: (element: any) => `${element.lastUpdated}` },
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` }
  ]
  datasource: any = [];
  constructor(
    private itemService: ItemService,
    private unitService: UnitService) { }
  companyId: number = 0;

  ngOnInit(): void {
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;
    this.itemService.getItemsByEmpresa(this.companyId).subscribe((data: Item) => {
      this.datasource = data;
    });
    this.unitService.getUnitByEmpresa(this.companyId).subscribe((data: any) => {
      //get the name of the unit only and call int unitName
      this.datasource.forEach((element: any) => {
        element.unitName = data.find((x: any) => x.unitId == element.unitId).name;
        element.symbol = data.find((x: any) => x.unitId == element.unitId).symbol;
      });
    });
  }
}
