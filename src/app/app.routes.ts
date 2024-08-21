import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { ItemListComponent } from './pages/item/item-list/item-list.component';
import { ItemCreateComponent } from './pages/item/item-create/item-create.component';
import { UnitListComponent } from './pages/unit/unit-list/unit-list.component';
import { UnitCreateComponent } from './pages/unit/unit-create/unit-create.component';
import { ClientListComponent } from './pages/client/client-list/client-list.component';
import { ClientCreateComponent } from './pages/client/client-create/client-create.component';
import { BudgetListComponent } from './pages/budget/budget-list/budget-list.component';
import { BudgetCreateComponent } from './pages/budget/budget-create/budget-create.component';
import { BudgetPdfComponent } from './pages/budget/budget-pdf/budget-pdf.component';
import { BudgetManagerGestaoComponent } from './pages/admin/budget-manager-gestao/budget-manager-gestao.component';
import { BudgetManagerGestaoCreateComponent } from './pages/admin/budget-manager-gestao-create/budget-manager-gestao-create.component';
import { CompanyListComponent } from './pages/admin/company/company-list/company-list.component';
import { CompanyCreateComponent } from './pages/admin/company/company-create/company-create.component';
import { UserListComponent } from './pages/admin/user/user-list/user-list.component';
import { UserCreateComponent } from './pages/admin/user/user-create/user-create.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClientDetailComponent } from './pages/client/client-detail/client-detail.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'',
        component: LayoutComponent,
        children: [
            
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
            { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

            { path: 'item', component: ItemListComponent, canActivate: [authGuard] },
            { path: 'item/create-item', component: ItemCreateComponent,canActivate: [authGuard] },
            { path: 'item/edit-item/:itemID', component: ItemCreateComponent,canActivate: [authGuard] },

            { path: 'unit', component: UnitListComponent, canActivate: [authGuard] },
            { path: 'unit/create-unit', component: UnitCreateComponent, canActivate: [authGuard] },
            { path: 'unit/edit-unit/:unitID', component: UnitCreateComponent, canActivate: [authGuard] },

            { path: 'client', component: ClientListComponent, canActivate: [authGuard] },
            { path: 'client/create-client', component: ClientCreateComponent, canActivate: [authGuard] },
            { path: 'client/edit-client/:clientID', component: ClientCreateComponent, canActivate: [authGuard] },
            { path: 'client/:clientId', component: ClientDetailComponent, canActivate: [authGuard] },

            { path: 'budget', component: BudgetListComponent, canActivate: [authGuard] },
            { path: 'budget/create-budget', component: BudgetCreateComponent, canActivate: [authGuard] },
            { path: 'budget/edit-budget/:budgetId', component: BudgetCreateComponent, canActivate: [authGuard] },
            { path: 'budget/pdf/:id', component: BudgetPdfComponent, canActivate: [authGuard] },

            { path: 'budgetManager', component: BudgetManagerGestaoComponent, canActivate: [authGuard] },
            { path: 'budgetManager/create-budgetManager', component: BudgetManagerGestaoCreateComponent, canActivate: [authGuard] },
            { path: 'budgetManager/edit-budgetManager/:budgetManagerId', component: BudgetManagerGestaoCreateComponent, canActivate: [authGuard] },

            { path: 'company', component: CompanyListComponent, canActivate: [authGuard] },
            { path: 'company/create-company', component: CompanyCreateComponent, canActivate: [authGuard] },
            { path: 'company/edit-company/:companyId', component: CompanyCreateComponent, canActivate: [authGuard] },

            { path: 'user', component: UserListComponent, canActivate: [authGuard] },
            { path: 'user/create-user', component: UserCreateComponent, canActivate: [authGuard] },
            { path: 'user/edit-user/:userId', component: UserCreateComponent, canActivate: [authGuard] },
        ]
    }



];
