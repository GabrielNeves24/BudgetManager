import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HTTPService } from './http.service';
import { Unit } from '../Model/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private httpService: HTTPService) { }

  getAllUnits(): Observable<Unit>{
    return this.httpService.get<Unit>('/Unit');
  }
  getUnitById(unitId: number): Observable<Unit>{
    return this.httpService.get<Unit>('/Unit/'+unitId);
  }
  createUnit(unit: any): Observable<any>{
    return this.httpService.post<any>('/Unit', unit);
  }
  updateUnit(unit: any, unitID: number): Observable<any>{
    return this.httpService.put<any>('/Unit/'+unitID, unit);
  }

  getUnitByEmpresa(empresaId: number): Observable<Unit>{
    return this.httpService.get<Unit>('/Unit/Empresa/'+empresaId);
  }
}
