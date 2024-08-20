import { Injectable } from '@angular/core';
import { HTTPService } from '../http.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BudgetmanagerService {

  constructor(
    private httpService: HTTPService
  ) { }

  getAllBudgetManagers(): Observable<any> {
    return this.httpService.get<any>('/budgetManager');
  }
  createBudgetManager(budgetManager: any): Observable<any> {
    return this.httpService.post<any>('/budgetManager', budgetManager);
  }
  updateBudgetManager(budgetManager: any,budgetManagerId: number): Observable<any> {
    return this.httpService.put<any>('/budgetManager/'+budgetManagerId, budgetManager);
  }
  deleteBudgetManager(budgetManagerId: number): Observable<any> {
    return this.httpService.delete<any>('/budgetManager/' + budgetManagerId);
  }
  getBudgetManagerById(budgetManagerId: number): Observable<any> {
    return this.httpService.get<any>('/budgetManager/' + budgetManagerId);
  }
}
