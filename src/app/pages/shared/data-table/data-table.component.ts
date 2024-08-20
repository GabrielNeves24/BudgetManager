import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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
     MatIconModule,MatDialogModule,MatButtonModule,DatePipe
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

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr : ToastrService,
    private budgetService: BudgetService,
    private budgetManagerService: BudgetmanagerService,
    private userService: UserService
    ) {

    }
    showInactive = true;
    filteredDataSource = new MatTableDataSource<any>
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngOnInit() {
    this.filteredDataSource.data = this.data.filter((value: any) => value.active === true);
    //if exist a collum call active remove from display

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && this.columns) {
      this.displayedColumns = this.columns.map(c => c.columnDef);
      // Ensure the actions column is included
      if (!this.displayedColumns.includes('actions')) {
        this.displayedColumns.push('actions');
      }
    }
    if (changes['data'] && this.data) {
      this.dataSource.data = this.data;
    };
  }
  toggleInactiveRows() {
    //if clicked hide collumns with active = false
    this.showInactive = !this.showInactive;
    this.filterData();
  }

  hideColumn(columnName: string) {
    const index = this.displayedColumns.indexOf(columnName);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

  see(element:any): any {
    //hide this column
    this.hideColumn('Active');
  }
  filterData() {
    if (this.showInactive) {
      this.dataSource.data = this.data;
    } else {
      this.dataSource.data = this.data.filter((value: any) => value.active === true);
    }
  }

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
    var x = this.addNewRoute;
    if (this.addNewRoute) {
      this.router.navigate([this.addNewRoute]);
    }
  }

  onEdit(element: any) {
    //if is displaing the data of terminals, then navigate to the edit terminal page
    if (this.addNewRoute === 'item/create-item') {
      this.router.navigate(['item/edit-item', element.itemId]);
    }
    if (this.addNewRoute === 'unit/create-unit') {
      this.router.navigate(['unit/edit-unit', element.unitId]);
    }
    if (this.addNewRoute === 'client/create-client') {
      this.router.navigate(['client/edit-client', element.clientId]);
    }
    if (this.addNewRoute === 'budget/create-budget') {
      this.router.navigate(['budget/edit-budget', element.budgetId]);
    }
    if (this.addNewRoute === 'budgetManager/create-budgetManager') {
      this.router.navigate(['budgetManager/edit-budgetManager', element.budgetManagerId]);
    }
    if (this.addNewRoute === 'company/create-company') {
      this.router.navigate(['company/edit-company', element.companyId]);
    }
    if (this.addNewRoute === 'user/create-user') {
      this.router.navigate(['user/edit-user', element.userId]);
    }
  }
  onDelete(element: any) {
    //if is displaing the data of terminals, then navigate to the edit terminal page
    if (this.addNewRoute === 'item/create-item') {
      this.router.navigate(['item/delete-item', element.itemId]);
    }
    if (this.addNewRoute === 'unit/create-unit') {
      this.router.navigate(['unit/delete-unit', element.unitId]);
    }
    if (this.addNewRoute === 'client/create-client') {
      this.router.navigate(['client/delete-client', element.clientId]);
    }
    if (this.addNewRoute === 'budget/create-budget') {
      this.budgetService.deleteBudget(element.budgetId).subscribe(
        (data: any) => {
          this.toastr.success('Orçamento eliminado com sucesso');
          //remove the element from the data source
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetId !== element.budgetId);
          
        },
        (error: any) => {
          this.toastr.error('Impossivel eliminar');
        }
      );
    }
    if (this.addNewRoute === 'budgetManager/create-budgetManager') {
      this.budgetManagerService.deleteBudgetManager(element.budgetManagerId).subscribe(
        (data: any) => {
          this.toastr.success('Eliminado com sucesso');
          //remove the element from the data source
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.budgetManagerId !== element.budgetManagerId);
        },
        (error: any) => {
          this.toastr.error('Erro ao eliminar');
        }
      );
    }
    if (this.addNewRoute === 'company/create-company') {
      this.router.navigate(['company/delete-company', element.companyId]);
    }
    if (this.addNewRoute === 'user/create-user') {
     this.userService.deleteUser(element.userId).subscribe( 
        (data: any) => {
          this.toastr.success('User eliminado com sucesso');
          //remove the element from the data source
          this.dataSource.data = this.dataSource.data.filter((value: any) => value.userId !== element.userId);
        },
        (error: any) => {
          this.toastr.error('Erro ao eliminar');
        });
    }
  }

  ;

  

  onPrint(element: any) {
    this.router.navigate(['budget/pdf/', element.budgetId]);
  }
}


