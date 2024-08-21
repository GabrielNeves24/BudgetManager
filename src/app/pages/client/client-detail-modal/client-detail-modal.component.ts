import { Component, Inject, Input, OnInit,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [MatTabsModule,CommonModule,MatDialogModule,MatTableModule,MatPaginatorModule],
  templateUrl: './client-detail-modal.component.html',
  styleUrl: './client-detail-modal.component.css'
})
export class ClientDetailModalComponent implements OnInit {
  @Input() data: any = {};
  
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  
  columns: Array<{ columnDef: string; header: string; cell: (element: any) => string; }> = [];
  
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(public dialogRef: MatDialogRef<ClientDetailModalComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dialogData.budgetsList || []);
    this.columns = this.dialogData.columns || [];
    this.displayedColumns = this.columns.map(c => c.columnDef);
    
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  filteredBudgets(state: string): any[] {
    return this.dataSource.data.filter((budget: any) => budget.state === state);
  }

  getHistogramWidth(totalWithIva: number): string {
    const maxValue = 1000; // Adjust based on your data
    const width = Math.min(100, (totalWithIva / maxValue) * 100); // Percentage
    return `${width}%`;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}