import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BudgetService } from '../../../services/budget.service';
import { BudgetmanagerService } from '../../../services/admin/budgetmanager.service';
import { UserService } from '../../../services/user.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { ClientDetailModalComponent } from '../../client/client-detail-modal/client-detail-modal.component';
import { ItemService } from '../../../services/item.service';
import { UnitService } from '../../../services/unit.service';
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule,
    MatInputModule, 
    MatFormFieldModule,
     MatPaginatorModule, 
     MatSortModule, 
     MatTableModule,
     MatButtonModule, 
     MatDividerModule, 
     MatIconModule,MatDialogModule,MatButtonModule,DatePipe,MatSelect,MatOption,ConfirmationDialogComponent
     ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  
})
export class DataTableComponent<T> implements OnChanges, AfterViewInit, OnInit  {

  @Input()
  columns: Array<{ columnDef: string; header: string; cell: (element: any) => string; }> = [];
  @Input() data: any[] = [];
  @Input() addNewRoute: string = '';  // New property for dynamic route
  @Input() routeBefore: string = '';
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  showInactive = false;
  filteredDataSource = new MatTableDataSource<any>

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr : ToastrService,
    private budgetService: BudgetService,
    private budgetManagerService: BudgetmanagerService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private itemService: ItemService,
    private unitService: UnitService,
    private clienteService: ClientService,
    private companyService: CompanyService,
    ) { }
    
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  sortedData: [] = [];
  ngOnInit() {
    if (this.data && Array.isArray(this.data)) {
      this.dataSource.data = this.data;
      this.filterData(); // Apply initial filter based on active status
    }else{
      this.toastr.error('Erro ao obter os dados');
    }
  }
  existeActive: boolean = false; 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && this.columns) {
      this.displayedColumns = this.columns.map(c => c.columnDef);
      if (!this.displayedColumns.includes('actions')) {
        this.displayedColumns.push('actions');
      }
    }
    

    if (changes['data'] && this.data) {
      this.dataSource.data = this.data;
      this.filterData(); 
      this.cdr.detectChanges();
    }
    //if the datasource has the column active 
    if (this.displayedColumns.includes('Active')) {
      this.existeActive = true;
      this.hideColumn('Active');
    }
  }
  toggleInactiveRows() {
    this.showInactive = !this.showInactive;
    this.filterData();
  }
  filterByState(event: any) {
    const state = event.value;
    if (state === 'Todos') {
      this.dataSource.data = this.data; // Show all data if 'all' is selected
    } else {
      if (this.data && Array.isArray(this.data)) {
        this.filteredDataSource.data = this.data.filter((value: any) => value.state === state);
        this.dataSource.data = this.filteredDataSource.data
      } else {
        this.toastr.error('Erro ao obter os dados');
      }
    }
  }

  
  sortData(sort: Sort) {  
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'BudgetId': return compare(a.budgetId, b.budgetId, isAsc);
        case 'ClientName': return compare(a.clientName, b.clientName, isAsc);
        case 'Date': return compare(new Date(a.date), new Date(b.date), isAsc);
        case 'Total S/Iva': return compare(a.totalWithoutIva, b.totalWithoutIva, isAsc);
        case 'Iva': return compare(a.totalIva, b.totalIva, isAsc);
        case 'Total c/Iva': return compare(a.totalWithIva, b.totalWithIva, isAsc);
        case 'Estado': return compare(a.state, b.state, isAsc);
        default: return 0;
      }
    });
  }


  hideColumn(columnName: string) {
    const index = this.displayedColumns.indexOf(columnName);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

  
  filterData() {
    if (this.showInactive) {
      this.dataSource.data = this.data;
    } else {
      this.dataSource.data = this.data.filter((value: any) => value.active === true);
    }
  }
  navigateBack() {
    this.router.navigate([this.routeBefore]);
  }

  exiteState(): boolean {
    return this.displayedColumns.includes('Estado');
  }
  selectedState: string = 'Todos';
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToAddNew() {
    if (this.addNewRoute) {
      this.router.navigate([this.addNewRoute]);
    }
  } 

  onEdit(element: any) {
    const routes: { [key: string]: any[] } = {
      'item/create-item': ['item/edit-item', element.itemId],
      'unit/create-unit': ['unit/edit-unit', element.unitId],
      'client/create-client': ['client/edit-client', element.clientId],
      'budget/create-budget': ['budget/edit-budget', element.budgetId],
      'budgetManager/create-budgetManager': ['budgetManager/edit-budgetManager', element.budgetManagerId],
      'company/create-company': ['company/edit-company', element.companyId],
      'user/create-user': ['user/edit-user', element.userId],
    };
    if (routes[this.addNewRoute]) {
      this.router.navigate(routes[this.addNewRoute]);
    } 
  }

  onDelete(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px', height: '200px',
      data: { message : 'Tem a certeza que deseja eliminar?' }
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (this.addNewRoute) {
          case 'item/create-item':
            this.itemService.deleteItem(element.itemId).subscribe(
              () => {
                this.toastr.success('Item eliminado com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.itemId !== element.itemId);
              },
              () => {
                this.toastr.error('Erro ao eliminar Artigo');
              }
            );
            break;
  
          case 'unit/create-unit':
            this.unitService.deleteUnit(element.unitId).subscribe(
              () => {
                this.toastr.success('Unidade eliminada com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.unitId !== element.unitId);
              },
              () => {
                this.toastr.error('Erro ao eliminar Unidade');
              }
            );
            break;
  
          case 'client/create-client':
            this.clienteService.deleteClient(element.clientId).subscribe(
              () => {
                this.toastr.success('Cliente eliminado com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.clientId !== element.clientId);
              },
              () => {
                this.toastr.error('Erro ao eliminar Cliente');
              }
            );
            break;
  
          case 'budget/create-budget':
            this.budgetService.deleteBudget(element.budgetId).subscribe(
              () => {
                this.toastr.success('Orçamento eliminado com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetId !== element.budgetId);
              },
              () => {
                this.toastr.error('Impossível eliminar Orçamento');
              }
            );
            break;
  
          case 'budgetManager/create-budgetManager':
            this.budgetManagerService.deleteBudgetManager(element.budgetManagerId).subscribe(
              () => {
                this.toastr.success('Eliminado com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetManagerId !== element.budgetManagerId);
              },
              () => {
                this.toastr.error('Erro ao eliminar');
              }
            );
            break;
  
          case 'company/create-company':
            this.companyService.deleteCompany(element.companyId).subscribe(
              () => {
                this.toastr.success('Empresa eliminada com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.companyId !== element.companyId);
              },
              () => {
                this.toastr.error('Erro ao eliminar Empresa');
              }
            );
            break;
  
          case 'user/create-user':
            this.userService.deleteUser(element.userId).subscribe(
              () => {
                this.toastr.success('User eliminado com sucesso');
                this.dataSource.data = this.dataSource.data.filter((value: any) => value.userId !== element.userId);
              },
              () => {
                this.toastr.error('Erro ao eliminar');
              }
            );
            break;
  
          default:
            this.toastr.error('Operação não reconhecida');
            break;
        }
      }
    });
  }
  


  onPrint(element: any) {
    this.router.navigate(['budget/pdf/', element.budgetId]);
  }
  budgetsList: any[] = [];

  onClientDetail(element: any) {
    //nvigate to the client detail page
    this.router.navigate(['client/', element.clientId]);
    // this.budgetService.getBudgetByClientID(element.clientId).subscribe(
    //   (data: any) => {
    //     this.budgetsList = data;
    //     this.openClientDetailModal(element.clientId);
    //   },
    //   (error: any) => {
    //     this.toastr.error('Erro ao obter os orçamentos');
    //   }
    // );
  }
  

  collumnsToSendClientModal = [
    { columnDef: 'budgetId', header: 'Orçamento', cell: (element: any) => `${element.budgetId}` },
    { columnDef: 'state', header: 'Estado', cell: (element: any) => `${element.state}` },
    { columnDef: 'totalWithoutIva', header: 'Total sem IVA', cell: (element: any) => `${element.totalWithoutIva}` },
    { columnDef: 'totalWithIva', header: 'Total com IVA', cell: (element: any) => `${element.totalWithIva}` },
  ];

  openClientDetailModal(clientId: string) {
    this.dialog.open(ClientDetailModalComponent, {
      width: '80%',
      data: {
        clientId: clientId,
        budgetsList: this.budgetsList,
        length: this.budgetsList.length,
        columns: this.collumnsToSendClientModal
      },
      
    });
  }
}


function compare(a: any, b: any, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

