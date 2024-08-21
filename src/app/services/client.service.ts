import { Injectable } from '@angular/core';
import { Client } from '../Model/client.model';
import { HTTPService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private httpService: HTTPService) { }

  getAllClients(): Observable<any>{
    return this.httpService.get<any>('/Client');
  }
  getClientById(clientId: number): Observable<Client>{
    return this.httpService.get<Client>('/Client/'+clientId);
  }
  createClient(client: any): Observable<any>{
    return this.httpService.post<any>('/Client',client);
  }
  updateClient(client: any, clientId: number): Observable<any>{
    return this.httpService.put<any>('/Client/'+clientId,client);
  }
  getAllClientsByCompany(companyId:number): Observable<any>{
    return this.httpService.get<any>('/Client/Empresa/'+companyId);
  }

  deleteClient(clientId: number): Observable<any>{
    return this.httpService.delete<any>('/Client/'+clientId);
  }
  
}
