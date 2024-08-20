import { Injectable } from '@angular/core';
import { HTTPService } from './http.service';
import { Item } from '../Model/item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpService: HTTPService) { }

  getAllItemsList(): Observable<Item>{
    return this.httpService.get<Item>('/Item');
  }

  getItemById(id: number): Observable<Item>{
    return this.httpService.get<Item>(`/Item/${id}`);
  }

  updateItem(item: any,id: number): Observable<any>{
    return this.httpService.put<any>('/Item/'+id, item);
  }

  createItem(item: any): Observable<any>{
    return this.httpService.post<any>('/Item', item);
  }

  getItemsByEmpresa(empresaId: number): Observable<Item>{
    return this.httpService.get<Item>('/Item/Empresa/'+empresaId);
  }
}
