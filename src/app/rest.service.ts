import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

export interface EquipmentType {
  _id : string;
  name: string;

}

@Injectable()
export class RestService {

  constructor(private http: HttpClient) { }

  



  getAll(): Observable<any> {
    return this.http.get<any>('/api/EquipmentType')
  }

  public get(url: string) {
    return this.http.get(url);


  }


}
