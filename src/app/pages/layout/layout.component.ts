import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    CommonModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  title = 'angular-material-tutorial';
  opened = false;
  imageAddress: any;
  constructor(private router: Router, private company: CompanyService,private authService: AuthService) {}

  showFiller = false;
  nameUser = 'User';
  isAdmin = false;
  companyId  = 0;
  companyName = '';
  apiUrl = '';
  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role == 'A') {
      this.isAdmin = true;
    }
    this.nameUser = user.username;
    localStorage.getItem('empresa') ? this.companyId = Number(localStorage.getItem('empresa')) : this.companyId = 0;

    this.company.getCompanyById(this.companyId).subscribe((data) => {
      this.companyName = data.name;
    });
    this.imageAddress = `${this.authService.getApiUrl()}/company/logo/${this.companyId}`;

  }
  goToEditCompany() {
    this.router.navigate(['/company/edit-company/'+this.companyId]);
  }


  ifUserDemo() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role == 'A' || user.role == 'U') {
      return true;
    }
    return false;
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


}
