import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router 
  ) { }
  columns = [
    { columnDef: 'UserId', header: '#', cell: (element: any) => `${element.userId}` },
    { columnDef: 'Username', header: 'Nome', cell: (element: any) => `${element.username}` },
    { columnDef: 'Role', header: 'Função', cell: (element: any) => `${element.role}` },
    { columnDef: 'Email', header: 'Email', cell: (element: any) => `${element.email}` },
    { columnDef: 'Active', header: 'Ativo', cell: (element: any) => `${element.active}` },
    { columnDef: 'LastLogin', header: 'Último Login', cell: (element: any) => `${element.lastLogin}` },
    { columnDef: 'actions', header: 'Actions', cell: (element: any) => `${element.actions}` }
  ]
  datasource: any = [];
  ngOnInit(): void {
    this.authService.checkIfUserIsAdmin();
    this.userService.getAllUsers().subscribe((data: any) => {
      this.datasource = data;
    });
  }

}


