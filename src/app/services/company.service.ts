import { Injectable } from '@angular/core';
import { Client } from '../Model/client.model';
import { HTTPService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpService: HTTPService) { }

  getAllCompanies(): Observable<any> {
    return this.httpService.get<any>('/company');
  }
  createCompany(company: any): Observable<any> {
    return this.httpService.post<any>('/company', company);
  }
  updateCompany(company: any,companyId: number): Observable<any> {
    return this.httpService.put<any>('/company/'+companyId, company);
  }
  deleteCompany(companyId: number): Observable<any> {
    return this.httpService.delete<any>('/company/' + companyId);
  }
  getCompanyById(companyId: number): Observable<any> {
    return this.httpService.get<any>('/company/' + companyId);
  }
  uploadCompanyLogo(formData: FormData, companyId: number): Observable<any> {
    return this.httpService.post<any>('/company/logo/' + companyId, formData);
  }
}
