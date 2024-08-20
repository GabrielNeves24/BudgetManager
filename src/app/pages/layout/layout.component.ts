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
  constructor(private router: Router) {}

  showFiller = false;

  isAdmin = false;
  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role == 'A') {
      this.isAdmin = true;
    }
    
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


}
