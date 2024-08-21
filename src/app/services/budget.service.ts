import { Injectable } from '@angular/core';
import { HTTPService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(
    private httpService: HTTPService
  ) { }

  getAllBudgets(): Observable<any> {
    return this.httpService.get<any>('/budget');
  }
  getBudgetById(budgetId: number): Observable<any> {
    return this.httpService.get<any>('/budget/' + budgetId);
  }
  updateBudget(budget: any,budgetId: number): Observable<any> {
    return this.httpService.put<any>('/budget/'+budgetId, budget);
  }
  createBudget(budget: any): Observable<any> {
    return this.httpService.post<any>('/budget', budget);
  }
  
  deleteBudget(budgetId: number): Observable<any> {
    return this.httpService.delete<any>('/budget/' + budgetId);
  }

  getBudgetByCompanyId(companyId: number): Observable<any> {
    return this.httpService.get<any>('/budget/Empresa/' + companyId);
  }
  getBudgetByClientID(clientId: number): Observable<any> {
    return this.httpService.get<any>('/budget/client/' + clientId);
  }


}
