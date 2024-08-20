import { Injectable } from '@angular/core';
import { Client } from '../Model/client.model';
import { HTTPService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HTTPService) { }

  getAllUsers(): Observable<any> {
    return this.httpService.get<any>('/user');
  }
  createUser(user: any): Observable<any> {
    return this.httpService.post<any>('/user', user);
  }
  updateUser(user: any,userId: number): Observable<any> {
    return this.httpService.put<any>('/user/'+userId, user);
  }
  deleteUser(userId: number): Observable<any> {
    return this.httpService.delete<any>('/user/' + userId);
  }
  getUserById(userId: number): Observable<any> {
    return this.httpService.get<any>('/user/' + userId);
  }
  updateUserPassword(user: any): Observable<any> {
    return this.httpService.post<any>('/user/updatePassword', user);
  }
}
