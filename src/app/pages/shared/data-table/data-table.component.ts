import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
     MatIconModule,MatDialogModule,MatButtonModule,DatePipe,MatSelect,MatOption
     ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  
})
export class DataTableComponent<T> implements OnChanges, AfterViewInit, OnInit  {

  @Input()
  columns: Array<{ columnDef: string; header: string; cell: (element: any) => string; }> = [];
  @Input() data: any[] = [];
  @Input() addNewRoute: string = '';  // New property for dynamic route
  
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  showInactive = true;
  filteredDataSource = new MatTableDataSource<any>

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr : ToastrService,
    private budgetService: BudgetService,
    private budgetManagerService: BudgetmanagerService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
    ) { }
    
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

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
    debugger;
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
  see(element:any): any {
    //this.hideColumn('Active');
  }
  // exiteActive(): boolean {
  //   this.hideColumn('Active');
  //   return this.displayedColumns.includes('Active');
  // }
  exiteState(): boolean {
    return this.displayedColumns.includes('State');
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
    const routes = {
      'item/create-item': ['item/delete-item', element.itemId],
      'unit/create-unit': ['unit/delete-unit', element.unitId],
      'client/create-client': ['client/delete-client', element.clientId],
      'budget/create-budget': ['budget/delete-budget', element.budgetId],
      'budgetManager/create-budgetManager': ['budgetManager/delete-budgetManager', element.budgetManagerId],
      'company/create-company': ['company/delete-company', element.companyId],
      'user/create-user': ['user/delete-user', element.userId],
    };
    if (routes[this.addNewRoute as keyof typeof routes]) {
      this.router.navigate(routes[this.addNewRoute as keyof typeof routes]);
    } else if (this.addNewRoute === 'budget/create-budget') {
      this.budgetService.deleteBudget(element.budgetId).subscribe(
        (data: any) => {
          this.toastr.success('Orçamento eliminado com sucesso');
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetId !== element.budgetId);
        },
        (error: any) => {
          this.toastr.error('Impossível eliminar');
        }
      );
    } else if (this.addNewRoute === 'budgetManager/create-budgetManager') {
      this.budgetManagerService.deleteBudgetManager(element.budgetManagerId).subscribe(
        (data: any) => {
          this.toastr.success('Eliminado com sucesso');
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetManagerId !== element.budgetManagerId);
        },
        (error: any) => {
          this.toastr.error('Erro ao eliminar');
        }
      );
    } else if (this.addNewRoute === 'user/create-user') {
      this.userService.deleteUser(element.userId).subscribe(
        (data: any) => {
          this.toastr.success('User eliminado com sucesso');
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.userId !== element.userId);
        },
        (error: any) => {
          this.toastr.error('Erro ao eliminar');
        }
      );
    }
  }

  onPrint(element: any) {
    this.router.navigate(['budget/pdf/', element.budgetId]);
  }
  budgetsList: any[] = [];
  onClientDetail(element: any) {
    //nvigate to the client detail page
    this.router.navigate(['client/'+ element.clientId]);
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


