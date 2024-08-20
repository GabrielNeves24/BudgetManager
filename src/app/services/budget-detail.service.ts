import { Injectable } from '@angular/core';
import { HTTPService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetDetailService {

  constructor(
    private httpService: HTTPService
  ) { }

  getAllBudgetDetails(id:number): Observable<any> {
    return this.httpService.get<any>('/budgetDetail/'+id);
  }
  createBudgetDetail(budgetDetail: any): Observable<any> {
    return this.httpService.post<any>('/budgetDetail', budgetDetail);
  }
  updateBudgetDetail(budgetDetail: any,budgetDetailId: number): Observable<any> {
    return this.httpService.put<any>('/budgetDetail/'+budgetDetailId, budgetDetail);
  }

  getCompanyInfo(): Observable<any> {
    return this.httpService.get<any>('/company');
  }
  deleteBudgetDetail(budgetDetailId: number): Observable<any> {
    return this.httpService.delete<any>('/budgetDetail/' + budgetDetailId);
  }
  

  
}
